import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getProducts } from "@/lib/content";

import Breadcrumbs from "@/components/ui/Breadcrumbs";
import ProductDetailManager from "@/components/products/ProductDetailManager";

// Helper to find product
const getProduct = (code: string) => {
  const products = getProducts();
  return products.find((p) => p.product_code === code);
};

export const dynamic = 'force-dynamic';

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

          <ProductDetailManager initialProduct={product} />
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Generate static params for all products (optional but good for SEO/Performance)
// Note: With force-dynamic, this might be ignored for serving, but used for build? 
// Actually if we want instant updates, we might skip this or keep it for initial build.
// But ensuring the page is dynamic is key.
export async function generateStaticParams() {
  const products = getProducts();
  return products.map((product) => ({
    code: product.product_code,
  }));
}
