
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import Product from '../src/models/Product';

// Load env vars
dotenv.config({ path: '.env.local' });
dotenv.config(); // fallbacks

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is undefined");
  process.exit(1);
}

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("✅ MongoDB Connected");
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error);
        process.exit(1);
    }
};

const migratePDFs = async () => {
    await connectDB();

    try {
        const products = await Product.find({ 
            pdf_manual: { $exists: true, $ne: null } 
        });

        console.log(`🔍 Found ${products.length} products with manuals.`);

        let updatedCount = 0;
        let skippedCount = 0;
        let errorCount = 0;

        for (const product of products) {
            const manualPath = product.pdf_manual;
            
            if (!manualPath) continue;

            // Skip if already a remote URL (http/https)
            if (manualPath.startsWith('http')) {
                console.log(`⏩ [${product.product_code}] Already remote: ${manualPath}`);
                skippedCount++;
                continue;
            }

            // Construct local path
            // Legacy path often stored as: "assets/img/product/..." or "/assets/..."
            // We need to resolve it relative to 'public' folder
            const cleanPath = manualPath.startsWith('/') ? manualPath.slice(1) : manualPath;
            const fullPath = path.join(process.cwd(), 'public', cleanPath);

            if (!fs.existsSync(fullPath)) {
                console.warn(`⚠️ [${product.product_code}] File not found locally: ${fullPath}`);
                errorCount++;
                continue;
            }

            console.log(`📤 [${product.product_code}] Uploading: ${cleanPath}...`);

            try {
                const result = await cloudinary.uploader.upload(fullPath, {
                    folder: `axelguard/manuals/${product.product_code}`,
                    resource_type: 'auto', // Important for PDFs
                    use_filename: true,
                    unique_filename: false,
                });

                // Update DB
                product.pdf_manual = result.secure_url;
                await product.save();
                
                console.log(`✅ [${product.product_code}] Updated: ${result.secure_url}`);
                updatedCount++;
            } catch (uploadError) {
                console.error(`❌ [${product.product_code}] Upload failed:`, uploadError);
                errorCount++;
            }
        }

        console.log("\n--- Migration Summary ---");
        console.log(`✅ Updated: ${updatedCount}`);
        console.log(`⏩ Skipped: ${skippedCount}`);
        console.log(`❌ Errors: ${errorCount}`);

    } catch (error) {
        console.error("Migration failed:", error);
    } finally {
        await mongoose.disconnect();
        console.log("👋 Disconnected");
    }
};

migratePDFs();
