import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const contentPath = path.join(process.cwd(), 'src/data/content.json');

export async function GET() {
  try {
    const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
    // Sort products by 'order' field if available, otherwise keep as is
    const products = content.products.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
    return NextResponse.json(products);
  } catch (error) {
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
    content.products = products;

    fs.writeFileSync(contentPath, JSON.stringify(content, null, 2));

    return NextResponse.json({ success: true, message: 'Products updated successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to save products' }, { status: 500 });
  }
}
