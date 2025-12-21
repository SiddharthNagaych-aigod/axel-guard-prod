import Link from "next/link";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import blogPosts from "@/data/blog-posts.json";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const POSTS_PER_PAGE = 9;

  const totalPosts = blogPosts.length;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  const paginatedPosts = blogPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 transition-colors duration-300">
      <Header />
      
      <main className="flex-grow pt-[140px] pb-20">
        <div className="container mx-auto px-4 text-center">
           <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 font-[family-name:var(--font-raleway)]">AxelGuard Insights</h1>
           <p className="text-slate-500 dark:text-slate-400 mb-16 text-lg max-w-2xl mx-auto font-[family-name:var(--font-roboto)]">Latest updates, news, and expert insights on vehicle safety, fleet management, and surveillance technology.</p>

           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {paginatedPosts.map((post) => (
               <div key={post.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl dark:shadow-none transition-all duration-300 flex flex-col group text-left">
                 <div className="relative h-56 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <Image 
                      src={post.image || '/placeholder.jpg'} 
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                 </div>
                 <div className="p-8 flex-grow flex flex-col">
                   {post.category && (
                     <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3">{post.category}</span>
                   )}
                   <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white line-clamp-2 font-[family-name:var(--font-raleway)] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                   </h3>
                   <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 flex-grow line-clamp-3 leading-relaxed">{post.excerpt}</p>
                   <Link href={`/blog/${post.slug}`} className="text-slate-900 dark:text-white font-bold hover:text-blue-600 dark:hover:text-blue-400 transition-colors self-start inline-flex items-center gap-2">
                     Read Article <ArrowRight className="w-4 h-4" />
                   </Link>
                 </div>
               </div>
             ))}
           </div>

           {/* Pagination */}
           {totalPages > 1 && (
             <div className="flex justify-center items-center gap-4">
               {currentPage > 1 ? (
                 <Link 
                   href={`/blog?page=${currentPage - 1}`}
                   className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-full text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                 >
                   <ArrowLeft className="w-4 h-4" /> Previous
                 </Link>
               ) : (
                 <button disabled className="flex items-center gap-2 px-6 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-full text-slate-300 dark:text-slate-700 cursor-not-allowed">
                   <ArrowLeft className="w-4 h-4" /> Previous
                 </button>
               )}

               <span className="text-slate-500 dark:text-slate-400 font-medium px-4">
                 Page {currentPage} of {totalPages}
               </span>

               {currentPage < totalPages ? (
                 <Link 
                   href={`/blog?page=${currentPage + 1}`}
                   className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-full text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                 >
                   Next <ArrowRight className="w-4 h-4" />
                 </Link>
               ) : (
                 <button disabled className="flex items-center gap-2 px-6 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-full text-slate-300 dark:text-slate-700 cursor-not-allowed">
                   Next <ArrowRight className="w-4 h-4" />
                 </button>
               )}
             </div>
           )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
