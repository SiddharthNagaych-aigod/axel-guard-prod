import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/layout/Hero";
import ClientsCarousel from "@/components/layout/ClientsCarousel";
import Link from "next/link";
import { Activity, Radio, Cast, Camera, ShieldCheck, TrendingUp, Users } from "lucide-react";

export default function Home() {
  const categories = [
    { name: "Mobile DVR", icon: Activity, href: "/products?category=mdvr" },
    { name: "DashCam", icon: Radio, href: "/products?category=dashcam" },
    { name: "RFID", icon: Cast, href: "/products?category=rfid" },
    { name: "Camera", icon: Camera, href: "/products?category=camera" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-black font-sans">
      <Header />
      <main className="flex-grow">
        <Hero />

        {/* Story Section: Why AxelGuard Exists */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 max-w-5xl text-center">
             <span className="inline-block py-1 px-3 border border-black rounded-full text-xs font-bold tracking-widest uppercase mb-6">Our Story</span>
             <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">
               Safety is not a luxury.<br/>It is a necessity.
             </h2>
             <p className="text-lg md:text-xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
               In an increasingly complex world, the safety of your fleet and assets cannot be left to chance. 
               AxelGuard was born from a simple yet powerful motive: to eliminate uncertainty on the road.
               We provide state-of-the-art vehicle tracking and monitoring systems that give you total control 
               and peace of mind. We don&apos;t just sell products; we deliver the promise of security.
             </p>
             
             <div className="grid md:grid-cols-3 gap-12 text-left mt-16">
                <div>
                   <ShieldCheck size={48} className="mb-6 stroke-1 mx-auto md:mx-0" />
                   <h3 className="text-2xl font-bold mb-3 text-center md:text-left">Uncompromised Safety</h3>
                   <p className="text-gray-500 leading-relaxed text-center md:text-left">We use superior technology to ensure that every mile traveled is monitored and secure, reducing accidents and liabilities.</p>
                </div>
                <div>
                   <TrendingUp size={48} className="mb-6 stroke-1 mx-auto md:mx-0" />
                   <h3 className="text-2xl font-bold mb-3 text-center md:text-left">Efficiency Driven</h3>
                   <p className="text-gray-500 leading-relaxed text-center md:text-left">Our solutions optimize routes and monitor driver behavior, directly impacting your bottom line through fuel and maintenance savings.</p>
                </div>
                <div>
                   <Users size={48} className="mb-6 stroke-1 mx-auto md:mx-0" />
                   <h3 className="text-2xl font-bold mb-3 text-center md:text-left">Client Centric</h3>
                   <p className="text-gray-500 leading-relaxed text-center md:text-left">From customized hardware to 24/7 support, we build our systems around your specific operational needs.</p>
                </div>
             </div>
          </div>
        </section>

        {/* Minimalist Product Categories */}
        <section className="py-16 md:py-24 bg-[var(--surface-color)]">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 md:mb-16 text-center md:text-left">
               <div className="max-w-xl">
                 <h2 className="text-3xl font-bold mb-4">Intelligent Solutions</h2>
                 <p className="text-gray-500 text-lg">Hardware designed for accuracy, durability, and performance.</p>
               </div>
               <Link href="/products" className="hidden md:inline-flex items-center gap-2 text-black font-bold border-b border-black pb-1 hover:opacity-70 transition-opacity">
                 View All Products &rarr;
               </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {categories.map((cat) => (
                <Link key={cat.name} href={cat.href} className="group bg-white p-8 md:p-10 h-64 md:h-72 flex flex-col justify-between border border-transparent hover:border-black transition-all duration-300 shadow-sm md:shadow-none bg-gray-50/50 md:bg-white">
                  <cat.icon size={40} className="stroke-1 group-hover:scale-110 transition-transform duration-500 text-black" />
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold mb-2">{cat.name}</h3>
                    <span className="text-sm text-gray-400 group-hover:text-black transition-colors">Explore &rarr;</span>
                  </div>
                </Link>
              ))}
            </div>
             <div className="mt-10 md:hidden text-center">
               <Link href="/products" className="inline-block bg-black text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-gray-800 transition-colors">
                 View All Products
               </Link>
             </div>
          </div>
        </section>

        {/* Clients Section */}
        <ClientsCarousel />

        {/* Simplified "Why Choose Us" / Footer Lead-in */}
        <section className="py-16 md:py-24 bg-black text-white text-center">
          <div className="container mx-auto px-4">
             <h2 className="text-3xl md:text-5xl font-bold mb-6 md:mb-8">Ready to secure your fleet?</h2>
             <p className="text-lg md:text-xl text-gray-400 mb-8 md:mb-10 max-w-2xl mx-auto">Join the leaders in logistics and transportation who trust AxelGuard.</p>
             <Link 
               href="/contact" 
               className="inline-block bg-white text-black px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-200 transition-colors"
             >
               Contact Us
             </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
