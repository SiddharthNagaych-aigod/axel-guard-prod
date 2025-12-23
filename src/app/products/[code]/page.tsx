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

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const product = await getProduct(code);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://axel-guard.com";
  const productUrl = `${siteUrl}/products/${code}`;
  const imageUrl = product.images?.[0] || "";

  return {
    title: `${product.product_name} | AxelGuard Products`,
    description: product.features?.[0] || `Detail view for ${product.product_name}`,
    alternates: {
        canonical: productUrl,
    },
    openGraph: {
        title: product.product_name,
        description: product.features?.[0] || `AxelGuard Product: ${product.product_name}`,
        url: productUrl,
        siteName: 'AxelGuard',
        images: [
            {
                url: imageUrl,
                width: 800,
                height: 600,
                alt: product.product_name,
            }
        ],
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: product.product_name,
        description: product.features?.[0],
        images: [imageUrl],
    },
  };
}

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
