"use client";

import { useState } from "react";
import { FileText, Download, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import NeoDoveForm from "@/components/ui/NeoDoveForm";

interface ManualGateProps {
  pdfUrl: string;
  className?: string;
}

export default function ManualGate({ pdfUrl, className = "" }: ManualGateProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDownloadClick = (e: React.MouseEvent) => {
    // Check if user has already submitted info in this session/browser
    const hasSubmitted = localStorage.getItem("axelguard_lead_captured");
    
    if (!hasSubmitted) {
      e.preventDefault();
      setIsOpen(true);
    }
    // If hasSubmitted is true, the default anchor behavior proceeds (download)
  };

  const handleFormSuccess = () => {
    // Mark as captured
    localStorage.setItem("axelguard_lead_captured", "true");
    
    // Slight delay to show success message then close and trigger download
    setTimeout(() => {
      setIsOpen(false);
      window.open(pdfUrl, "_blank");
    }, 1500);
  };

  return (
    <>
      <a 
        href={pdfUrl} 
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleDownloadClick}
        className={`flex items-center justify-center gap-2 border border-gray-300 px-8 py-4 rounded-lg font-medium hover:border-black hover:text-black transition-colors text-gray-600 ${className}`}
      >
        <FileText size={20} /> Download Manual
      </a>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden relative"
            >
               <button 
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors z-10"
                >
                  <X size={20} />
                </button>

                <div className="p-8">
                   <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                        <Download size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">Download Manual</h3>
                        <p className="text-sm text-gray-500">Please provide your details to continue.</p>
                      </div>
                   </div>

                   <NeoDoveForm 
                      source="Manual Download Gate" 
                      onSuccess={handleFormSuccess}
                   />
                </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
