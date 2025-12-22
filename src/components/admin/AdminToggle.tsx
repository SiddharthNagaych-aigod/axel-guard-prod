"use client";

import { useState, useEffect } from "react";
import { useAdmin } from "@/context/AdminContext";
import { Lock, Unlock } from "lucide-react";

export default function AdminToggle() {
  const { isAdminMode, toggleAdminMode } = useAdmin();
  const [isVisible, setIsVisible] = useState<boolean | null>(null);

  // Konami Code Sequence
  const KONAMI_CODE = [
    "ArrowUp", "ArrowUp", 
    "ArrowDown", "ArrowDown", 
    "ArrowLeft", "ArrowRight", 
    "ArrowLeft", "ArrowRight", 
    "b", "a"
  ];
  
  const [, setInputSequence] = useState<string[]>([]);

  useEffect(() => {
    // Check localStorage on mount
    const hasAccess = localStorage.getItem("axel_admin_access") === "true";
    setIsVisible(hasAccess);

    const handleKeyDown = (e: KeyboardEvent) => {
      // If already visible, maybe we don't need to listen? 
      // But keeping it allows re-enabling if cleared.
      
      const key = e.key;
      
      setInputSequence(prev => {
        const updated = [...prev, key].slice(-KONAMI_CODE.length);
        
        if (JSON.stringify(updated) === JSON.stringify(KONAMI_CODE)) {
          localStorage.setItem("axel_admin_access", "true");
          setIsVisible(true);
          alert("Admin Mode Unlocked!"); // Simple feedback
          return []; // Reset
        }
        return updated;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isVisible) return null;

  return (
    <button
      onClick={toggleAdminMode}
      className={`fixed bottom-4 left-4 z-[9999] p-3 rounded-full shadow-2xl transition-all duration-300 ${
        isAdminMode ? "bg-red-600 text-white" : "bg-gray-900 text-gray-400 opacity-50 hover:opacity-100"
      }`}
      title={isAdminMode ? "Exit Admin Mode" : "Enter Admin Mode"}
    >
      {isAdminMode ? <Unlock size={24} /> : <Lock size={24} />}
    </button>
  );
}
