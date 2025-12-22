"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface AdminContextType {
  isAdminMode: boolean;
  toggleAdminMode: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdminMode, setIsAdminMode] = useState(false);

  // Optional: Persist state to text simple usage
  useEffect(() => {
    const saved = localStorage.getItem("axel_admin_mode");
    if (saved === "true") setIsAdminMode(true);
  }, []);

  const toggleAdminMode = () => {
    setIsAdminMode((prev) => {
      const newVal = !prev;
      localStorage.setItem("axel_admin_mode", String(newVal));
      return newVal;
    });
  };

  return (
    <AdminContext.Provider value={{ isAdminMode, toggleAdminMode }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
