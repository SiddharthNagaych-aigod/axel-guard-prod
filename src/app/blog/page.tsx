import Link from "next/link";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";


export default function BlogPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-[100px] pb-20">
        <div className="container mx-auto px-4 text-center">
           <h1 className="text-4xl font-bold text-[var(--heading-color)] mb-4">AxelGuard Blog</h1>
           <p className="text-gray-500 mb-12">Latest updates, news, and insights on vehicle safety.</p>

           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
             {/* Placeholder Posts */}
             {/* Blog Postsss */}
             {[
               {
                 id: 1,
                 category: "Safety",
                 title: "Understanding the Importance of MDVR",
                 excerpt: "A deep dive into how Mobile DVRs are transforming fleet management and safety protocols.",
                 image: "https://res.cloudinary.com/dyn049kt9/image/upload/v1766159941/axelguard/img/AXG38/AI%20mdvr.jpg"
               },
               {
                 id: 2,
                 category: "Technology",
                 title: "The Future of Dashcams",
                 excerpt: "How AI and 4G connectivity are making dashcams smarter and more efficient.",
                 image: "https://res.cloudinary.com/dyn049kt9/image/upload/v1766159931/axelguard/img/AXG31/4ch%20AI%20Dashcam.png"
               },
               {
                 id: 3,
                 category: "IoT",
                 title: "RFID in Modern Logistics",
                 excerpt: "Exploring the role of Active RFID tags in asset tracking and management.",
                 image: "https://res.cloudinary.com/dyn049kt9/image/upload/v1766159924/axelguard/img/AXG27/RFID_reader.jpg"
               }
             ].map((post) => (
               <div key={post.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
                 <div className="relative h-48 w-full bg-gray-100">
                    <Image 
                      src={post.image} 
                      alt={post.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                 </div>
                 <div className="p-6 text-left flex-grow flex flex-col">
                   <span className="text-xs font-bold text-[var(--accent-color)] uppercase">{post.category}</span>
                   <h3 className="text-xl font-bold mt-2 mb-3 text-[var(--heading-color)]">{post.title}</h3>
                   <p className="text-gray-500 text-sm mb-4 flex-grow">{post.excerpt}</p>
                   <Link href="/contact" className="text-[var(--heading-color)] font-medium hover:text-[var(--accent-color)] transition-colors self-start">Read More &rarr;</Link>
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
