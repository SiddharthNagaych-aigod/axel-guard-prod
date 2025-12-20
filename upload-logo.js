const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

async function uploadLogo() {
  const filePath = './src/app/icon.webp';
  console.log(`Uploading ${filePath}...`);
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'axelguard/img/logo',
      use_filename: true,
      unique_filename: false,
      resource_type: 'image'
    });
    console.log(`Uploaded: ${result.secure_url}`);
  } catch (error) {
    console.error('Upload failed:', error);
  }
}

uploadLogo();
