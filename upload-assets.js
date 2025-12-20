require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
  secure: true
});

const ASSETS_DIR = path.join(__dirname, 'public', 'assets');
const OUTPUT_MAP_FILE = path.join(__dirname, 'src', 'data', 'asset-map.json');
const ASSET_MAP = {};

async function uploadFile(filePath, relativePath) {
  try {
    const fileType = relativePath.endsWith('.mp4') ? 'video' : 'image';
    const publicId = `axelguard/${relativePath.replace(/\.[^/.]+$/, "")}`; // Remove extension for public_id

    console.log(`Uploading ${relativePath} as ${fileType}...`);
    
    const result = await cloudinary.uploader.upload(filePath, {
      public_id: publicId,
      resource_type: fileType,
      overwrite: true
    });

    console.log(`Uploaded: ${result.secure_url}`);
    return result.secure_url;
  } catch (error) {
    console.error(`Error uploading ${relativePath}:`, error);
    return null;
  }
}

async function scanAndUpload(dir, baseDir = '') {
  const files = await readdir(dir);

  for (const file of files) {
    if (file.startsWith('.')) continue; // Skip hidden files

    const filePath = path.join(dir, file);
    const fileStat = await stat(filePath);
    const relativePath = path.join(baseDir, file);

    if (fileStat.isDirectory()) {
      await scanAndUpload(filePath, relativePath);
    } else {
      // Skip if not an asset we care about (images/video)
      if (!file.match(/\.(jpg|jpeg|png|webp|gif|svg|mp4)$/i)) continue;

      const url = await uploadFile(filePath, relativePath);
      if (url) {
        // Map local relative path (e.g. "img/logo/logo.png" or "243.mp4") to Cloudinary URL
        // We normalize to forward slashes for consistency
        const key = `/assets/${relativePath.split(path.sep).join('/')}`; 
        ASSET_MAP[key] = url;
      }
    }
  }
}

async function main() {
  console.log("Starting upload from:", ASSETS_DIR);
  
  if (!process.env.CLOUD_NAME || !process.env.CLOUDINARY_KEY || !process.env.CLOUDINARY_SECRET) {
      console.error("Missing Cloudinary env variables!");
      process.exit(1);
  }

  await scanAndUpload(ASSETS_DIR);

  console.log("Upload complete. Saving map...");
  fs.writeFileSync(OUTPUT_MAP_FILE, JSON.stringify(ASSET_MAP, null, 2));
  console.log("Asset map saved to:", OUTPUT_MAP_FILE);
}

main();
