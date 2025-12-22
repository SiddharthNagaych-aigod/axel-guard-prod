import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getContent } from "@/lib/content";
import { CheckCircle, Shield, Truck, BarChart } from "lucide-react";

export const dynamic = 'force-dynamic';

export default function ServicesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Page Title */}
      <div className="bg-[var(--heading-color)] text-white py-20 mt-[72px]">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Our Services</h1>
          <p className="text-xl text-gray-300">Comprehensive solutions for fleet management and vehicle safety</p>
        </div>
      </div>

      <main className="flex-grow py-20">
        <div className="container mx-auto px-4">
          
          <div className="grid gap-12">
            {getContent().services.map((service, idx) => (
              <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow flex flex-col md:flex-row gap-8 items-start">
                 <div className="w-full md:w-1/3 h-64 bg-[var(--surface-color)] rounded-xl flex items-center justify-center text-[var(--accent-color)]">
                    {/* Placeholder mapping based on title or random icon */}
                    {idx === 0 ? <Truck size={64} /> : 
                     idx === 1 ? <Shield size={64} /> :
                     idx === 2 ? <BarChart size={64} /> : <CheckCircle size={64} />}
                 </div>
                 <div className="w-full md:w-2/3">
                   <h3 className="text-2xl font-bold text-[var(--heading-color)] mb-4">{service.title}</h3>
                   <p className="text-gray-600 leading-relaxed mb-6 text-lg">{service.description}</p>
                   {/* <Link href={service.link} className="text-[var(--accent-color)] font-medium hover:underline">Read More &rarr;</Link> */}
                 </div>
              </div>
            ))}
          </div>

          {/* Additional Service Info */}
          <div className="mt-20 text-center">
            <h2 className="text-3xl font-bold text-[var(--heading-color)] mb-8">Process & Methodology</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "Consultation", desc: "We analyze your fleet needs and safety requirements." },
                { title: "Installation", desc: "Expert installation of MDVR, Dashcams, and sensors." },
                { title: "Support", desc: "24/7 technical support and maintenance." }
              ].map((process, i) => (
                <div key={i} className="p-6 bg-[var(--surface-color)] rounded-xl">
                  <div className="w-12 h-12 bg-[var(--heading-color)] text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                    {i + 1}
                  </div>
                  <h4 className="text-xl font-bold mb-2">{process.title}</h4>
                  <p className="text-gray-600">{process.desc}</p>
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
