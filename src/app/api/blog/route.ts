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
    // Detailed update: Upsert or Update each
    for (let i = 0; i < posts.length; i++) {
        const p = posts[i];
        // If it has an ID, update it
        if (p.id || p._id) {
            await BlogPost.findByIdAndUpdate(p.id || p._id, {
                title: p.title,
                slug: p.slug,
                excerpt: p.excerpt,
                content: p.content,
                image: p.image,
                date: p.date,
                category: p.category,
                author: p.author,
                order: i + 1 // Save new order based on array index
            });
        }
        // Create new is handled via a separate create flow ideally, but we could support it here if no ID
        // For now assuming existing posts only for reorder/edit
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Failed to save blog posts:', error);
    return NextResponse.json({ error: 'Failed to save posts' }, { status: 500 });
  }
}
