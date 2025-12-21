"use client";

import { useState } from "react";
import Link from "next/link";
import { Filter, X, Check } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProductFiltersProps {
  activeCategory?: string;
}

const categories = [
  { label: "All Products", val: undefined },
  { label: "Mobile DVR", val: "mdvr" },
  { label: "Dashcams", val: "dashcam" },
  { label: "Cameras", val: "camera" },
  { label: "RFID", val: "rfid" },
  { label: "Accessories", val: "accessories" },
];

export default function ProductFilters({ activeCategory }: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleSelect = (val?: string) => {
    setIsOpen(false);
    // Navigation is handled by Link, but we close the menu
  };

  return (
    <>
      {/* Desktop View: Original Pills */}
      <div className="hidden md:flex flex-wrap gap-4 justify-center mb-12">
        {categories.map((cat) => (
          <Link 
            key={cat.label} 
            href={cat.val ? `/products?category=${cat.val}` : "/products"}
            className={`px-6 py-2 rounded-full border transition-all font-medium ${
              (activeCategory === cat.val) || (!activeCategory && !cat.val)
                ? "bg-black text-white border-black shadow-md"
                : "bg-white text-gray-700 border-gray-200 hover:border-black hover:text-black hover:bg-gray-50"
            }`}
          >
            {cat.label}
          </Link>
        ))}
      </div>

      {/* Mobile View: Filter Icon & Slide-over/Modal */}
      <div className="md:hidden mb-8 flex justify-between items-center bg-gray-50 rounded-lg p-4 border border-gray-100">
        <span className="font-bold text-gray-700">
          Showing: {categories.find(c => c.val === activeCategory)?.label || "All Products"}
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
          <div className="relative bg-white w-full sm:w-[400px] rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold">Filter Products</h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 flex flex-col gap-2 max-h-[60vh] overflow-y-auto">
              {categories.map((cat) => {
                const isActive = (activeCategory === cat.val) || (!activeCategory && !cat.val);
                return (
                  <Link
                    key={cat.label}
                    href={cat.val ? `/products?category=${cat.val}` : "/products"}
                    onClick={() => handleSelect(cat.val)}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                       isActive 
                         ? "bg-black text-white border-black" 
                         : "bg-white text-gray-700 border-gray-100 hover:border-gray-300"
                    }`}
                  >
                    <span className="font-medium">{cat.label}</span>
                    {isActive && <Check size={18} />}
                  </Link>
                );
              })}
            </div>
            
            <div className="p-6 border-t border-gray-100 bg-gray-50">
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
    </>
  );
}
