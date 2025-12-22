import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Category from '@/models/Category';
import Subcategory from '@/models/Subcategory';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find().sort({ order: 1 }).lean();
    const subcategories = await Subcategory.find().sort({ order: 1 }).lean();

    // Map subcategories to categories
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const categoryList = categories.map((cat: any) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const subs = subcategories.filter((sub: any) => 
            sub.parent.toString() === cat._id.toString()
        );
        return {
            ...cat,
            subcategories: subs
        };
    });

    return NextResponse.json(categoryList);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to load categories' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const categoriesData = await request.json();

    if (!Array.isArray(categoriesData)) {
        return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }

    await connectDB();

    // 1. Sync Categories
    // Strategy: Upsert existing by _id or val. 
    // BUT we must be careful not to break references.
    // If the Admin Panel sends _id, we use it.

    const incomingCatIds = categoriesData.map(c => c._id).filter(Boolean);
    // const incomingSubIcons: string[] = []; // Track subcategory IDs if needed (Unused)

    // Update or Create Categories
    for (const cat of categoriesData) {
        let catDoc;
        if (cat._id) {
            catDoc = await Category.findByIdAndUpdate(cat._id, {
                name: cat.name,
                val: cat.val,
                href: cat.href,
                order: cat.order || 0
            }, { new: true });
        }
        
        // If not found or new (no _id), create. 
        // Note: Admin should usually send _id for existing.
        if (!catDoc) {
             catDoc = await Category.create({
                name: cat.name,
                val: cat.val,
                href: cat.href,
                order: cat.order || 0
             });
        }

        // Handle Subcategories
        if (cat.subcategories && Array.isArray(cat.subcategories)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const currentSubIds = cat.subcategories.map((s: any) => s._id).filter(Boolean);
            
            // Delete removed subcategories for this category?
            // Safer to just upsert for now.
             await Subcategory.deleteMany({ 
                 parent: catDoc._id, 
                 _id: { $nin: currentSubIds } 
             });

            for (const sub of cat.subcategories) {
                if (sub._id) {
                    await Subcategory.findByIdAndUpdate(sub._id, {
                        name: sub.name,
                        val: sub.val,
                        href: sub.href,
                        parent: catDoc._id,
                        order: sub.order || 0
                    });
                } else {
                    await Subcategory.create({
                        name: sub.name,
                        val: sub.val,
                        href: sub.href,
                        parent: catDoc._id,
                        order: sub.order || 0
                    });
                }
            }
        }
    }

    // Delete Categories not in the incoming list?
    // If we trust the list is complete.
    if (incomingCatIds.length > 0) {
        // Find categories to delete
        const catsToDelete = await Category.find({ _id: { $nin: incomingCatIds } });
        for (const c of catsToDelete) {
             // Delete subcategories first
             await Subcategory.deleteMany({ parent: c._id });
             await Category.deleteOne({ _id: c._id });
        }
    }

    return NextResponse.json({ success: true, message: 'Categories updated successfully' });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to save categories' }, { status: 500 });
  }
}
