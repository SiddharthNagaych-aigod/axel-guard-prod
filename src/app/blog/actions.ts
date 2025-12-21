'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';

const COMMENTS_FILE = path.join(process.cwd(), 'src/data/comments.json');

export interface Comment {
  id: string;
  slug: string;
  name: string;
  content: string;
  date: string;
}

export async function getComments(slug: string): Promise<Comment[]> {
  try {
    const data = await fs.readFile(COMMENTS_FILE, 'utf-8');
    const comments: Comment[] = JSON.parse(data);
    return comments.filter((c) => c.slug === slug).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch {
    // If file doesn't exist or is empty, return empty array
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

  const newComment: Comment = {
    id: Date.now().toString(),
    slug,
    name,
    content,
    date: new Date().toISOString(),
  };

  try {
    let comments: Comment[] = [];
    try {
      const data = await fs.readFile(COMMENTS_FILE, 'utf-8');
      comments = JSON.parse(data);
    } catch {
      // File missing, start empty
    }

    comments.push(newComment);
    await fs.writeFile(COMMENTS_FILE, JSON.stringify(comments, null, 2));
    
    revalidatePath(`/blog/${slug}`);
    return { success: true };
  } catch (error) {
    console.error('Error saving comment:', error);
    return { success: false, message: 'Failed to save comment' };
  }
}
