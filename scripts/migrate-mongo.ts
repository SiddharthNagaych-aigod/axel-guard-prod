import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import mongoose from 'mongoose';

const DATA_DIR = path.join(process.cwd(), 'src/data');

async function migrate() {
    // Load environment variables *before* importing modules that use them
    dotenv.config({ path: path.resolve(process.cwd(), '.env') });
    if (!process.env.MONGODB_URI) {
        dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
    }

    console.log('Connecting to MongoDB...');
    if (!process.env.MONGODB_URI) {
        console.error('Error: MONGODB_URI is not defined.');
        process.exit(1);
    }

    // Dynamic imports to prevent hoisting issues
    const { default: connectDB } = await import('../src/lib/db');
    const { default: Category } = await import('../src/models/Category');
    const { default: Subcategory } = await import('../src/models/Subcategory');
    const { default: Product } = await import('../src/models/Product');
    const { default: Client } = await import('../src/models/Client');
    const { default: Service } = await import('../src/models/Service');

    await connectDB();
    console.log('Connected.');

    // 1. Clear existing data
    console.log('Cleaning up old collections...');
    await Category.deleteMany({});
    await Subcategory.deleteMany({});
    await Product.deleteMany({});
    await Client.deleteMany({});
    await Service.deleteMany({});

    // 2. Migrate Categories & Subcategories
    console.log('Migrating Categories...');
    const categoriesData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'categories.json'), 'utf-8'));
    
    // Maps for resolving product relationships
    const categoryMap: Record<string, any> = {}; 
    const subcategoryMap: Record<string, any> = {};

    let catOrder = 0;
    for (const catData of categoriesData) {
        catOrder++;
        const newCat = await Category.create({
            name: catData.name,
            val: catData.val,
            href: catData.href,
            order: catOrder
        });

        // Store mappings (both Name and Val for robustness)
        categoryMap[catData.name] = newCat;
        categoryMap[catData.name.toLowerCase()] = newCat;
        categoryMap[catData.val] = newCat;

        if (catData.subcategories && catData.subcategories.length > 0) {
            let subOrder = 0;
            for (const subData of catData.subcategories) {
                subOrder++;
                const newSub = await Subcategory.create({
                    parent: newCat._id,
                    name: subData.name,
                    val: subData.val,
                    href: subData.href,
                    order: subOrder
                });
                
                subcategoryMap[subData.name] = newSub;
                subcategoryMap[subData.name.toLowerCase()] = newSub;
                subcategoryMap[subData.val] = newSub;
            }
        }
    }
    console.log(`Migrated ${categoriesData.length} categories.`);

    // 3. Migrate Content (Products, Services, Clients)
    console.log('Migrating Content...');
    const contentData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'content.json'), 'utf-8'));

    // Clients
    if (contentData.clients) {
        console.log(`Migrating ${contentData.clients.length} clients...`);
        let clientOrder = 0;
        for (const url of contentData.clients) {
            clientOrder++;
            await Client.create({ imageUrl: url, order: clientOrder });
        }
    }

    // Services
    if (contentData.services) {
        console.log(`Migrating ${contentData.services.length} services...`);
        let serviceOrder = 0;
        for (const s of contentData.services) {
            serviceOrder++;
            await Service.create({ ...s, order: serviceOrder });
        }
    }

    // Products
    // Manual mapping for mismatched types
    const typeMapping: Record<string, { cat?: string, sub?: string }> = {
        'MDVR Monitor': { cat: 'Accessories' },
        'RFID Tags': { cat: 'RFID' },
        'Active RFID Reader': { cat: 'RFID' },
        'Indoor Dome Camera': { sub: 'Indoor' },
        'Indoor': { sub: 'Indoor' }, // Explicit
        'Outdoor Bullet camera': { sub: 'Outdoor' },
        'Outdoor': { sub: 'Outdoor' }, // Explicit
        'MDVR Other Accessories ': { cat: 'Accessories' },
        'MDVR Other Accessories': { cat: 'Accessories' },
        'AI camera': { cat: 'Camera' }, // Fallback to general category
        'Dashcam': { cat: 'Dashcam' },
        'Basic version MDVR': { sub: 'Basic version MDVR' },
        'Enhanced Version MDVR': { sub: 'Enhanced Version MDVR' },
        'AI Version MDVR': { sub: 'AI Version MDVR' },
        'Mobile DVR (MDVR)': { cat: 'Mobile DVR (MDVR)' },
        'Camera': { cat: 'Camera' },
        'RFID': { cat: 'RFID' },
        'Accessories': { cat: 'Accessories' }
    };

    if (contentData.products) {
        console.log(`Migrating ${contentData.products.length} products...`);
        let productsAdded = 0;
        let productsSkipped = 0;

        for (const p of contentData.products) {
            const pType = p.product_type;
            let categoryId = null;
            let subcategoryId = null;

            // Strategy 0: Manual Mapping
            const mapping = typeMapping[pType] || typeMapping[pType.trim()];
            if (mapping) {
                if (mapping.sub) {
                    const sub = subcategoryMap[mapping.sub];
                    if (sub) {
                        subcategoryId = sub._id;
                        categoryId = sub.parent;
                    } 
                } else if (mapping.cat) {
                   const cat = categoryMap[mapping.cat];
                   if (cat) {
                       categoryId = cat._id;
                   }
                }
            }

            // Strategy 1: Check matches if not found by mapping
            if (!categoryId) {
                const matchedSub = subcategoryMap[pType] || subcategoryMap[pType.toLowerCase()];
                if (matchedSub) {
                    subcategoryId = matchedSub._id;
                    categoryId = matchedSub.parent;
                } else {
                    const matchedCat = categoryMap[pType] || categoryMap[pType.toLowerCase()];
                    if (matchedCat) {
                        categoryId = matchedCat._id;
                    }
                }
            }


            if (!categoryId) {
                console.warn(`Warning: Product ${p.product_code} (${p.product_name}) has unknown type '${pType}'. Skipping.`);
                productsSkipped++;
                continue;
            }

            try {
                await Product.create({
                    product_code: p.product_code,
                    name: p.product_name,
                    product_type: p.product_type,
                    category: categoryId,
                    subcategory: subcategoryId, // Optional
                    images: p.images,
                    features: p.features,
                    technical_features: p.technical_features,
                    price: p.price,
                    pdf_manual: p.pdf_manual,
                    order: p.order
                });
                productsAdded++;
            } catch (err) {
                console.error(`Failed to add product ${p.product_code}:`, err);
                productsSkipped++;
            }
        }
        console.log(`Products: ${productsAdded} added, ${productsSkipped} skipped.`);
    }

    console.log('Migration Complete.');
    process.exit(0);
}

migrate().catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
});
