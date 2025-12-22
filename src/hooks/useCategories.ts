"use client";

import { useState, useEffect } from "react";

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

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    } finally {
      setLoading(false);
    }
  };

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

  return { categories, loading, saveCategories, refreshCategories: fetchCategories };
}
