import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const categoriesPath = path.join(process.cwd(), 'src/data/categories.json');

export async function GET() {
  try {
    if (!fs.existsSync(categoriesPath)) {
        return NextResponse.json([]);
    }
    const categories = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'));
    return NextResponse.json(categories);
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

    fs.writeFileSync(categoriesPath, JSON.stringify(categories, null, 2));

    return NextResponse.json({ success: true, message: 'Categories updated successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to save categories' }, { status: 500 });
  }
}
