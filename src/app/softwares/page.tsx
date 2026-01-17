import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import Image from "next/image";
import { Download } from "lucide-react";

export const dynamic = 'force-dynamic';

export default function SoftwaresPage() {
  const softwares = [
    {
      name: "CMSV6",
      description: "Advanced vehicle tracking and fleet management solution.",
      href: "https://drive.google.com/file/d/1Tnpgf4sptsVaVf_XR_5CaRBlW1oHlv49/view?usp=drive_link",
      image: "/softwares/cmsv6.png",
    },
    {
      name: "CMSV6 (Alternative)",
      description: "Additional resource or alternative download link.",
      href: "https://drive.google.com/file/d/1Tnpgf4sptsVaVf_XR_5CaRBlW1oHlv49/view?usp=drive_link",
      image: "/softwares/generic.png",
    },
    {
      name: "GPS Software",
      description: "Comprehensive GPS navigation and positioning tools.",
      href: "https://drive.google.com/drive/folders/1F48oE8wK3Vtu0tdImQoSf4o4Vz082uYc?usp=sharing",
      image: "/softwares/gps.png",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-black text-white font-sans">
      <Header />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              Software Downloads
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Access the essential tools and applications for your AxelGuard systems.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {softwares.map((software, index) => (
              <div 
                key={index}
                className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-2"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={software.image}
                    alt={software.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                </div>
                
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-blue-400 transition-colors">
                    {software.name}
                  </h3>
                  <p className="text-gray-400 mb-6 min-h-[3rem]">
                    {software.description}
                  </p>
                  
                  <Link 
                    href={software.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 w-full justify-center bg-white hover:bg-gray-200 text-black font-bold py-3 px-6 rounded-xl transition-colors"
                  >
                    <Download size={20} />
                    Download Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
