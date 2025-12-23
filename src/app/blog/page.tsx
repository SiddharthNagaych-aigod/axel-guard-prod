import Link from "next/link";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ArrowLeft, ArrowRight } from "lucide-react";
import BlogListingManager from "@/components/blog/BlogListingManager";
import connectDB from "@/lib/db";
import BlogPost from "@/models/BlogPost";

export const dynamic = 'force-dynamic';

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  await connectDB();
  const rawPosts = await BlogPost.find().sort({ order: 1, date: -1 }).lean();
  
  // Transform for client component
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const blogPosts = rawPosts.map((p: any) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, date, createdAt, updatedAt, ...rest } = p;
      return {
          ...rest,
          id: _id.toString(),
          date: new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      };
  });

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
      
      <main className="flex-grow pt-[100px] md:pt-[140px] pb-20">
        <div className="container mx-auto px-4 text-center">
           <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 font-[family-name:var(--font-raleway)]">AxelGuard Insights</h1>
           <p className="text-slate-500 dark:text-slate-400 mb-16 text-lg max-w-2xl mx-auto font-[family-name:var(--font-roboto)]">Latest updates, news, and expert insights on vehicle safety, fleet management, and surveillance technology.</p>

           <BlogListingManager initialPosts={paginatedPosts} />

           {/* Pagination */}
           {totalPages > 1 && (
             <div className="flex justify-center items-center gap-4 mt-8">
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
