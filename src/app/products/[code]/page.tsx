import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import content from "@/data/content.json";
import { CheckCircle } from "lucide-react";
import ManualGate from "@/components/features/ManualGate";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import ProductDetailManager from "@/components/products/ProductDetailManager";

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

          <ProductDetailManager initialProduct={product} />
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
