import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import content from "@/data/content.json";
import { CheckCircle } from "lucide-react";
import ManualGate from "@/components/features/ManualGate";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import ProductImageGallery from "@/components/products/ProductImageGallery";

// Helper to find product
const getProduct = (code: string) => {
  return content.products.find((p) => p.product_code === code);
};

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const product = getProduct(code);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-grow pt-[70px] md:pt-[100px] pb-16">
        <div className="container mx-auto px-4">
          
          <div className="mb-6">
            <Breadcrumbs 
              items={[
                { label: "Products", href: "/products" },
                { label: product.product_name }
              ]} 
            />
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            
            {/* Image Section */}
            <ProductImageGallery images={product.images} productName={product.product_name} />

            {/* Content Section */}
            <div className="flex flex-col justify-center">
              
              <div className="mb-6">
                 <div className="flex items-center gap-4 mb-4">
                   <span className="inline-block bg-black text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                    {product.product_type}
                   </span>
                   <span className="text-gray-500 text-sm font-medium">Code: <span className="text-black font-mono">{product.product_code}</span></span>
                 </div>
                 <h1 className="text-3xl md:text-5xl font-bold text-black mb-6 leading-tight">{product.product_name}</h1>
                 
                 <div className="prose prose-lg text-gray-600 mb-8 max-w-none">
                   <p>
                     Experience the next level of vehicle safety with the {product.product_name}. 
                     Engineered for reliability and performance in demanding environments.
                   </p>
                 </div>
              </div>

              {/* Features */}
              <div className="mb-8">
                <h3 className="text-lg font-bold mb-4 border-b border-gray-100 pb-2 text-black">Key Features</h3>
                <ul className="space-y-3">
                  {product.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-700">
                      <CheckCircle className="text-black mt-1 flex-shrink-0" size={18} />
                      <span className="text-sm md:text-base">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

               {/* Technical Specs */}
               {product.technical_features && product.technical_features.length > 0 && (
                <div className="mb-10 bg-gray-50 p-6 rounded-xl border border-gray-100">
                  <h3 className="text-lg font-bold mb-4 text-black">Technical Specifications</h3>
                  <ul className="grid gap-3">
                    {product.technical_features.map((spec, i) => (
                      <li key={i} className="text-sm text-gray-700 border-b border-gray-200 pb-2 last:border-0 last:pb-0">
                         {spec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                <Link 
                  href="/contact" 
                  className="bg-black text-white px-8 py-4 rounded-lg font-bold hover:bg-gray-800 transition-colors text-center shadow-lg"
                >
                  Request Quote
                </Link>
                {product.pdf_manual && (
                  <ManualGate pdfUrl={`/${product.pdf_manual}`} />
                )}
              </div>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Generate static params for all products (optional but good for SEO/Performance)
export async function generateStaticParams() {
  return content.products.map((product) => ({
    code: product.product_code,
  }));
}
