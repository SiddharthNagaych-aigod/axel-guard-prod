import Link from "next/link";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import content from "@/data/content.json";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Pagination from "@/components/ui/Pagination";
import ProductFilters from "@/components/products/ProductFilters";

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

          {/* Product Grid */}
          {paginatedProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {paginatedProducts.map((product) => (
                  <Link 
                    key={product.product_code} 
                    href={`/products/${product.product_code}`}
                    className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-black hover:shadow-lg transition-all duration-300 flex flex-col"
                  >
                    <div className="relative h-64 bg-white p-4 flex items-center justify-center border-b border-gray-100">
                      {/* Image handling: fix path from assets/img to /assets/img and use first image */}
                      <div className="relative w-full h-full"> 
                        <Image 
                          src={product.images[0]} 
                          alt={product.product_name}
                          fill
                          className="object-contain group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          unoptimized
                        />
                      </div>
                    </div>
                    
                    <div className="p-6 flex-grow flex flex-col">
                      <span className="text-xs font-bold text-black uppercase tracking-wider mb-2 block">{product.product_type}</span>
                      <h3 className="text-lg font-bold text-black mb-3 group-hover:underline decoration-2 underline-offset-4 transition-all line-clamp-2">
                        {product.product_name}
                      </h3>
                      <p className="text-gray-500 text-sm mb-4 line-clamp-3 flex-grow">
                        {product.features?.[0] || "High performance vehicle safety solution."}
                      </p>
                      <div className="mt-auto">
                        <span className="text-sm font-bold text-black flex items-center gap-1 group-hover:gap-2 transition-all">
                          View Details &rarr;
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                baseUrl="/products"
                searchParams={{ category: filterCat }}
              />
            </>
          ) : (
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
