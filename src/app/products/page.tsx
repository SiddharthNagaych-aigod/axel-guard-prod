import Link from "next/link";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import content from "@/data/content.json";

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

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  
  // Normalize category for filtering (simple text matching)
  const filterCat = category?.toLowerCase();

  // Helper to check if product matches category
  const matchesCategory = (product: Product) => {
    if (!filterCat) return true;
    const type = product.product_type.toLowerCase();
    
    if (filterCat === "mdvr") return type.includes("mdvr");
    if (filterCat === "dashcam") return type.includes("dashcam");
    if (filterCat === "camera") return type.includes("camera") || type.includes("bullet") || type.includes("dome");
    if (filterCat === "rfid") return type.includes("rfid") || type.includes("tag") || type.includes("reader");
    if (filterCat === "accessories") return type.includes("monitor") || type.includes("accessories") || type.includes("cable") || type.includes("sensor");
    
    return true;
  };

  const filteredProducts = content.products.filter(matchesCategory);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Page Title */}
      <div className="bg-[var(--heading-color)] text-white py-20 mt-[72px]">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Our Products</h1>
           <p className="text-xl text-gray-300">
             {filterCat ? `Browsing ${filterCat.toUpperCase()} Solutions` : "Explore our complete range of safety solutions"}
           </p>
        </div>
      </div>

      <main className="flex-grow py-16">
        <div className="container mx-auto px-4">
          
          {/* Category Quick Links */}
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            {[
              { label: "All Products", val: undefined },
              { label: "Mobile DVR", val: "mdvr" },
              { label: "Dashcams", val: "dashcam" },
              { label: "Cameras", val: "camera" },
              { label: "RFID", val: "rfid" },
              { label: "Accessories", val: "accessories" },
            ].map((cat) => (
              <Link 
                key={cat.label} 
                href={cat.val ? `/products?category=${cat.val}` : "/products"}
                className={`px-6 py-2 rounded-full border transition-all ${
                  (category === cat.val) || (!category && !cat.val)
                    ? "bg-[var(--accent-color)] text-black border-[var(--accent-color)] shadow-md"
                    : "bg-white text-black border-gray-200 hover:border-[var(--accent-color)] hover:text-[var(--accent-color)]"
                }`}
              >
                {cat.label}
              </Link>
            ))}
          </div>

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <Link 
                  key={product.product_code} 
                  href={`/products/${product.product_code}`}
                  className="group bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:border-gray-200 transition-all duration-300 flex flex-col"
                >
                  <div className="relative h-64 bg-gray-50 p-4 flex items-center justify-center">
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
                    <span className="text-xs font-bold text-[var(--accent-color)] uppercase tracking-wider mb-2 block">{product.product_type}</span>
                    <h3 className="text-lg font-bold text-[var(--heading-color)] mb-3 group-hover:text-[var(--accent-color)] transition-colors line-clamp-2">
                      {product.product_name}
                    </h3>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-3 flex-grow">
                      {product.features?.[0] || "High performance vehicle safety solution."}
                    </p>
                    <div className="mt-auto">
                      <span className="text-sm font-medium text-[var(--heading-color)] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        View Details &rarr;
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h3 className="text-xl font-bold text-gray-400">No products found in this category.</h3>
              <Link href="/products" className="text-[var(--accent-color)] mt-4 inline-block hover:underline">View all products</Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
