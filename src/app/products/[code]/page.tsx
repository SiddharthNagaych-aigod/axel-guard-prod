import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getProducts } from "@/lib/content";

import Breadcrumbs from "@/components/ui/Breadcrumbs";
import ProductDetailManager from "@/components/products/ProductDetailManager";

// Helper to find product
const getProduct = async (code: string) => {
  const products = await getProducts();
  return products.find((p) => p.product_code === code);
};

export const dynamic = 'force-dynamic';

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const product = await getProduct(code);

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

// Generate static params
export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({
    code: product.product_code,
  }));
}
