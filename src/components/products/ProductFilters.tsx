"use client";

import { useState } from "react";
import Link from "next/link";
import { Filter, X, Check } from "lucide-react";
import { Category, useCategories } from "@/context/CategoryContext";

interface ProductFiltersProps {
  activeCategory?: string;
  categories?: Category[];
}

export default function ProductFilters({ activeCategory, categories: propCategories }: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { categories: contextCategories } = useCategories();
  
  // Use passed categories if available (server data), otherwise context
  const rawCategories = propCategories && propCategories.length > 0 ? propCategories : contextCategories;

  const categories = [
    { label: "All Products", val: undefined },
    ...rawCategories.map(c => ({ label: c.name, val: c.val })),
  ];

  // Helper to find parent of active subcategory or current active category
  const activeParent = rawCategories.find(c => 
    c.val === activeCategory || c.subcategories?.some(s => s.val === activeCategory)
  );
  
  const activeSubcategories = activeParent?.subcategories || [];

  const handleSelect = () => {
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Desktop View: Main Categories */}
      <div className="hidden md:flex flex-wrap gap-4 justify-center mb-6">
        {categories.map((cat) => {
            // Highlight parent if child is active or if itself is active
            const isActive = (activeCategory === cat.val) || 
                             (activeCategory && !cat.val && false) || // 'All' handling
                             (!activeCategory && !cat.val) ||
                             (cat.val && activeParent?.val === cat.val);

            return (
              <Link 
                key={cat.label} 
                href={cat.val ? `/products?category=${cat.val}` : "/products"}
                className={`px-6 py-2 rounded-full border transition-all font-medium ${
                  isActive
                    ? "bg-black text-white border-black shadow-md"
                    : "bg-white text-gray-700 border-gray-200 hover:border-black hover:text-black hover:bg-gray-50"
                }`}
              >
                {cat.label}
              </Link>
          );
        })}
      </div>

     {/* Subcategories (Desktop) */}
     {activeSubcategories.length > 0 && (
         <div className="hidden md:flex flex-wrap gap-3 justify-center mb-12 animate-in fade-in slide-in-from-top-2 duration-300">
             {activeSubcategories.map((sub) => (
                 <Link
                    key={sub.name}
                    href={sub.href}
                    className={`px-4 py-1.5 rounded-full text-sm border transition-all font-medium ${
                        activeCategory === sub.val
                         ? "bg-gray-800 text-white border-gray-800"
                         : "bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-400 hover:bg-white"
                    }`}
                 >
                     {sub.name}
                 </Link>
             ))}
         </div>
     )}


      {/* Mobile View: Filter Icon & Slide-over/Modal */}
      <div className="md:hidden w-full mb-8 flex justify-between items-center bg-gray-50 rounded-lg p-4 border border-gray-100">
        <span className="font-bold text-gray-700">
           {/* Show active category or subcategory name */}
           Showing: {
             (activeCategory && rawCategories.flatMap(c => [c, ...(c.subcategories||[])]).find(x => x.val === activeCategory)?.name) 
             || "All Products"
           }
        </span>
        <button 
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm font-bold"
        >
          <Filter size={16} /> Filters
        </button>
      </div>

      {/* Mobile Filter Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Content */}
          <div className="relative bg-white w-full sm:w-[400px] rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300 flex flex-col max-h-[85vh]">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
              <h3 className="text-xl font-bold">Filter Products</h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 flex-grow overflow-y-auto">
              {categories.map((cat) => {
                const isParentActive = (cat.val && activeParent?.val === cat.val) || (!cat.val && !activeCategory);
                const subcats = rawCategories.find(c => c.val === cat.val)?.subcategories;

                return (
                    <div key={cat.label} className="mb-2">
                      <Link
                        href={cat.val ? `/products?category=${cat.val}` : "/products"}
                        onClick={handleSelect}
                        className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                           isParentActive && !cat.val // All Products active
                             ? "bg-black text-white border-black" 
                             : isParentActive // Parent active
                                ? "bg-gray-100 text-black border-gray-300 font-bold"
                                : "bg-white text-gray-700 border-gray-100 hover:border-gray-300"
                        }`}
                      >
                        <span className="font-medium">{cat.label}</span>
                        {isParentActive && !subcats && <Check size={18} />}
                      </Link>
                      
                      {/* Mobile Subcategories */}
                      {subcats && (isParentActive || true) && ( // Always show subs in mobile menu? Or only if active? Let's show indented if parent match
                          <div className={`ml-4 mt-2 space-y-2 border-l-2 border-gray-100 pl-4 ${isParentActive ? 'block' : 'hidden'}`}>
                              {subcats.map(sub => (
                                  <Link
                                    key={sub.name}
                                    href={sub.href}
                                    onClick={handleSelect}
                                    className={`flex items-center justify-between py-2 text-sm ${
                                        activeCategory === sub.val ? "text-blue-600 font-bold" : "text-gray-500"
                                    }`}
                                  >
                                      {sub.name}
                                      {activeCategory === sub.val && <Check size={14} />}
                                  </Link>
                              ))}
                          </div>
                      )}
                    </div>
                );
              })}
            </div>
            
            <div className="p-6 border-t border-gray-100 bg-gray-50 shrink-0">
               <button 
                 onClick={() => setIsOpen(false)}
                 className="w-full bg-black text-white py-3 rounded-xl font-bold"
               >
                 View Results
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
