const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const BLOG_POSTS_PATH = path.join(__dirname, '../src/data/blog-posts.json');
const CONTENT_PATH = path.join(__dirname, '../src/data/content.json');

const CATEGORY_MAP = {
  'Mobile DVR': 'mdvr',
  'Dashcam': 'dashcam',
  'Camera': 'camera',
  'RFID': 'rfid',
  'Accessories': 'accessories',
  // Add lowercase/variations
  'mobile dvr': 'mdvr',
  'dash cam': 'dashcam',
  'mdvr': 'mdvr'
};

function updateLinks() {
  const posts = JSON.parse(fs.readFileSync(BLOG_POSTS_PATH, 'utf8'));
  const content = JSON.parse(fs.readFileSync(CONTENT_PATH, 'utf8'));
  
  // Build Product Mappings for specific product names found in text
  const productMappings = [];
  content.products.forEach(product => {
    productMappings.push({ keyword: product.product_name.toLowerCase(), url: `/products/${product.product_code}` });
  });
  
  // Specific keywords to map to specific items if found in text
  const specificKeywords = [
    { keyword: '4g mdvr', url: '/products/AXG04' },
    { keyword: '5ch mdvr', url: '/products/AXG46' },
  ];

  let updatedCount = 0;

  posts.forEach(post => {
    let blogContent = post.content;
    
    const newContent = blogContent.replace(/<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1[^>]*?>(.*?)<\/a>/gi, (match, quote, href, text) => {
      // 1. IGNORE EXTERNAL LINKS (unless it's our own old domain)
      const isOldDomain = href.includes('axel-guard.com');
      const isRelative = !href.startsWith('http') && !href.startsWith('//') && !href.startsWith('mailto:') && !href.startsWith('tel:');
      
      if (!isOldDomain && !isRelative) {
        return match; // Keep IndiaMart, Facebook, etc. exactly as is
      }

      // 2. PARSE LINKS
      let urlObj;
      try {
        // Construct a dummy base for parsing relative URLs
        urlObj = new URL(href, 'https://axel-guard.com');
      } catch (e) {
        return match; // If parse fails, leave it
      }

      // 3. HANDLE SPECIFIC OLD PATTERNS
      // Case A: product.html?product_type=...
      if (urlObj.pathname.includes('product.html') || urlObj.pathname.includes('service-details.html')) {
        const pType = urlObj.searchParams.get('product_type');
        if (pType && CATEGORY_MAP[pType]) {
          return `<a href="/products?category=${CATEGORY_MAP[pType]}">${text}</a>`;
        } else if (pType) {
          // If we have a product type but no map, try to slugify it or default
          return `<a href="/products?category=${pType.toLowerCase().replace(/\s+/g, '-')}">${text}</a>`;
        }
      }

      // Case B: General internal link (e.g. contact.html, index.html)
      if (urlObj.pathname.includes('contact')) return `<a href="/contact">${text}</a>`;
      if (urlObj.pathname.includes('about')) return `<a href="/about">${text}</a>`;
      
      // Case C: Contextual mapping based on Link Text (ONLY for these broken internal links)
      // If the link was pointing to a specific product HTML page that doesn't exist anymore
      const lowerText = text.toLowerCase();
      
      // Try specific product keywords
      for (const m of specificKeywords) {
        if (lowerText.includes(m.keyword)) return `<a href="${m.url}">${text}</a>`;
      }
      
      // Try matched product names from content.json
      for (const m of productMappings) {
        if (lowerText.includes(m.keyword)) return `<a href="${m.url}">${text}</a>`;
      }

      // Try category keywords
      if (lowerText.includes('dash')) return `<a href="/products?category=dashcam">${text}</a>`;
      if (lowerText.includes('mdvr') || lowerText.includes('dvr')) return `<a href="/products?category=mdvr">${text}</a>`;
      if (lowerText.includes('camera')) return `<a href="/products?category=camera">${text}</a>`;
      
      // Fallback for unknown internal links -> Products page
      return `<a href="/products">${text}</a>`;
    });

    if (newContent !== blogContent) {
      post.content = newContent;
      updatedCount++;
    }
  });

  fs.writeFileSync(BLOG_POSTS_PATH, JSON.stringify(posts, null, 2));
  console.log(`Updated links in ${updatedCount} blog posts. Preserved external links.`);
}

updateLinks();
