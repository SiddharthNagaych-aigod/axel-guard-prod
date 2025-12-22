const fs = require('fs');
const path = require('path');

const contentPath = path.join(__dirname, '../src/data/content.json');
const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));

// Update Products
if (content.products) {
  content.products = content.products.map((p, index) => ({
    ...p,
    price: p.price || "", // Add price if missing
    order: p.order !== undefined ? p.order : index + 1, // Add order if missing
    // Ensure images is always an array
    images: Array.isArray(p.images) ? p.images : [], 
  }));
}

fs.writeFileSync(contentPath, JSON.stringify(content, null, 2));
console.log('Updated content.json with price and order fields.');
