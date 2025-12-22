
import connectDB from '@/lib/db';
import CategoryModel from '@/models/Category';
import SubcategoryModel from '@/models/Subcategory'; // Ensure this model is loaded
import ProductModel from '@/models/Product';
import ClientModel from '@/models/Client';
import ServiceModel from '@/models/Service';

// Ensure models are registered
import '@/models/Subcategory';

export interface Product {
    _id?: string;
  product_code: string;
  product_type: string;
  product_name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  category?: any; // Populated
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subcategory?: any; // Populated
  images: string[];
  features: string[];
  technical_features?: string[];
  pdf_manual?: string;
  price?: string;
  order?: number;
}

export interface Service {
    _id?: string;
  title: string;
  description: string;
  link?: string;
  icon?: string;
  order?: number;
}

export interface SubCategory {
    _id?: string;
  name: string;
  href: string;
  val: string;
  parent?: string;
}

export interface Category {
    _id?: string;
  name: string;
  href: string;
  val: string;
  subcategories?: SubCategory[];
  order?: number;
}

export interface Content {
  products: Product[];
  services: Service[];
  clients: string[];
}

export const getContent = async (): Promise<Content> => {
    await connectDB();
    
    // Fetch all needed data in parallel
    const [products, services, clients] = await Promise.all([
        getProducts(),
        getServices(),
        getClients()
    ]);

    return { products, services, clients };
};

export const getProducts = async (): Promise<Product[]> => {
    await connectDB();
    // Populate category and subcategory
    const products = await ProductModel.find()
        .populate('category')
        .populate('subcategory')
        .sort({ order: 1 })
        .lean();
    
    // Map to interface if needed
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return JSON.parse(JSON.stringify(products)).map((p: any) => ({
        ...p,
        product_name: p.name, // Map 'name' back to 'product_name' for frontend compatibility
    }));
};

export const getClients = async (): Promise<string[]> => {
    await connectDB();
    const clients = await ClientModel.find().sort({ order: 1 }).lean();
    // Current interface expects string[] of URLs
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return clients.map((c: any) => c.imageUrl);
};

export const getServices = async (): Promise<Service[]> => {
    await connectDB();
    const services = await ServiceModel.find().sort({ order: 1 }).lean();
    return JSON.parse(JSON.stringify(services));
};

export const getCategories = async (): Promise<Category[]> => {
    await connectDB();
    
    // We need to construct the tree: Category -> Subcategories
    // Categories
    const categories = await CategoryModel.find().sort({ order: 1 }).lean();
    // Subcategories
    const subcategories = await SubcategoryModel.find().sort({ order: 1 }).lean();

    // Map subcategories to categories
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const categoryList = categories.map((cat: any) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const subs = subcategories.filter((sub: any) => 
            sub.parent.toString() === cat._id.toString()
        );
        return {
            ...cat,
            subcategories: subs
        };
    });

    return JSON.parse(JSON.stringify(categoryList));
};
