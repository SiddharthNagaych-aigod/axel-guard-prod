import { Suspense } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getProducts, getCategories } from "@/lib/content";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import ProductListingManager from "@/components/products/ProductListingManager";

// ISR: Revalidate every 60 seconds
export const revalidate = 60;

export default async function ProductsPage() {
  // Fetch ALL products and categories once (Cached by ISR)
  const products = await getProducts();
  const categories = await getCategories();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Page Title */}
      <div className="hidden md:block bg-black text-white py-20 mt-[72px]">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Our Products</h1>
           <p className="text-xl text-gray-300">
             Explore our complete range of safety solutions
           </p>
        </div>
      </div>

      <main className="flex-grow pt-[70px] pb-8 md:py-16">
        <div className="container mx-auto px-4">
          <Breadcrumbs 
            items={[
              { label: "Products" }
            ]} 
          />
          
          {/* Client Component handles Filtering & Pagination */}
          <Suspense fallback={<div className="py-20 text-center">Loading products...</div>}>
            <ProductListingManager initialProducts={products} initialCategories={categories} />
          </Suspense>
          
        </div>
      </main>

      <Footer />
    </div>
  );
}
