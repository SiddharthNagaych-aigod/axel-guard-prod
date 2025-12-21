"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import NeoDoveForm from "@/components/ui/NeoDoveForm";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-24 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 flex flex-col"
          >
            <div className="bg-black text-white p-4 flex justify-between items-center">
              <div>
                 <h3 className="font-bold">AxelGuard Support</h3>
                 <p className="text-xs text-gray-300">We usually reply within a few minutes</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 p-1 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="p-6 bg-gray-50 flex-grow">
               <p className="text-sm text-gray-600 mb-4 bg-white p-3 rounded-lg rounded-tl-none shadow-sm inline-block">
Hi! 👋 Have any issues or questions? Fill out the form below and we&apos;ll help you out!
               </p>
               <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <NeoDoveForm 
                    source="Chatbot" 
                    onSuccess={() => setTimeout(() => setIsOpen(false), 3000)}
                    showMessageBox={true}
                  />
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        className="fixed bottom-6 right-6 z-50 flex items-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        {!isOpen && (
           <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             className="bg-white px-4 py-2 rounded-full shadow-lg border border-gray-100 text-sm font-medium hidden sm:block whitespace-nowrap"
           >
             Have any issue?
           </motion.div>
        )}
        
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 bg-black text-white rounded-full shadow-xl hover:scale-105 active:scale-95 transition-transform flex items-center justify-center relative"
        >
          {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
          
          {/* Status Indicator */}
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
        </button>
      </motion.div>
    </>
  );
}
