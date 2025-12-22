import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import blogPosts from "@/data/blog-posts.json";
import CommentSection from "@/components/blog/CommentSection";
import { getComments } from "@/app/blog/actions";
import BlogDetailManager from "@/components/blog/BlogDetailManager";

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

  const comments = await getComments(slug);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 transition-colors duration-300">
      <Header />

      <main className="flex-grow pb-24 dark:bg-slate-950">
           <BlogDetailManager initialPost={post} />

           {/* Comments Section */}
           <CommentSection slug={slug} initialComments={comments} />
      </main>

      <Footer />
    </div>
  );
}
