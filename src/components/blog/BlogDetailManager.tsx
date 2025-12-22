"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAdmin } from "@/context/AdminContext";
import { Calendar, User, Tag, ArrowLeft, Save, Upload, Edit } from "lucide-react";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  date: string;
  image: string;
  excerpt: string;
  category?: string;
  author?: string;
  content: string;
};

export default function BlogDetailManager({ initialPost }: { initialPost: BlogPost }) {
  const { isAdminMode } = useAdmin();
  const [post, setPost] = useState<BlogPost>(initialPost);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => { setPost(initialPost); }, [initialPost]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
     if (!e.target.files?.length) return;
     const file = e.target.files[0];
     const formData = new FormData();
     formData.append('file', file);
     formData.append('folder', 'axelguard/blog'); // Generic blog folder

     try {
         const res = await fetch('/api/upload', { method: 'POST', body: formData });
         const data = await res.json();
         if (data.secure_url) {
             setPost(p => ({ ...p, image: data.secure_url }));
         }
     } catch (err) {
         console.error("Upload failed", err);
         alert("Upload failed");
     }
  };

  const savePost = async () => {
    setIsSaving(true);
    try {
        // Fetch all, update this one, save all.
        const res = await fetch('/api/blog');
        const allPosts = await res.json();
        const updatedPosts = allPosts.map((p: BlogPost) => 
            p.id === post.id ? post : p
        );

        await fetch('/api/blog', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ posts: updatedPosts })
        });
        alert("Saved successfully!");
    } catch (error) {
        console.error(error);
        alert("Failed to save");
    } finally {
        setIsSaving(false);
    }
  };

  const authorName = post.author 
    ? post.author.replace(/Posted by\s+By\s+/g, '').replace(/AxelGuard Admin/g, 'AxelGuard Team').trim()
    : 'AxelGuard Team';

  if (!isAdminMode) {
    return (
      <>
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

      <div className="container mx-auto px-4 max-w-4xl">
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
      </div>
      </>
    );
  }

  // Admin Mode
  return (
    <div className="container mx-auto px-4 pt-24 pb-20">
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl mb-8 flex justify-between items-center sticky top-20 z-50 shadow-md">
            <div>
               <h3 className="font-bold text-yellow-800 flex items-center gap-2"><Edit size={16} /> Edit Mode</h3>
               <p className="text-xs text-yellow-700">Editing: {post.slug}</p>
            </div>
            <button 
                onClick={savePost} 
                disabled={isSaving}
                className="bg-black text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-800 disabled:opacity-50"
            >
                <Save size={18} /> {isSaving ? "Saving..." : "Save Changes"}
            </button>
        </div>

        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Title & Meta */}
            <div className="space-y-4 bg-white p-6 rounded-xl border shadow-sm">
                <label className="block text-sm font-bold text-gray-700">Title</label>
                <input 
                    type="text" 
                    value={post.title} 
                    onChange={e => setPost({...post, title: e.target.value})}
                    className="w-full text-2xl font-bold border-b-2 border-gray-200 focus:border-black outline-none py-2"
                />
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700">Date</label>
                        <input 
                            type="text" 
                            value={post.date} 
                            onChange={e => setPost({...post, date: e.target.value})}
                            className="w-full border p-2 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700">Category</label>
                        <input 
                            type="text" 
                            value={post.category || ''} 
                            onChange={e => setPost({...post, category: e.target.value})}
                            className="w-full border p-2 rounded"
                        />
                    </div>
                </div>
            </div>

            {/* Image */}
            <div className="bg-white p-6 rounded-xl border shadow-sm">
                <label className="block text-sm font-bold text-gray-700 mb-4">Featured Image</label>
                <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4 border">
                     <Image 
                       src={post.image || '/placeholder.jpg'} 
                       alt="Preview" 
                       fill 
                       className="object-cover" 
                       unoptimized
                    />
                </div>
                <div className="flex gap-4">
                    <input 
                        type="text" 
                        value={post.image} 
                        onChange={e => setPost({...post, image: e.target.value})}
                        className="flex-grow border p-2 rounded"
                        placeholder="Image URL"
                    />
                     <div className="relative">
                        <input type="file" id="blog-img" className="hidden" onChange={handleUpload} accept="image/*" />
                        <label htmlFor="blog-img" className="bg-gray-100 text-black px-4 py-2 rounded border cursor-pointer hover:bg-gray-200 flex items-center gap-2">
                             <Upload size={16} /> Upload
                        </label>
                    </div>
                </div>
            </div>

            {/* Excerpt */}
            <div className="bg-white p-6 rounded-xl border shadow-sm">
                <label className="block text-sm font-bold text-gray-700 mb-2">Excerpt</label>
                <textarea 
                    rows={3}
                    value={post.excerpt} 
                    onChange={e => setPost({...post, excerpt: e.target.value})}
                    className="w-full border p-2 rounded"
                />
            </div>

            {/* Content HTML */}
            <div className="bg-white p-6 rounded-xl border shadow-sm">
                <label className="block text-sm font-bold text-gray-700 mb-2">Content (HTML)</label>
                <div className="text-xs text-gray-500 mb-2">Use valid HTML. Be careful with tags.</div>
                <textarea 
                    rows={20}
                    value={post.content} 
                    onChange={e => setPost({...post, content: e.target.value})}
                    className="w-full border p-4 rounded font-mono text-sm bg-gray-50"
                />
            </div>
            
            {/* Preview Only Block */}
            <div className="bg-white p-6 rounded-xl border shadow-sm opacity-60 pointer-events-none grayscale">
                 <h3 className="font-bold mb-4">Live Preview (Approximation)</h3>
                 <div 
                  className="blog-content"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
            </div>
        </div>
    </div>
  );
}
