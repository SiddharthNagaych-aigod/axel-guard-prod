const fs = require('fs');
const path = require('path');

const MAP_FILE = path.join(__dirname, 'src', 'data', 'asset-map.json');
const CONTENT_FILE = path.join(__dirname, 'src', 'data', 'content.json');

function main() {
  if (!fs.existsSync(MAP_FILE)) {
    console.error("Asset map not found!");
    process.exit(1);
  }

  const assetMap = JSON.parse(fs.readFileSync(MAP_FILE, 'utf8'));
  let content = JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf8'));

  // Update Products
  content.products = content.products.map(product => {
    // Update images
    if (product.images) {
      product.images = product.images.map(img => {
         // Try to find match. Local paths in json are like "assets/img/AXG01/..."
         // Our map keys are like "/assets/img/AXG01/..." or similar depending on how upload-assets.js saved them.
         // Let's normalize to find key.
         // Current upload script saves key as: `/assets/${relativePath}`. 
         // Relative path from `public/assets`.
         // Json has `assets/img/...`.
         // So key should be `/${jsonPath}` basically?
         const key = img.startsWith('/') ? img : `/${img}`;
         if (assetMap[key]) return assetMap[key];
         // Try checking if json path is relative to assets/img
         // The upload script scanned `public/assets`.
         // If json says "assets/img/foo.png", that is inside `public/`.
         // The upload script key `relativePath` is from `public/assets`.
         // So if file is `public/assets/img/foo.png`, relative is `img/foo.png`.
         // Key is `/assets/img/foo.png`.
         // So yes, `/${img}` should work if img starts with `assets/`.
         return img;
      });
    }
    // Update pdf_manual
    if (product.pdf_manual) {
      const key = product.pdf_manual.startsWith('/') ? product.pdf_manual : `/${product.pdf_manual}`;
      if (assetMap[key]) product.pdf_manual = assetMap[key];
    }
    return product;
  });

  // Update Clients
  // Clients are just names in the array: ["zomato", "amazon", ...]
  // We need to map them to available client images in map.
  // We look for any keys in assetMap that match `clients/NAME.*` or `clients/NAME-.*`
  // Actually, we should just look at the `clients` folder in assetMap.
  const clientUrls = [];
  Object.keys(assetMap).forEach(key => {
     if (key.includes('/clients/')) {
        clientUrls.push(assetMap[key]);
     }
  });
  // Sort them to determine order? Or just use them.
  // The original json just had list of names. We'll replace it with the full URL list.
  if (clientUrls.length > 0) {
      content.clients = clientUrls;
  }

  // Save updated content
  fs.writeFileSync(CONTENT_FILE, JSON.stringify(content, null, 2));
  console.log("Updated content.json with Cloudinary URLs.");

  // Output mapped URLs for Hero and Hero for manual update or auto update
  console.log("\n--- Updating Components ---");
  
  const videoKey = '/assets/2435376-uhd_3840_2160_30fps.mp4';
  const logoKey = '/assets/img/logo/logo-new.png'; // Make sure this matches key format

  const HERO_FILE = path.join(__dirname, 'src', 'components', 'layout', 'Hero.tsx');
  const HEADER_FILE = path.join(__dirname, 'src', 'components', 'layout', 'Header.tsx');

  if (assetMap[videoKey]) {
      let heroContent = fs.readFileSync(HERO_FILE, 'utf8');
      // Replace video source. Look for src="/assets/..."
      // Current src: src="/assets/2435376-uhd_3840_2160_30fps.mp4"
      const newVideoUrl = assetMap[videoKey];
      // Regex to find src="/assets/..." or strictly the specific file
      heroContent = heroContent.replace(
          /src="\/assets\/2435376-uhd_3840_2160_30fps\.mp4"/g, 
          `src="${newVideoUrl}"`
      );
      fs.writeFileSync(HERO_FILE, heroContent);
      console.log(`Updated Hero.tsx with video: ${newVideoUrl}`);
  } else {
      console.log(`Video URL not found in map for key: ${videoKey}. Keys available: ${Object.keys(assetMap).find(k => k.includes('30fps'))}`);
  }

  if (assetMap[logoKey]) {
      let headerContent = fs.readFileSync(HEADER_FILE, 'utf8');
      const newLogoUrl = assetMap[logoKey];
      headerContent = headerContent.replace(
          /src="\/assets\/img\/logo\/logo-new\.png"/g, 
          `src="${newLogoUrl}"`
      );
      fs.writeFileSync(HEADER_FILE, headerContent);
      console.log(`Updated Header.tsx with logo: ${newLogoUrl}`);
  } else {
      console.log(`Logo URL not found in map for key: ${logoKey}. Keys available: ${Object.keys(assetMap).find(k => k.includes('logo-new'))}`);
  }
}

main();
