
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type SubCategory = {
  _id?: string;
  name: string;
  href: string;
  val: string; // Required now
};

export type Category = {
  _id?: string;
  name: string;
  href: string;
  val: string; // Required now
  subcategories?: SubCategory[];
};

interface CategoryContextType {
  categories: Category[];
  loading: boolean;
  saveCategories: (newCategories: Category[]) => Promise<boolean>;
  refreshCategories: () => Promise<void>;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export function CategoryProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories", { cache: "no-store", headers: { 'Pragma': 'no-cache' } });
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const saveCategories = async (newCategories: Category[]) => {
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCategories),
      });
      if (res.ok) {
        // Fetch fresh data to get IDs
        await fetchCategories();
        return true;
      }
    } catch (error) {
      console.error("Failed to save categories", error);
    }
    return false;
  };

  return (
    <CategoryContext.Provider value={{ categories, loading, saveCategories, refreshCategories: fetchCategories }}>
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error("useCategories must be used within a CategoryProvider");
  }
  return context;
}
