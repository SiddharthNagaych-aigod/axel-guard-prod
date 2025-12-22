"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useAdmin } from "@/context/AdminContext";
import { useCategories } from "@/hooks/useCategories";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Save, Upload, X, CheckCircle } from "lucide-react";
import ManualGate from "@/components/features/ManualGate";
import ProductImageGallery from "@/components/products/ProductImageGallery";

type Product = {
  product_code: string;
  product_type: string;
  product_name: string;
  images: string[];
  features: string[];
  technical_features?: string[];
  price?: string;
  pdf_manual?: string;
};

// Sortable Image Item
function SortableImage({ url, onRemove }: { url: string, onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: url });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative w-24 h-24 border rounded-lg overflow-hidden group bg-white">
      <Image src={url} alt="Product" fill className="object-contain" unoptimized />
      <div {...attributes} {...listeners} className="absolute inset-0 cursor-move bg-black/0 hover:bg-black/10 transition-colors" />
      <button onClick={onRemove} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
        <X size={12} />
      </button>
    </div>
  );
}

export default function ProductDetailManager({ initialProduct }: { initialProduct: Product }) {
  const { isAdminMode } = useAdmin();
  const { categories, saveCategories } = useCategories(); // Destructure saveCategories here
  const [product, setProduct] = useState<Product>(initialProduct);
  const [isSaving, setIsSaving] = useState(false);

  // Sync initial
  useEffect(() => { setProduct(initialProduct); }, [initialProduct]);

  // Sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setProduct((p) => {
        const oldIndex = p.images.indexOf(active.id as string);
        const newIndex = p.images.indexOf(over.id as string);
        return { ...p, images: arrayMove(p.images, oldIndex, newIndex) };
      });
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', `axelguard/products/${product.product_code}`);

    try {
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.secure_url) {
            setProduct(p => ({ ...p, images: [...p.images, data.secure_url] }));
        }
    } catch (err) {
        console.error("Upload failed", err);
        alert("Upload failed");
    }
  };

  const saveProduct = async () => {
    setIsSaving(true);
    try {
        // Fetch all, update this one, save all.
        // NOTE: A dedicated update-one endpoint would be better, but this fits the file-system simple architecture
        const res = await fetch('/api/products', { cache: 'no-store' });
        const allProducts = await res.json();
        const updatedProducts = allProducts.map((p: Product) => 
            p.product_code === product.product_code ? product : p
        );

        await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ products: updatedProducts })
        });
        alert("Saved successfully!");
    } catch (error) {
        console.error(error);
        alert("Failed to save");
    } finally {
        setIsSaving(false);
    }
  };

  // --- Category Logic (Hoisted) ---
  const currentType = product.product_type;
  let currentCatVal = "";
  let currentSubVal = "";
  let isCustom = true;

  if (currentType === "Uncategorized") {
      isCustom = false;
      currentCatVal = "Uncategorized";
  } else {
      for (const cat of categories) {
          if (cat.name === currentType) {
              currentCatVal = cat.val || "";
              isCustom = false;
              break;
          }
          if (cat.subcategories) {
              const sub = cat.subcategories.find(s => s.name === currentType);
              if (sub) {
                  currentCatVal = cat.val || "";
                  currentSubVal = sub.val || "";
                  isCustom = false;
                  break;
              }
          }
      }
  }

  const handleCatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const val = e.target.value;
      if (val === "custom") {
          setProduct({...product, product_type: ""}); 
          return;
      }
      
      if (val === "Uncategorized") {
          setProduct({...product, product_type: "Uncategorized"});
          return;
      }

      const cat = categories.find(c => c.val === val);
      if (cat) {
          setProduct({...product, product_type: cat.name});
      }
  };

  const handleSubChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const val = e.target.value;
      if (val === "add_new") {
          handleAddSubCategory();
          return;
      }
      if (!val) return; 
      
      const cat = categories.find(c => c.val === currentCatVal);
      const sub = cat?.subcategories?.find(s => s.val === val);
      if (sub) {
          setProduct({...product, product_type: sub.name});
      } else if (val === "parent_only") {
          if (cat) setProduct({...product, product_type: cat.name});
      }
  };

  const handleAddSubCategory = async () => {
      const cat = categories.find(c => c.val === currentCatVal);
      if (!cat) return;

      const name = prompt(`Enter new subcategory name for ${cat.name}:`);
      if (!name) return;
      
      const val = name.toLowerCase().replace(/\s+/g, '-');
      
      if (cat.subcategories?.some(s => s.val === val)) {
          alert("Subcategory already exists!");
          return;
      }

      const newSub = { name, href: `/products?category=${val}`, val };
      
      const newCategories = categories.map(c => {
          if (c.val === currentCatVal) {
              return { ...c, subcategories: [...(c.subcategories || []), newSub] };
          }
          return c;
      });

      const success = await saveCategories(newCategories);
      if (success) {
          setProduct({...product, product_type: name});
      } else {
          alert("Failed to save subcategory.");
      }
  };

  const selectedCategory = categories.find(c => c.val === currentCatVal);
  const subcategories = selectedCategory?.subcategories || [];


  // View Mode
  if (!isAdminMode) {
    return (
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Image Section */}
            <ProductImageGallery images={product.images} productName={product.product_name} />

            {/* Content Section */}
            <div className="flex flex-col justify-center">
              <div className="mb-6">
                 <div className="flex items-center gap-4 mb-4">
                   <span className="inline-block bg-black text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                    {product.product_type}
                   </span>
                   <span className="text-gray-500 text-sm font-medium">Code: <span className="text-black font-mono">{product.product_code}</span></span>
                 </div>
                 <h1 className="text-3xl md:text-5xl font-bold text-black mb-6 leading-tight">{product.product_name}</h1>
                 
                 <div className="prose prose-lg text-gray-600 mb-8 max-w-none">
                   <p>
                     Experience the next level of vehicle safety with the {product.product_name}. 
                     Engineered for reliability and performance in demanding environments.
                   </p>
                 </div>
              </div>

              {/* Features */}
              <div className="mb-8">
                <h3 className="text-lg font-bold mb-4 border-b border-gray-100 pb-2 text-black">Key Features</h3>
                <ul className="space-y-3">
                  {product.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-700">
                      <CheckCircle className="text-black mt-1 flex-shrink-0" size={18} />
                      <span className="text-sm md:text-base">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

               {/* Technical Specs */}
               {product.technical_features && product.technical_features.length > 0 && (
                <div className="mb-10 bg-gray-50 p-6 rounded-xl border border-gray-100">
                  <h3 className="text-lg font-bold mb-4 text-black">Technical Specifications</h3>
                  <ul className="grid gap-3">
                    {product.technical_features.map((spec, i) => (
                      <li key={i} className="text-sm text-gray-700 border-b border-gray-200 pb-2 last:border-0 last:pb-0">
                         {spec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                <a 
                  href="/contact" 
                  className="bg-black text-white px-8 py-4 rounded-lg font-bold hover:bg-gray-800 transition-colors text-center shadow-lg"
                >
                  Request Quote
                </a>
                {product.pdf_manual && (
                  <ManualGate pdfUrl={`/${product.pdf_manual}`} />
                )}
              </div>
            </div>
        </div>
    );
  }

  // Admin Mode
  return (
    <div className="flex flex-col gap-8 border-2 border-yellow-400 rounded-xl p-6 bg-yellow-50/10">
        <div className="flex justify-between items-center bg-yellow-100 p-4 rounded-lg">
            <span className="font-bold text-yellow-800">Editing Product: {product.product_code}</span>
            <button onClick={saveProduct} disabled={isSaving} className="bg-black text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-800">
                <Save size={18} /> {isSaving ? "Saving..." : "Save Changes"}
            </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
            <div>
                <label className="block font-bold mb-2">Images (Drag to reorder, First is Main)</label>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={product.images} strategy={rectSortingStrategy}>
                        <div className="flex flex-wrap gap-4 mb-4">
                            {product.images.map(img => (
                                <SortableImage 
                                    key={img} 
                                    url={img} 
                                    onRemove={() => setProduct(p => ({ ...p, images: p.images.filter(i => i !== img) }))} 
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
                
                <div className="relative">
                    <input type="file" id="img-upload" className="hidden" onChange={handleUpload} accept="image/*" />
                    <label htmlFor="img-upload" className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        <Upload size={16} /> Upload Image
                    </label>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-gray-700">Name</label>
                    <input 
                        type="text" 
                        value={product.product_name} 
                        onChange={e => setProduct({...product, product_name: e.target.value})}
                        className="w-full border p-2 rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700">Type / Category</label>
                    
                    {/* Category Selection UI */}
                    <div className="flex flex-col gap-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
                        {/* Main Category Dropdown */}
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Main Category</label>
                            <select 
                                value={isCustom ? "custom" : currentCatVal} 
                                onChange={handleCatChange}
                                className="w-full border p-2 rounded bg-white mt-1"
                            >
                                <option value="Uncategorized">Uncategorized</option>
                                {categories.map(cat => (
                                    <option key={cat.val} value={cat.val}>{cat.name}</option>
                                ))}
                                <option value="custom">Custom (Type Manually)</option>
                            </select>
                        </div>

                        {/* Subcategory Dropdown (Always visible for affordance, disabled if no parent) */}
                        <div className={`transition-all duration-200 ${(!isCustom && currentCatVal !== "Uncategorized") ? 'opacity-100' : 'opacity-60'}`}>
                            <label className="text-xs font-bold text-gray-500 uppercase flex justify-between items-center">
                                <span>Subcategory</span>
                                {/* Show ADD NEW only when actionable */}
                                {!isCustom && currentCatVal !== "Uncategorized" && (
                                    <button 
                                        onClick={handleAddSubCategory}
                                        className="text-[10px] bg-black text-white px-2 py-0.5 rounded hover:bg-gray-800"
                                    >
                                        + ADD NEW
                                    </button>
                                )}
                            </label>
                            <select 
                                disabled={isCustom || currentCatVal === "Uncategorized"}
                                value={(!isCustom && currentCatVal !== "Uncategorized") ? (currentSubVal || (subcategories.some(s => s.name === product.product_type) ? "" : "parent_only")) : "placeholder"}
                                onChange={handleSubChange}
                                className="w-full border p-2 rounded bg-white mt-1 border-blue-200 text-blue-800 font-medium disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200"
                            >
                                {isCustom || currentCatVal === "Uncategorized" ? (
                                    <option value="placeholder">Select a Main Category first...</option>
                                ) : (
                                    <>
                                        <option value="parent_only">-- No Subcategory ({selectedCategory?.name}) --</option>
                                        {subcategories.map(sub => (
                                            <option key={sub.val} value={sub.val}>{sub.name}</option>
                                        ))}
                                        <option value="add_new" className="font-bold text-blue-600">+ Create New Subcategory...</option>
                                    </>
                                )}
                            </select>
                        </div>

                        {/* Custom Input Fallback */}
                        {isCustom && (
                            <div>
                                 <label className="text-xs font-bold text-gray-500 uppercase">Custom Type Name</label>
                                 <input 
                                    type="text" 
                                    value={product.product_type === "Uncategorized" ? "" : product.product_type} 
                                    onChange={e => setProduct({...product, product_type: e.target.value})}
                                    className="w-full border p-2 rounded mt-1"
                                    placeholder="Enter custom product type..."
                                 />
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700">Price</label>
                    <input 
                        type="text" 
                        value={product.price || ''} 
                        onChange={e => setProduct({...product, price: e.target.value})}
                        className="w-full border p-2 rounded"
                        placeholder="$0.00"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700">Features (One per line)</label>
                    <textarea 
                        rows={5}
                        value={product.features.join('\n')}
                        onChange={e => setProduct({...product, features: e.target.value.split('\n')})}
                        className="w-full border p-2 rounded font-mono text-sm"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-bold text-gray-700">Technical Specs (One per line)</label>
                    <textarea 
                        rows={5}
                        value={product.technical_features?.join('\n') || ''}
                        onChange={e => setProduct({...product, technical_features: e.target.value.split('\n')})}
                        className="w-full border p-2 rounded font-mono text-sm"
                    />
                </div>
            </div>
        </div>
    </div>
  );
}
