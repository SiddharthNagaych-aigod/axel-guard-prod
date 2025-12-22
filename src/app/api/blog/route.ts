import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const blogPath = path.join(process.cwd(), 'src/data/blog-posts.json');

export async function GET() {
  try {
    const posts = JSON.parse(fs.readFileSync(blogPath, 'utf8'));
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load blog posts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Allow updating either the whole list (reorder) or a single post (add/edit)
    // For simplicity in this iteration, we'll expect the full list or handle logic if needed.
    // Let's assume the client sends the FULL list of posts to save (simplest for reordering + editing).
    
    // Check if it's a full list update
    if (Array.isArray(body)) {
         fs.writeFileSync(blogPath, JSON.stringify(body, null, 2));
         return NextResponse.json({ success: true, message: 'Blog posts updated successfully' });
    }

    return NextResponse.json({ error: 'Invalid data format, expected array of posts' }, { status: 400 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to save blog posts' }, { status: 500 });
  }
}
