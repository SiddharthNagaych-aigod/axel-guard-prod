const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Load environment variables from .env and .env.local
require('dotenv').config({ path: path.join(__dirname, '../.env') });
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

if (!process.env.CLOUDINARY_KEY || !process.env.CLOUDINARY_SECRET || !process.env.CLOUD_NAME) {
  console.error('Missing Cloudinary credentials. Please ensure .env contains:');
  console.error('CLOUD_NAME, CLOUDINARY_KEY, CLOUDINARY_SECRET');
  process.exit(1);
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

const BLOG_POSTS_PATH = path.join(__dirname, '../src/data/blog-posts.json');
const PUBLIC_DIR = path.join(__dirname, '../public');
const LOGO_PATH = path.join(__dirname, '../src/app/axellogo.webp');

async function uploadImage(filePath, folder) {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: `axelguard/${folder}`,
      use_filename: true,
      unique_filename: false,
      resource_type: 'image'
    });
    return result.secure_url;
  } catch (error) {
    console.error(`Error uploading ${filePath}:`, error);
    return null;
  }
}

async function main() {
  // 1. Upload Logo
  console.log('Uploading Logo...');
  if (fs.existsSync(LOGO_PATH)) {
    const logoUrl = await uploadImage(LOGO_PATH, 'logo');
    if (logoUrl) {
      console.log('LOGO_URL:', logoUrl);
    }
  } else {
    console.error('Logo file not found at:', LOGO_PATH);
  }

  // 2. Upload Blog Images
  console.log('Processing Blog Posts...');
  const blogPosts = JSON.parse(fs.readFileSync(BLOG_POSTS_PATH, 'utf8'));
  let updatedCount = 0;

  for (let i = 0; i < blogPosts.length; i++) {
    const post = blogPosts[i];
    if (post.image && post.image.startsWith('/blog-images/')) {
      const localImagePath = path.join(PUBLIC_DIR, post.image);
      if (fs.existsSync(localImagePath)) {
        console.log(`Uploading image for post: ${post.title.substring(0, 20)}...`);
        const cloudUrl = await uploadImage(localImagePath, 'blog');
        if (cloudUrl) {
          post.image = cloudUrl;
          updatedCount++;
        }
      }
    }
  }

  // 3. Save updated JSON
  fs.writeFileSync(BLOG_POSTS_PATH, JSON.stringify(blogPosts, null, 2));
  console.log(`Updated ${updatedCount} blog posts with Cloudinary URLs.`);
}

main();
