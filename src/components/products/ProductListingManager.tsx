"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useAdmin } from "@/context/AdminContext";
import { useCategories, Category } from "@/hooks/useCategories";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus, Trash2, Edit, X } from "lucide-react";
import ProductFilters from "./ProductFilters";
import Pagination from "../ui/Pagination";

// Types
type CategoryRef = { val: string; name: string };
type Product = {
  product_code: string;
  product_type: string;
  product_name: string;
  category?: CategoryRef;
  subcategory?: CategoryRef;
  images: string[];
  features: string[];
  technical_features?: string[];
  price?: string;
  pdf_manual?: string;
  order?: number;
};

const PRODUCTS_PER_PAGE = 12;

// Sortable Item Component
function SortableProductCard({ product, onDelete }: { product: Product, onDelete: (code: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: product.product_code });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="group bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm relative flex flex-col">
      {/* Drag Handle */}
      <div {...attributes} {...listeners} className="absolute top-2 right-2 z-10 p-2 bg-white/80 rounded-md cursor-grab active:cursor-grabbing hover:bg-gray-100">
        <GripVertical size={20} className="text-gray-500" />
      </div>

      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (confirm(`Delete ${product.product_name}?`)) onDelete(product.product_code);
        }}
        className="absolute top-2 left-2 z-10 p-2 bg-white/80 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
        title="Delete Product"
      >
        <Trash2 size={20} />
      </button>

      <div className="relative h-48 bg-gray-50 p-4 flex items-center justify-center border-b border-gray-100">
        <div className="relative w-full h-full">
          <Image
            src={product.images[0] || '/placeholder.jpg'}
            alt={product.product_name}
            fill
            className="object-contain"
            unoptimized
          />
        </div>
      </div>

      <div className="p-4 flex-grow flex flex-col">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">{product.product_type}</span>
        <h3 className="text-sm font-bold text-black mb-2 line-clamp-2">
          {product.product_name}
        </h3>
        <Link href={`/products/${product.product_code}`} className="mt-auto text-blue-600 text-sm font-bold hover:underline">
          Edit Details
        </Link>
      </div>
    </div>
  );
}

interface ProductListingManagerProps {
  initialProducts: Product[];
  initialCategories: Category[];
}

