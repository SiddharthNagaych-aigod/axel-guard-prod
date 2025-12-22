import { NextRequest, NextResponse } from 'next/server';
import { StorageUtil } from '@/lib/storage';

export async function GET() {
  try {
    const categories = await StorageUtil.readJSON('categories.json');
    return NextResponse.json(categories || []);
  } catch {
    return NextResponse.json({ error: 'Failed to load categories' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const categories = await request.json();

    if (!Array.isArray(categories)) {
        return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }

    const success = await StorageUtil.writeJSON('categories.json', categories);

    if (success) {
        return NextResponse.json({ success: true, message: 'Categories updated successfully' });
    } else {
        return NextResponse.json({ error: 'Failed to save categories storage' }, { status: 500 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to save categories' }, { status: 500 });
  }
}
