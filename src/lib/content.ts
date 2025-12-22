
import { StorageUtil } from '@/lib/storage';

export interface Product {
  product_code: string;
  product_type: string;
  product_name: string;
  images: string[];
  features: string[];
  technical_features?: string[];
  pdf_manual?: string;
  price?: string;
  order?: number;
}

export interface Service {
  title: string;
  description: string;
  link?: string;
  icon?: string;
}

export interface SubCategory {
  name: string;
  href: string;
  val: string;
}

export interface Category {
  name: string;
  href: string;
  val: string;
  subcategories?: SubCategory[];
}

export interface Content {
  products: Product[];
  services: Service[];
  clients: string[];
}

export const getContent = async (): Promise<Content> => {
    const content = await StorageUtil.readJSON<Content>('content.json');
    return content || { products: [], services: [], clients: [] };
};

export const getProducts = async (): Promise<Product[]> => {
    const content = await getContent();
    return content.products || [];
};

export const getClients = async (): Promise<string[]> => {
    const content = await getContent();
    return content.clients || [];
};

export const getCategories = async (): Promise<Category[]> => {
    const categories = await StorageUtil.readJSON<Category[]>('categories.json');
    return categories || [];
};
