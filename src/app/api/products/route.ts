import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const contentPath = path.join(process.cwd(), 'src/data/content.json');

export async function GET() {
  try {
    const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
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

    const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
    
    // Deduplicate products based on product_code
    // We use a Map to keep the last occurrence (assuming latest edit) or first?
    // If client sends duplicates, usually the last one is the valid one if they were appended.
    // But if they are just duplicates, it doesn't matter.
    // Let's keep the FIRST occurrence to be safe against accidental appends, 
    // OR if the user edited one, we hope it's the one we keep.
    // However, if the client sends [Old, New], we want New.
    // So distinct by product_code, keeping the LAST one found in the array.
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

    fs.writeFileSync(contentPath, JSON.stringify(content, null, 2));

    return NextResponse.json({ success: true, message: 'Products updated successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to save products' }, { status: 500 });
  }
}
