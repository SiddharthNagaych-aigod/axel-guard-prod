import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import content from "@/data/content.json";
import { CheckCircle, ChevronLeft } from "lucide-react";
import ManualGate from "@/components/features/ManualGate";

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
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-[100px] pb-20">
        <div className="container mx-auto px-4">
          
          {/* Breadcrumb / Back */}
          <div className="mb-8">
            <Link href="/products" className="text-gray-500 hover:text-[var(--accent-color)] flex items-center gap-2 transition-colors">
              <ChevronLeft size={16} /> Back to Products
            </Link>
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            
            {/* Image Section */}
            <div>
              <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm mb-6 relative h-[400px] flex items-center justify-center">
                 <Image 
                   src={product.images[0]}
                   alt={product.product_name}
                   fill
                   className="object-contain"
                   sizes="(max-width: 1024px) 100vw, 50vw"
                   priority
                   unoptimized
                 />
              </div>
              
              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-4">
                  {product.images.map((img, idx) => (
                    <div key={idx} className="bg-white p-2 border border-gray-100 rounded-lg cursor-pointer hover:border-[var(--accent-color)] transition-colors h-20 relative">
                       <Image 
                         src={img}
                         alt={`${product.product_name} view ${idx + 1}`}
                         fill
                         className="object-contain"
                         unoptimized
                       />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Content Section */}
            <div>
              <span className="inline-block bg-[var(--surface-color)] text-[var(--heading-color)] px-4 py-1 rounded-full text-sm font-bold mb-4">
                {product.product_type}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-[var(--heading-color)] mb-4 leading-tight">
                {product.product_name}
              </h1>
              <p className="text-gray-400 text-sm mb-8">Product Code: <span className="text-[var(--heading-color)] font-mono">{product.product_code}</span></p>

              {/* Features */}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4 border-b pb-2">Key Features</h3>
                <ul className="space-y-3">
                  {product.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-700">
                      <CheckCircle className="text-[var(--accent-color)] mt-0.5 flex-shrink-0" size={18} />
                      <span className="text-sm md:text-base">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

               {/* Technical Specs */}
               {product.technical_features && product.technical_features.length > 0 && (
                <div className="mb-10 bg-[var(--surface-color)] p-6 rounded-xl">
                  <h3 className="text-xl font-bold mb-4">Technical Specifications</h3>
                  <ul className="grid gap-3">
                    {product.technical_features.map((spec, i) => (
                      <li key={i} className="text-sm text-gray-600 border-b border-gray-200 pb-2 last:border-0 last:pb-0">
                         {spec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/contact" 
                  className="bg-white text-black px-8 py-4 rounded-lg font-bold hover:bg-[var(--accent-color)] transition-colors text-center shadow-lg"
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
