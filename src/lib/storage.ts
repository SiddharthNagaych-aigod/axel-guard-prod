import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary (re-using env vars)
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const IS_PROD = process.env.NODE_ENV === 'production';
const DATA_DIR = path.join(process.cwd(), 'src/data');

/**
 * StorageUtil provides a unified interface for reading/writing JSON data.
 * - In Development: Uses local filesystem (src/data/*.json)
 * - In Production: Uses Cloudinary 'raw' resources (axelguard/data/*.json)
 */
export class StorageUtil {
    
    /**
     * Reads a JSON file.
     * @param filename e.g. 'categories.json' or 'content.json'
     * @returns Parsed JSON object or array
     */
    static async readJSON(filename: string): Promise<any> {
        // always try local first for speed/fallback, or strictly cloud in prod?
        // STRATEGY: In prod, try getting from cloud. If 404, fallback to local (bundled) file and return it.
        // This acts as a "seed" for the cloud database.
        
        if (IS_PROD) {
            try {
                // Cloudinary Public ID: axelguard/data/categories.json
                // We need the secure_url. But 'raw' files might be private? 
                // Public raw files are accessible via URL.
                
                // Construct URL explicitly or use API to get resource?
                // Using API is safer to ensure it exists.
                // However, detailed resource gives us the URL.
                // For 'raw' files, the public_id includes extension.
                const publicId = `axelguard/data/${filename}`;
                
                // We'll use the authenticated API to get the resource details to find the URL,
                // then fetch the content. Or just fetch the URL if we know the pattern.
                // Let's rely on constructing the URL for "raw" resources.
                // Format: https://res.cloudinary.com/<cloud_name>/raw/upload/<public_id>
                const url = `https://res.cloudinary.com/${process.env.CLOUD_NAME}/raw/upload/${publicId}`;
                
                const res = await fetch(url, { cache: 'no-store' });
                
                if (res.ok) {
                    return await res.json();
                } else {
                    console.warn(`[Storage] Cloud file ${filename} not found (Status ${res.status}). Falling back to local/seed.`);
                }
            } catch (error) {
                console.error(`[Storage] Failed to fetch from Cloudinary: ${error}`);
                // Fallback to local
            }
        }

        // Local Filesystem (Dev or Prod Fallback)
        const filePath = path.join(DATA_DIR, filename);
        if (fs.existsSync(filePath)) {
            return JSON.parse(fs.readFileSync(filePath, 'utf8'));
        }
        
        return null; // File doesn't exist anywhere
    }

    /**
     * Writes JSON data to storage.
     * @param filename e.g. 'categories.json'
     * @param data Object or Array to save
     */
    static async writeJSON(filename: string, data: any): Promise<boolean> {
        if (IS_PROD) {
            try {
                const publicId = `axelguard/data/${filename}`;
                const jsonString = JSON.stringify(data, null, 2);
                
                // Upload as 'raw' resource
                await new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        { 
                            public_id: publicId, 
                            resource_type: 'raw', 
                            overwrite: true,
                            invalidate: true // crucial for CDN cache clearing
                        },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    );
                    uploadStream.end(Buffer.from(jsonString));
                });
                
                return true;
            } catch (error) {
                console.error(`[Storage] Failed to save to Cloudinary: ${error}`);
                return false;
            }
        }

        // Local Filesystem
        try {
            const filePath = path.join(DATA_DIR, filename);
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
            return true;
        } catch (error) {
             console.error(`[Storage] Failed to save local file: ${error}`);
             return false;
        }
    }
}
