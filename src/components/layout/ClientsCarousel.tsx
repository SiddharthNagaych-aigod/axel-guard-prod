"use client";

import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import Image from "next/image";

export default function ClientsCarousel({ clients }: { clients: string[] }) {
  const [emblaRef] = useEmblaCarousel({ loop: true, dragFree: true }, [
    AutoScroll({ speed: 1.5, stopOnInteraction: false, stopOnMouseEnter: true }),
  ]);

  // Clients from content.json are now Cloudinary URLs
  // const clients = content.clients || [];

  if (clients.length === 0) return null;

  return (
    <section className="py-20 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4 text-center mb-12">
        <h2 className="text-3xl font-bold mb-4 text-black">Our Trusted Clients</h2>
        <p className="text-gray-500">Partnering with industry leaders for a safer tomorrow.</p>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {clients.map((clientUrl, index) => (
            <div key={index} className="flex-[0_0_50%] md:flex-[0_0_25%] lg:flex-[0_0_16.66%] min-w-0 px-4">
               {/* Added background color to handle both white and dark logos visibility */}
               <div className="h-24 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-300 p-4">
                 <div className="relative w-full h-full">
                    <Image 
                      src={clientUrl} 
                      alt={`Client ${index + 1}`}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                 </div>
               </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