export default function ProductListingManager({ initialProducts, initialCategories }: ProductListingManagerProps) {
  const { isAdminMode } = useAdmin();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Sensors for DnD
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const pageParam = searchParams.get('page');

  const filterCat = category?.toLowerCase();
  const currentPage = pageParam ? parseInt(pageParam) : 1;

  // Get active categories from hook to use for dynamic matching
  // Use initialCategories if hook is loading or empty (server data fallback)
  const { categories: contextCategories } = useCategories();
  const categories = contextCategories.length > 0 ? contextCategories : initialCategories;

  useEffect(() => {
    // Sync local products if initialProducts changes (e.g. revalidation)
    // Only if NOT in admin mode (Admin mode manages its own state via fetch/DnD)
    if (!isAdminMode) {
      setProducts(initialProducts);
    }
  }, [initialProducts, isAdminMode]);

  // Admin Mode: Fetch fresh list to ensure correct order
  useEffect(() => {
    if (isAdminMode) {
      fetch('/api/products', { cache: 'no-store' })
        .then(res => res.json())
        .then(data => setProducts(data))
        .catch(err => console.error("Failed to fetch products", err));
    }
  }, [isAdminMode]);

  const matchesCategory = useCallback((product: Product) => {
    if (!filterCat) return true;

    // 1. Relational Match (Priority)
    if (product.category) {
      if (product.category.val === filterCat) return true;
      if (product.subcategory && product.subcategory.val === filterCat) return true;
      return false;
    }

    const type = product.product_type.toLowerCase();

    // 2. Legacy / Special Keys (Fallback)
    const legacyKeys = [
      "mdvr", "mdvr-basic", "mdvr-enhanced", "mdvr-ai",
      "dashcam", "camera", "rfid", "accessories"
    ];

    if (legacyKeys.includes(filterCat)) {
      if (filterCat === "mdvr-basic") return type.includes("basic version mdvr");
      if (filterCat === "mdvr-enhanced") return type.includes("enhanced version mdvr");
      if (filterCat === "mdvr-ai") return type.includes("ai version mdvr");

      if (filterCat === "mdvr") return type.includes("mdvr");
      if (filterCat === "dashcam") return type.includes("dashcam");
      if (filterCat === "camera") return type.includes("camera") || type.includes("bullet") || type.includes("dome");
      if (filterCat === "rfid") return type.includes("rfid") || type.includes("tag") || type.includes("reader");
      if (filterCat === "accessories") return type.includes("monitor") || type.includes("accessories") || type.includes("cable") || type.includes("sensor");
      return false;
    }

    // 3. Dynamic String Match
    const allCats = [
      ...categories,
      ...categories.flatMap(c => c.subcategories || [])
    ];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const matchedCategory = (allCats as any[]).find(c => c.val === filterCat);

    if (matchedCategory) {
      return type === matchedCategory.name.toLowerCase();
    }

    return false;
  }, [filterCat, categories]);

  // Filter products
  // Memoize to avoid re-filtering on every render if inputs didn't change
  const filteredProducts = useMemo(() => {
    // In Admin Mode, current 'products' state is the source (handled by DnD)
    // In User Mode, 'products' state is sync'd with initialProducts
    return products.filter(matchesCategory);
  }, [products, matchesCategory]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    return filteredProducts.slice(
      (currentPage - 1) * PRODUCTS_PER_PAGE,
      currentPage * PRODUCTS_PER_PAGE
    );
  }, [filteredProducts, currentPage]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setProducts((items) => {
        const oldIndex = items.findIndex((p) => p.product_code === active.id);
        const newIndex = items.findIndex((p) => p.product_code === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);

        // Save new order
        const productsToSave = newItems.map((p, index) => ({ ...p, order: index + 1 }));

        fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ products: productsToSave })
        }).catch(err => console.error("Failed to save order", err));

        return newItems;
      });
    }
  };

  const handleAddProduct = async () => {
    const name = prompt("Enter Product Name:");
    if (!name) return;

    const code = prompt("Enter Unique Product Code (e.g. AXG99):")?.trim().toUpperCase();
    if (!code) return;

    if (products.some(p => p.product_code === code)) {
      alert("Product Code already exists!");
      return;
    }

    const newProduct: Product = {
      product_code: code,
      product_name: name,
      product_type: "Uncategorized",
      images: [],
      features: ["New Product Feature"],
      technical_features: [],
      order: products.length + 1
    };

    const newProducts = [...products, newProduct];
    setProducts(newProducts);

    // Save immediately
    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: newProducts })
      });

      // Redirect to edit
      window.location.href = `/products/${code}`;
    } catch (e) {
      console.error(e);
      alert("Failed to create product");
    }
  };

  const handleDeleteProduct = async (code: string) => {
    const newProducts = products.filter(p => p.product_code !== code);
    setProducts(newProducts);

    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: newProducts })
      });
    } catch (e) {
      console.error(e);
      alert("Failed to delete product");
    }
  };

  if (!isAdminMode) {
    // Render Standard Grid with Filters and Pagination
    return (
      <div>
        {/* Filters */}
        <ProductFilters activeCategory={filterCat} categories={categories} />

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 min-h-[400px]">
          {paginatedProducts.map((product) => (
            <Link
              key={product.product_code}
              href={`/products/${product.product_code}`}
              className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-black hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              <div className="relative h-64 bg-white p-4 flex items-center justify-center border-b border-gray-100">
                <div className="relative w-full h-full">
                  <Image
                    src={product.images[0] || '/placeholder.jpg'}
                    alt={product.product_name}
                    fill
                    className="object-contain group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    unoptimized
                  />
                </div>
              </div>

              <div className="p-6 flex-grow flex flex-col">
                <span className="text-xs font-bold text-black uppercase tracking-wider mb-2 block">{product.product_type}</span>
                <h3 className="text-lg font-bold text-black mb-3 group-hover:underline decoration-2 underline-offset-4 transition-all line-clamp-2">
                  {product.product_name}
                </h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-3 flex-grow">
                  {product.features?.[0] || "High performance vehicle safety solution."}
                </p>
                <div className="mt-auto">
                  {product.price && <span className="block text-lg font-bold text-blue-600 mb-2">{product.price}</span>}
                  <span className="text-sm font-bold text-black flex items-center gap-1 group-hover:gap-2 transition-all">
                    View Details &rarr;
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {paginatedProducts.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-xl font-bold text-gray-400">No products found in this category.</h3>
            <Link href="/products" className="text-black font-bold mt-4 inline-block hover:underline">View all products</Link>
          </div>
        )}

        {/* Pagination */}
        {paginatedProducts.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            baseUrl="/products"
            // Pass current search params except page to preserve them
            searchParams={Object.fromEntries(searchParams)}
          />
        )}
      </div>
    );
  }

  // Admin View
  return (
    <div>
      <div className="flex justify-between items-center mb-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <div>
          <h3 className="font-bold text-yellow-800">Admin Mode Active</h3>
          <p className="text-sm text-yellow-700">Drag items to reorder. Changes save automatically.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleAddProduct}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-blue-700"
          >
            <Plus size={16} /> Add Product
          </button>
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="bg-black text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-gray-800"
          >
            <Edit size={16} /> Manage Categories
          </button>
        </div>
      </div>

      {/* Filters in Admin for Easier Management ? Optional. 
          Currently Admin view shows ALL items unless we want to support filtering there too.
          But DnD usually implies a global order. 
          If we filter in admin, we can't drag product A to position 1 if position 1 is hidden.
          So Admin View usually shows EVERYTHING or handles filtering differently.
          The previous code filtered visibleProducts. 
          Let's keep filtering for Admin but be aware DnD might be weird if filtered.
          Actually, SortableContext needs the items present.
      */}

      <ProductFilters activeCategory={filterCat} categories={categories} />

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={filteredProducts.map(p => p.product_code)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
            {filteredProducts.map((product) => (
              <SortableProductCard
                key={product.product_code}
                product={product}
                onDelete={handleDeleteProduct}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {isCategoryModalOpen && <CategoryManagerModal onClose={() => setIsCategoryModalOpen(false)} />}
    </div>
  );
}

function CategoryManagerModal({ onClose }: { onClose: () => void }) {
  const { categories, saveCategories, refreshCategories } = useCategories();
  const [localCategories, setLocalCategories] = useState<Category[]>(categories);
  // const [expandedCat, setExpandedCat] = useState<string | null>(null);

  // Sync when categories load
  useEffect(() => { setLocalCategories(categories); }, [categories]);

  // Add Main Category
  const addCategory = () => {
    const name = prompt("Enter new Main Category name:");
    if (!name) return;
    const val = name.toLowerCase().replace(/\s+/g, '-');

    if (localCategories.some(c => c.val === val)) {
      alert("Category already exists!");
      return;
    }

    setLocalCategories(prev => [
      ...prev,
      { name, val, href: `/products?category=${val}`, subcategories: [] }
    ]);
  };

  // Add Subcategory
  const addSubCategory = (parentVal: string) => {
    const name = prompt("Enter subcategory name:");
    if (!name) return;
    const val = name.toLowerCase().replace(/\s+/g, '-');

    setLocalCategories(prev => prev.map(cat => {
      if (cat.val === parentVal) {
        const subs = cat.subcategories || [];
        return {
          ...cat,
          subcategories: [...subs, { name, href: `/products?category=${val}`, val }]
        };
      }
      return cat;
    }));
  };

  // Remove Category (Main)
  const removeCategory = (catVal: string) => {
    if (!confirm("Delete this Main Category and all its subcategories?")) return;
    setLocalCategories(prev => prev.filter(c => c.val !== catVal));
  };

  // Remove Subcategory
  const removeSubCategory = (parentVal: string, subVal: string) => {
    if (!confirm("Are you sure?")) return;
    setLocalCategories(prev => prev.map(cat => {
      if (cat.val === parentVal) {
        return {
          ...cat,
          subcategories: (cat.subcategories || []).filter(s => s.val !== subVal)
        };
      }
      return cat;
    }));
  };

  // Save
  const handleSave = async () => {
    await saveCategories(localCategories);
    await refreshCategories();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-xl">Manage Categories</h3>
          <div className="flex gap-2">
            <button
              onClick={addCategory}
              className="bg-green-600 text-white px-3 py-1.5 rounded-lg font-bold text-sm hover:bg-green-700 flex items-center gap-1"
            >
              <Plus size={16} /> New Category
            </button>
            <button onClick={onClose}><X /></button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-grow space-y-4">
          {localCategories.map(cat => (
            <div key={cat.val} className="border rounded-lg p-4 bg-white shadow-sm">
              <div className="flex justify-between items-center mb-2 border-b pb-2">
                <span className="font-bold text-lg">{cat.name}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => addSubCategory(cat.val || '')}
                    className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-bold hover:bg-blue-100"
                  >
                    + Subcat
                  </button>
                  <button
                    onClick={() => removeCategory(cat.val)}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Delete Category"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {cat.subcategories && cat.subcategories.length > 0 ? (
                <ul className="space-y-2 ml-4 mt-2">
                  {cat.subcategories.map(sub => (
                    <li key={sub.val} className="flex justify-between items-center bg-gray-50 p-2 rounded text-sm">
                      <span>{sub.name}</span>
                      <button
                        onClick={() => removeSubCategory(cat.val || '', sub.val || '')}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400 italic ml-4">No subcategories</p>
              )}
            </div>
          ))}
        </div>

        <div className="p-6 border-t bg-gray-50 flex justify-end gap-4">
          <button onClick={onClose} className="px-6 py-2 rounded-lg font-bold text-gray-500 hover:bg-gray-200">Cancel</button>
          <button onClick={handleSave} className="px-6 py-2 rounded-lg font-bold bg-black text-white hover:bg-gray-800">Save Changes</button>
        </div>
      </div>
    </div>
  );
}
