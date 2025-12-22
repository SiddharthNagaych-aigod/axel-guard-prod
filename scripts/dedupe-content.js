
const fs = require('fs');
const path = require('path');

const contentPath = path.join(process.cwd(), 'src/data/content.json');
const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));

console.log(`Initial product count: ${content.products.length}`);

const seen = new Set();
const uniqueProducts = [];
let duplicatesFound = 0;

// Iterate in reverse to keep the LATEST version if duplicates exist (assuming append behavior)
// Actually, usually simpler to keep the first one if we assume order is preserved? 
// But if "appearing in both" means we added a new one without removing old, the LAST one is likely the edited one.
// Let's iterate backwards.
for (let i = content.products.length - 1; i >= 0; i--) {
    const product = content.products[i];
    if (!seen.has(product.product_code)) {
        seen.add(product.product_code);
        uniqueProducts.unshift(product);
    } else {
        duplicatesFound++;
        console.log(`Removing duplicate: ${product.product_code} (${product.product_name})`);
    }
}

content.products = uniqueProducts;

if (duplicatesFound > 0) {
    fs.writeFileSync(contentPath, JSON.stringify(content, null, 2));
    console.log(`Refined product count: ${content.products.length}`);
    console.log(`Removed ${duplicatesFound} duplicates.`);
} else {
    console.log("No duplicates found.");
}
