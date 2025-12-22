
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type SubCategory = {
  name: string;
  href: string;
  val?: string;
};

export type Category = {
  name: string;
  href: string;
  val?: string;
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
      const res = await fetch("/api/categories", { cache: "no-store" });
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
        setCategories(newCategories);
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
