import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getContent } from "@/lib/content";
import { CheckCircle, Shield, Truck, BarChart } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function ServicesPage() {
  const content = await getContent();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Page Title */}
      <div className="bg-black text-white py-24 mt-[72px]">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6 tracking-tight">Our Services</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">Comprehensive solutions for fleet management and vehicle safety, engineered for reliability.</p>
        </div>
      </div>

      <main className="flex-grow py-24 bg-white">
        <div className="container mx-auto px-4">
          
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {content.services.map((service, idx) => (
              <div key={idx} className="group bg-white border border-gray-200 p-10 hover:border-black transition-all duration-300 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col items-start">
                 <div className="w-16 h-16 bg-black text-white mb-8 flex items-center justify-center rounded-none transform group-hover:-translate-y-1 transition-transform duration-300">
                    {/* Icon Mapping */}
                    {idx === 0 ? <Truck size={32} strokeWidth={1.5} /> : 
                     idx === 1 ? <Shield size={32} strokeWidth={1.5} /> :
                     idx === 2 ? <BarChart size={32} strokeWidth={1.5} /> : <CheckCircle size={32} strokeWidth={1.5} />}
                 </div>
                 <h3 className="text-3xl font-bold text-black mb-4 group-hover:underline decoration-2 underline-offset-4">{service.title}</h3>
                 <p className="text-gray-600 leading-relaxed text-lg mb-6 flex-grow">{service.description}</p>
                 <div className="w-12 h-0.5 bg-gray-300 group-hover:bg-black transition-colors duration-300"></div>
              </div>
            ))}
          </div>

          {/* Additional Service Info */}
          <div className="mt-32 text-center">
            <h2 className="text-4xl font-bold text-black mb-16 tracking-tight">Our Methodology</h2>
            <div className="grid md:grid-cols-3 gap-12 relative">
                {/* Connecting Line (Desktop) */}
                <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-[1px] bg-gray-200 -z-10"></div>

              {[
                { title: "Consultation", desc: "We analyze your fleet needs and safety requirements in depth." },
                { title: "Deployment", desc: "Expert installation of MDVR, Dashcams, and sensor systems." },
                { title: "Support", desc: "24/7 dedicated technical support and maintenance." }
              ].map((process, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-white border-2 border-black text-black rounded-full flex items-center justify-center mb-6 font-bold text-xl z-10 shadow-sm">
                    {i + 1}
                  </div>
                  <h4 className="text-2xl font-bold mb-3 text-black">{process.title}</h4>
                  <p className="text-gray-500 max-w-xs leading-relaxed">{process.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
