
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import blogPosts from "@/data/blog-posts.json";
import { Calendar, User, Tag, ArrowLeft } from "lucide-react";
import CommentSection from "@/components/blog/CommentSection";
import { getComments } from "@/app/blog/actions";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

interface BlogPostProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: `${post.title} | AxelGuard Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  // Clean up author name
  const authorName = post.author 
    ? post.author.replace(/Posted by\s+By\s+/g, '').replace(/AxelGuard Admin/g, 'AxelGuard Team').trim()
    : 'AxelGuard Team';

  const comments = await getComments(slug);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 transition-colors duration-300">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-[100px] md:pt-[140px] pb-16 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 border-b border-transparent dark:border-white/5">
        <div className="container mx-auto px-4 max-w-4xl text-center">
            <div className="flex justify-center mb-8">
              <Breadcrumbs 
                items={[
                  { label: "Blog", href: "/blog" },
                  { label: post.title }
                ]} 
              />
            </div>

            {/* Category */}
             {post.category && (
              <span className="inline-flex items-center gap-1.5 py-1.5 px-4 rounded-full bg-blue-100/50 text-blue-700 border border-blue-100 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/20 text-xs font-bold uppercase tracking-wider mb-6">
                <Tag className="w-3 h-3" />
                {post.category}
              </span>
            )}
            
            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-8 leading-tight font-[family-name:var(--font-raleway)]">
              {post.title}
            </h1>

            {/* Meta Data */}
             <div className="flex flex-wrap items-center justify-center gap-6 text-slate-500 dark:text-slate-400 text-sm font-medium font-[family-name:var(--font-roboto)]">
               <div className="flex items-center gap-2">
                 <Calendar className="w-4 h-4 text-blue-500" />
                 <span>{post.date}</span>
               </div>
               <div className="flex items-center gap-2">
                 <User className="w-4 h-4 text-blue-500" />
                 <span>{authorName}</span>
               </div>
             </div>
        </div>
      </section>

      <main className="flex-grow pb-24 dark:bg-slate-950">
        <article className="container mx-auto px-4 max-w-4xl">
          
          {/* Featured Image */}
          <div className="relative w-full aspect-[21/9] rounded-3xl overflow-hidden mb-16 shadow-2xl ring-1 ring-slate-900/5 dark:ring-white/10 -mt-8 bg-slate-200 dark:bg-slate-800">
             <Image 
               src={post.image || '/placeholder.jpg'} 
               alt={post.title}
               fill
               className="object-cover"
               priority
               unoptimized
             />
          </div>

          {/* Content */}
          <div className="bg-white dark:bg-slate-950">
            <div 
              className="blog-content max-w-none"
              dangerouslySetInnerHTML={{ 
                __html: post.content.replace(/href="([^"]+)\.html"/g, 'href="/blog/$1"').replace(/href="[^"]*index\.html"/g, 'href="/blog"') 
              }}
            />
          </div>
          
          {/* Back Navigation */}
          <div className="mt-20 pt-10 border-t border-slate-100 dark:border-white/10 mb-16">
            <Link href="/blog" className="inline-flex items-center gap-2 text-slate-900 dark:text-white font-bold hover:text-blue-600 dark:hover:text-blue-400 transition-colors group">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back to all insights</span>
            </Link>
          </div>
        </article>

        {/* Comments Section */}
        <CommentSection slug={slug} initialComments={comments} />
      </main>

      <Footer />
    </div>
  );
}
