import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
// import blogPosts from "@/data/blog-posts.json";
import CommentSection from "@/components/blog/CommentSection";
import { getComments } from "@/app/blog/actions";
import BlogDetailManager from "@/components/blog/BlogDetailManager";
import connectDB from "@/lib/db";
import BlogPost from "@/models/BlogPost";

interface BlogPostProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  await connectDB();
  const posts = await BlogPost.find({}, { slug: 1 }).lean();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return posts.map((post: any) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostProps) {
  const { slug } = await params;
  await connectDB();
  const post = await BlogPost.findOne({ slug }).lean();

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    title: `${(post as any).title} | AxelGuard Blog`,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    description: (post as any).excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostProps) {
  const { slug } = await params;
  await connectDB();
  const rawPost = await BlogPost.findOne({ slug }).lean();

  if (!rawPost) {
    notFound();
  }

  // Convert _id to string and remove mongoose specific fields that might cause serialization issues
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { _id, date, createdAt: _createdAt, updatedAt: _updatedAt, ...rest } = rawPost as any;
  
  const post = {
      ...rest,
      id: _id.toString(),
      date: new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  };

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
