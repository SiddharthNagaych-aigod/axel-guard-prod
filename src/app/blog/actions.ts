'use server';

import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/db';
import BlogPost from '@/models/BlogPost';
import Comment from '@/models/Comment';

export interface Comment {
  id: string;
  slug: string; // We keep slug in interface for compat, but backend uses relationship
  name: string;
  content: string;
  date: string;
}

export async function getComments(slug: string): Promise<Comment[]> {
  try {
    await connectDB();
    // Find post first to get ID
    const post = await BlogPost.findOne({ slug });
    if (!post) return [];

    const comments = await Comment.find({ post: post._id }).sort({ date: -1 }).lean();
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return comments.map((c: any) => ({
        id: c._id.toString(),
        slug: slug,
        name: c.name,
        content: c.content,
        date: c.date.toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
}

export async function addComment(formData: FormData) {
  const slug = formData.get('slug') as string;
  const name = formData.get('name') as string;
  const content = formData.get('content') as string;

  if (!slug || !name || !content) {
    return { success: false, message: 'All fields are required' };
  }

  try {
    await connectDB();
    const post = await BlogPost.findOne({ slug });
    if (!post) {
         return { success: false, message: 'Post not found' };
    }

    await Comment.create({
        post: post._id,
        name,
        content,
        date: new Date()
    });
    
    revalidatePath(`/blog/${slug}`);
    return { success: true };
  } catch (error) {
    console.error('Error saving comment:', error);
    return { success: false, message: 'Failed to save comment' };
  }
}
