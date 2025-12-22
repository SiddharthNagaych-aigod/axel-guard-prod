"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAdmin } from "@/context/AdminContext";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Edit, Plus, Trash2 } from "lucide-react";

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  date: string;
  image: string;
  excerpt: string;
};

function SortableBlogCard({ post }: { post: BlogPost }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: post.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm relative group">
       {/* Drag Handle */}
       <div {...attributes} {...listeners} className="absolute top-2 right-2 z-10 p-2 bg-white/80 rounded-md cursor-grab active:cursor-grabbing hover:bg-gray-100 shadow-sm">
         <GripVertical size={20} className="text-gray-500" />
       </div>

      <div className="relative h-48 w-full group-hover:scale-105 transition-transform duration-500"> 
          <Image 
            src={post.image || '/placeholder.jpg'} 
            alt={post.title}
            fill
            className="object-cover"
            unoptimized
          />
      </div>
      
      <div className="p-6">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{post.date}</span>
        <h3 className="text-xl font-bold text-black mt-2 mb-3 line-clamp-2 leading-tight">
          {post.title}
        </h3>
        <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-2 text-blue-600 font-bold hover:underline mt-2">
            <Edit size={16} /> Edit Post
        </Link>
      </div>
    </div>
  );
}

export default function BlogListingManager({ initialPosts }: { initialPosts: BlogPost[] }) {
  const { isAdminMode } = useAdmin();
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (isAdminMode) {
      fetch('/api/blog')
        .then(res => res.json())
        .then(data => setPosts(data))
        .catch(err => console.error("Failed to fetch blog posts", err));
    } else {
        setPosts(initialPosts);
    }
  }, [isAdminMode, initialPosts]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setPosts((items) => {
        const oldIndex = items.findIndex((p) => p.id === active.id);
        const newIndex = items.findIndex((p) => p.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        
        // Save new order
        fetch('/api/blog', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ posts: newItems })
        }).catch(err => console.error("Failed to save order", err));

        return newItems;
      });
    }
  };

  if (!isAdminMode) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {initialPosts.map((post) => (
            <Link 
              key={post.id} 
              href={`/blog/${post.slug}`}
              className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-black hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
            >
              <div className="relative h-64 w-full overflow-hidden">
                <Image 
                  src={post.image || '/placeholder.jpg'} 
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                <span className="absolute bottom-4 left-4 text-white text-xs font-bold uppercase tracking-widest bg-black/50 px-3 py-1 rounded-full backdrop-blur-md">
                  {post.date}
                </span>
              </div>
              
              <div className="p-8 flex flex-col flex-grow">
                <h2 className="text-2xl font-bold text-black mb-4 group-hover:text-blue-600 transition-colors leading-tight">
                  {post.title}
                </h2>
                <p className="text-gray-500 mb-6 line-clamp-3 leading-relaxed flex-grow">
                  {post.excerpt}
                </p>
                <div className="mt-auto flex items-center gap-2 text-black font-bold group-hover:gap-3 transition-all">
                  Read Article <span className="text-xl">&rarr;</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      );
  }

  return (
    <div>
       <div className="flex justify-between items-center mb-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <div>
           <h3 className="font-bold text-yellow-800">Admin Mode Active</h3>
           <p className="text-sm text-yellow-700">Drag items to reorder blog posts.</p>
        </div>
        {/* Potentially Add New Post button here later */}
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={posts.map(p => p.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <SortableBlogCard key={post.id} post={post} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
