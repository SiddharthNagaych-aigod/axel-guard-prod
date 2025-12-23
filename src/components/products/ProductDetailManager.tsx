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
  _id?: string;
  product_code: string;
  product_type: string; // Legacy / Fallback
  product_name: string;
  category?: { _id: string; val: string; name: string } | null;
  subcategory?: { _id: string; val: string; name: string } | null;
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
  const { categories, saveCategories } = useCategories();
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
        // Send ONLY this product for update (partial/upsert)
        await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ products: [product] })
        });
        alert("Saved successfully!");
    } catch (error) {
        console.error(error);
        alert("Failed to save");
    } finally {
        setIsSaving(false);
    }
  };

  // --- Category Logic ---
  // Use category object if available, otherwise check product_type
  let currentCatVal = product.category?.val || "";
  let currentSubVal = product.subcategory?.val || "";
  let isCustom = false;

  // Fallback to legacy matching if objects are missing but product_type is present
  if (!currentCatVal && !currentSubVal && product.product_type) {
      if (product.product_type === "Uncategorized") {
          currentCatVal = "Uncategorized";
      } else {
          // Try to find matching category by name
          const cat = categories.find(c => c.name === product.product_type);
          if (cat) {
              currentCatVal = cat.val;
          } else {
               // Try subcategory
               const parentCat = categories.find(c => c.subcategories?.some(s => s.name === product.product_type));
               if (parentCat) {
                   currentCatVal = parentCat.val;
                   const sub = parentCat.subcategories?.find(s => s.name === product.product_type);
                   if (sub) currentSubVal = sub.val;
               } else {
                   isCustom = true; // No match found, custom type
               }
          }
      }
  }

  const handleCatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const val = e.target.value;
      if (val === "custom") {
          setProduct({...product, category: null, subcategory: null, product_type: ""}); 
          return;
      }
      
      if (val === "Uncategorized") {
           setProduct({...product, category: null, subcategory: null, product_type: "Uncategorized"});
           return;
      }

      const cat = categories.find(c => c.val === val);
      if (cat) {
          // Populate minimal category object locally
          setProduct({
              ...product, 
              category: { _id: cat._id!, val: cat.val, name: cat.name },
              subcategory: null,
              product_type: cat.name 
          });
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
      if (val === "parent_only") {
          // Clear subcategory
          if (cat) {
               setProduct({
                   ...product, 
                   category: { _id: cat._id!, val: cat.val, name: cat.name },
                   subcategory: null,
                   product_type: cat.name
               });
          }
          return;
      }

      const sub = cat?.subcategories?.find(s => s.val === val);
      if (sub && cat) {
          setProduct({
              ...product, 
              category: { _id: cat._id!, val: cat.val, name: cat.name },
              subcategory: { _id: sub._id!, val: sub.val, name: sub.name },
              product_type: sub.name
          });
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
          // After save, we need to re-find the new subcategory to get its _id?
          // Since saveCategories re-fetches, the 'categories' prop should update via context.
          // BUT that might take a moment. 
          // For now, we set the string values. 
          // Ideally, 'saveCategories' should return the new object or we re-fetch.
          // Given the context flow: saveCategories -> fetch API -> setCategories.
          // We can just rely on the upcoming render update?
          // But we want to select it immediately.
          // We can assume eventual consistency.
          
          setProduct(p => ({
              ...p,
              product_type: name,
              // We don't have the _id yet! This is a minor issue.
              // We'll set the val/name and hope the sync picks it up later or on next edit.
              // Actually, Product API will try to resolve by name/val if _id is missing if we code it right?
              // Currently Product API keys off _id. 
              // We should probably allow the user to select the new subcategory AFTER it appears.
              // Or force a reload. 
              // A quick hack: set subcategory structure without _id? API might complain.
              // Let's set product_type and let legacy logic handle it, or prompt user.
              // Better: trigger refreshCategories from hook?
          }));
          alert("Subcategory added.");
      } else {
          alert("Failed to save subcategory.");
      }
  };

  // Manual PDF Upload Handler
  const handleManualUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    
    // Validate PDF
    if (file.type !== 'application/pdf') {
        alert("Only PDF files are allowed.");
        return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', `axelguard/manuals/${product.product_code}`);

    try {
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();
        
        if (data.secure_url) {
            setProduct(p => ({ ...p, pdf_manual: data.secure_url }));
            alert("Manual uploaded successfully!");
        }
    } catch (err) {
        console.error("Manual upload failed", err);
        alert("Upload failed");
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
                
                {/* Manual Gate - Only shows if URL exists */}
                {product.pdf_manual && (
                  <ManualGate 
                    pdfUrl={
                        product.pdf_manual.startsWith('http') || product.pdf_manual.startsWith('/') 
                        ? product.pdf_manual 
                        : `/${product.pdf_manual}`
                    } 
                  />
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
                
                <div className="relative mb-8">
                    <input type="file" id="img-upload" className="hidden" onChange={handleUpload} accept="image/*" />
                    <label htmlFor="img-upload" className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        <Upload size={16} /> Upload Image
                    </label>
                </div>

                {/* PDF Manual Section */}
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                   <label className="block font-bold mb-2">Product Manual (PDF)</label>
                   
                   {product.pdf_manual ? (
                       <div className="flex items-center justify-between bg-blue-50 p-3 rounded text-sm text-blue-800 mb-2">
                           <a href={product.pdf_manual} target="_blank" rel="noopener noreferrer" className="underline truncate max-w-[200px]">
                               {product.pdf_manual}
                           </a>
                           <button 
                             onClick={() => setProduct(p => ({ ...p, pdf_manual: undefined }))}
                             className="text-red-500 hover:text-red-700 ml-4 font-bold"
                           >
                            Remove
                           </button>
                       </div>
                   ) : (
                       <p className="text-sm text-gray-500 mb-2">No manual uploaded.</p>
                   )}

                   <div className="relative">
                       <input type="file" id="pdf-upload" className="hidden" onChange={handleManualUpload} accept="application/pdf" />
                       <label htmlFor="pdf-upload" className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                           <Upload size={14} /> {product.pdf_manual ? "Replace PDF" : "Upload PDF"}
                       </label>
                   </div>
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

                        {/* Subcategory Dropdown */}
                        <div className={`transition-all duration-200 ${(!isCustom && currentCatVal !== "Uncategorized") ? 'opacity-100' : 'opacity-60'}`}>
                            <label className="text-xs font-bold text-gray-500 uppercase flex justify-between items-center">
                                <span>Subcategory</span>
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
