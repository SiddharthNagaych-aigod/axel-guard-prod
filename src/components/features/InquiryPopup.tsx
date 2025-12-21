"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import NeoDoveForm from "@/components/ui/NeoDoveForm";

export default function InquiryPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasSeen, setHasSeen] = useState(false);

  useEffect(() => {
    // Check if running on client
    if (typeof window !== "undefined") {
        const seen = sessionStorage.getItem("axelguard_popup_seen");
        if (seen) {
            setHasSeen(true);
            return;
        }

        const timer = setTimeout(() => {
            setIsOpen(true);
            sessionStorage.setItem("axelguard_popup_seen", "true");
        }, 10000); // 10 seconds

        return () => clearTimeout(timer);
    }
  }, []);

  if (hasSeen && !isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden relative"
          >
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors z-10"
            >
              <X size={24} />
            </button>

            <div className="p-8">
              <div className="text-center mb-6">
                <p className="text-sm font-bold text-[var(--accent-color)] mb-2 uppercase tracking-wide">Get in Touch</p>
                <h2 className="text-2xl font-bold mb-2">How can we help?</h2>
                <p className="text-gray-500">Leave your details and we&apos;ll contact you instantly.</p>
              </div>
              
              <NeoDoveForm 
                source="Popup Inquiry" 
                onSuccess={() => setTimeout(() => setIsOpen(false), 2000)}
                showMessageBox={true}
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
