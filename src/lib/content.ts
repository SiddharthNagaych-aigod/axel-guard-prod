
import fs from 'fs';
import path from 'path';

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

export const getContent = (): Content => {
    const filePath = path.join(process.cwd(), 'src/data/content.json');
    if (!fs.existsSync(filePath)) {
        return { products: [], clients: [], services: [] };
    }
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
};

export const getProducts = (): Product[] => {
    const content = getContent();
    return content.products || [];
};

export const getClients = (): string[] => {
    const content = getContent();
    return content.clients || [];
};

export const getCategories = (): Category[] => {
    const filePath = path.join(process.cwd(), 'src/data/categories.json');
    if (!fs.existsSync(filePath)) {
        return [];
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};
