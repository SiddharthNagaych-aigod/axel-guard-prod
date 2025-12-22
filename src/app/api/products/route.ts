import { NextRequest, NextResponse } from 'next/server';
import { StorageUtil } from '@/lib/storage';
import { Content } from '@/lib/content';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const content = await StorageUtil.readJSON<Content>('content.json');
    if (!content || !content.products) {
        return NextResponse.json([]);
    }
    // Sort products by 'order' field if available, otherwise keep as is
    const products = content.products.sort((a: { order?: number }, b: { order?: number }) => (a.order || 0) - (b.order || 0));
    return NextResponse.json(products);
  } catch {
    return NextResponse.json({ error: 'Failed to load products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { products } = body;

    if (!products || !Array.isArray(products)) {
        return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }

    const content = await StorageUtil.readJSON<Content>('content.json') || { products: [], services: [], clients: [] };
    
    // Deduplicate products based on product_code
    const seen = new Set();
    const uniqueProducts = [];
    // Iterate backwards to find latest
    for (let i = products.length - 1; i >= 0; i--) {
        const p = products[i];
        if (!seen.has(p.product_code)) {
            seen.add(p.product_code);
            uniqueProducts.unshift(p);
        }
    }
    
    content.products = uniqueProducts;

    const success = await StorageUtil.writeJSON('content.json', content);

    if (success) {
         return NextResponse.json({ success: true, message: 'Products updated successfully' });
    } else {
         return NextResponse.json({ error: 'Failed to save products storage' }, { status: 500 });
    }

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to save products' }, { status: 500 });
  }
}
