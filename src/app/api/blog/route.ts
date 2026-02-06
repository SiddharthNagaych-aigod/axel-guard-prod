import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import BlogPost from '@/models/BlogPost';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    // Sort by order first (if set), then date descending
    const posts = await BlogPost.find().sort({ order: 1, date: -1 }).lean();
    
    // Map _id to id for frontend compatibility
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formatted = posts.map((p: any) => ({
        ...p,
        id: p._id.toString(),
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Failed to fetch blog posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { posts } = body;

    if (!posts || !Array.isArray(posts)) {
        return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    // Handle Bulk Update (e.g. reordering or saving edits)
    for (let i = 0; i < posts.length; i++) {
        const p = posts[i];
        
        const postData = {
          title: p.title,
          slug: p.slug,
          excerpt: p.excerpt,
          content: p.content,
          image: p.image,
          date: p.date,
          category: p.category,
          author: p.author,
          order: i + 1 // Save new order based on array index
        };

        // If it has an ID, update it
        if (p.id || p._id) {
            await BlogPost.findByIdAndUpdate(p.id || p._id, postData);
        } else {
            // Create new post
            await BlogPost.create(postData);
        }
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Failed to save blog posts:', error);
    return NextResponse.json({ error: 'Failed to save posts' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await BlogPost.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete blog post:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
