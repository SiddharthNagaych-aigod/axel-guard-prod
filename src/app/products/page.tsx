import Link from "next/link";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import content from "@/data/content.json";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Pagination from "@/components/ui/Pagination";
import ProductFilters from "@/components/products/ProductFilters";
import ProductListingManager from "@/components/products/ProductListingManager";

// Types for Product
type Product = {
  product_code: string;
  product_type: string;
  product_name: string;
  images: string[];
  features: string[];
  technical_features?: string[];
  pdf_manual?: string;
};

const PRODUCTS_PER_PAGE = 12;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>;
}) {
  const { category, page } = await searchParams;
  
  // Normalize category for filtering (simple text matching)
  const filterCat = category?.toLowerCase();

  // Helper to check if product matches category
  const matchesCategory = (product: Product) => {
    if (!filterCat) return true;
    const type = product.product_type.toLowerCase();
    
    // MDVR Subcategories
    if (filterCat === "mdvr-basic") return type.includes("basic version mdvr");
    if (filterCat === "mdvr-enhanced") return type.includes("enhanced version mdvr");
    if (filterCat === "mdvr-ai") return type.includes("ai version mdvr");
    
    // Main Categories
    if (filterCat === "mdvr") return type.includes("mdvr");
    if (filterCat === "dashcam") return type.includes("dashcam");
    if (filterCat === "camera") return type.includes("camera") || type.includes("bullet") || type.includes("dome");
    if (filterCat === "rfid") return type.includes("rfid") || type.includes("tag") || type.includes("reader");
    if (filterCat === "accessories") return type.includes("monitor") || type.includes("accessories") || type.includes("cable") || type.includes("sensor");
    
    return true;
  };

  const filteredProducts = content.products.filter(matchesCategory);
  
  const currentPage = page ? parseInt(page) : 1;
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE, 
    currentPage * PRODUCTS_PER_PAGE
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Page Title */}
      <div className="hidden md:block bg-black text-white py-20 mt-[72px]">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Our Products</h1>
           <p className="text-xl text-gray-300">
             {filterCat ? `Browsing ${filterCat.toUpperCase()} Solutions` : "Explore our complete range of safety solutions"}
           </p>
        </div>
      </div>

      <main className="flex-grow pt-[70px] pb-8 md:py-16">
        <div className="container mx-auto px-4">
          <Breadcrumbs 
            items={[
              { label: "Products", href: filterCat ? "/products" : undefined },
              ...(filterCat ? [{ label: filterCat.toUpperCase() }] : [])
            ]} 
          />
          
          {/* Filters */}
          <ProductFilters activeCategory={filterCat} />

          {/* Product Listing Manager handles display and reordering */}
          <ProductListingManager initialProducts={paginatedProducts} />
          
          {/* Pagination (visible if items exist) */}
          {paginatedProducts.length > 0 && (
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                baseUrl="/products"
                searchParams={{ category: filterCat }}
              />
          )}

          {paginatedProducts.length === 0 && (
             <div className="text-center py-20">
               <h3 className="text-xl font-bold text-gray-400">No products found in this category.</h3>
               <Link href="/products" className="text-black font-bold mt-4 inline-block hover:underline">View all products</Link>
             </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
