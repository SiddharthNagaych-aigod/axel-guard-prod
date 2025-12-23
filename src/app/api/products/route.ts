import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import '@/models/Category';
import '@/models/Subcategory';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find()
        .populate('category')
        .populate('subcategory')
        .sort({ order: 1 })
        .lean();
    
    // Transform to match legacy interface if needed, or return as is with populated fields
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formatted = products.map((p: any) => ({
        ...p,
        product_name: p.name, // compatibility
    }));

    return NextResponse.json(formatted);
  } catch (error) {
      console.error(error);
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

    await connectDB();

    // Strategy: Update products by _id or product_code.
    // If the frontend sends the full list, we can sync.
    // We should also resolve references if the frontend sends updated category/subcategory IDs (or Names).

    const incomingIds = [];

    for (const p of products) {
        // Resolve Categories if IDs are provided, or names?
        const categoryId = p.category?._id || p.category;
        const subcategoryId = p.subcategory?._id || p.subcategory;

        // If simple string (not ObjectId), might be name? (Legacy support)
        // For now, let's assume the frontend sends what GET returned (which has _id).
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const updateData: any = {
            product_code: p.product_code,
            name: p.product_name || p.name,
            product_type: p.product_type, // Maintain legacy field
            images: p.images,
            features: p.features,
            technical_features: p.technical_features,
            price: p.price,
            pdf_manual: p.pdf_manual,
            order: p.order
        };

        if (categoryId) updateData.category = categoryId;
        if (subcategoryId) updateData.subcategory = subcategoryId;

        let doc;
        if (p._id) {
            doc = await Product.findByIdAndUpdate(p._id, updateData, { new: true });
            if (doc) incomingIds.push(doc._id);
        } else {
            // Try product_code
            doc = await Product.findOneAndUpdate({ product_code: p.product_code }, updateData, { new: true, upsert: true });
            if (doc) incomingIds.push(doc._id);
        }
    }

    // Optional: Delete products not in list?
    // If sending full list, yes.
    // BUT we want to support partial updates (saving just one product).
    // So we DISABLE deletion here. Deletion should be a separate HTTP DELETE method or explicit flag.
    /*
    if (incomingIds.length > 0) {
        await Product.deleteMany({ _id: { $nin: incomingIds } });
    }
    */

    return NextResponse.json({ success: true, message: 'Products updated successfully' });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to save products' }, { status: 500 });
  }
}
