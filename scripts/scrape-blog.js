
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('https');
const { promisify } = require('util');
const stream = require('stream');

const pipeline = promisify(stream.pipeline);

const BASE_URL = 'https://axel-guard.com/blog/';
const DATA_DIR = path.join(__dirname, '../src/data');
const IMAGES_DIR = path.join(__dirname, '../public/blog-images');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true });

async function downloadImage(url, filepath) {
    if (!url) return null;
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            if (response.statusCode === 200) {
                const fileStream = fs.createWriteStream(filepath);
                pipeline(response, fileStream)
                    .then(() => resolve(true))
                    .catch((err) => reject(err));
            } else {
                resolve(false);
                // Consume response data to free up memory
                response.resume();
            }
        }).on('error', (err) => reject(err));
    });
}

function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-');  // Replace multiple - with single -
}

async function scrape() {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    
    // Set viewport to ensure elements are visible
    await page.setViewport({ width: 1280, height: 800 });

    let currentUrl = BASE_URL;
    let allPosts = [];
    let pageNum = 1;

    console.log('Starting scrape...');

    while (currentUrl) {
        console.log(`Scraping list page: ${currentUrl}`);
        await page.goto(currentUrl, { waitUntil: 'domcontentloaded' });

        // Get post links from the current page
        const postLinks = await page.evaluate(() => {
            const links = [];
            // Try multiple selectors for robustness based on inspection
            const selectors = [
                '.bloglo-flex-row.g-4 article .entry-title a',
                'article .entry-title a',
                '.post .entry-title a'
            ];
            
            let elements = [];
            for (const selector of selectors) {
                elements = document.querySelectorAll(selector);
                if (elements.length > 0) break;
            }

            elements.forEach(el => {
                if (el.href) links.push(el.href);
            });
            return [...new Set(links)]; // Deduplicate
        });

        console.log(`Found ${postLinks.length} posts on page ${pageNum}`);

        for (const link of postLinks) {
            console.log(`  Scraping post: ${link}`);
            try {
                const postPage = await browser.newPage();
                await postPage.goto(link, { waitUntil: 'domcontentloaded' });

                const postData = await postPage.evaluate(() => {
                    const getText = (selector) => {
                        const el = document.querySelector(selector);
                        return el ? el.textContent.trim() : null;
                    };
                    const getHtml = (selector) => {
                        const el = document.querySelector(selector);
                        return el ? el.innerHTML : null;
                    };
                    const getAttr = (selector, attr) => {
                        const el = document.querySelector(selector);
                        return el ? el.getAttribute(attr) : null;
                    };

                    return {
                        title: getText('h1.entry-title') || getText('h1'),
                        date: getText('time.entry-date') || getText('.posted-on'),
                        author: getText('.author.vcard') || getText('.url.fn.n'),
                        category: getText('.cat-links') || getText('.entry-categories'),
                        content: getHtml('.entry-content'), // Get HTML to preserve formatting
                        excerpt: getText('.entry-content p'), // First paragraph as excerpt
                        imageUrl: getAttr('img.wp-post-image', 'src') || getAttr('.post-thumbnail img', 'src')
                    };
                });

                await postPage.close();

                if (postData.title) {
                    const slug = slugify(postData.title);
                    let imagePath = null;

                    if (postData.imageUrl) {
                        const ext = path.extname(postData.imageUrl).split('?')[0] || '.jpg';
                        const filename = `${slug}${ext}`;
                        const localPath = path.join(IMAGES_DIR, filename);
                        
                        console.log(`    Downloading image: ${postData.imageUrl}`);
                        await downloadImage(postData.imageUrl, localPath);
                        imagePath = `/blog-images/${filename}`;
                    }

                    // Clean up content (remove script tags etc if needed, but keeping simple for now)
                    // Also simple excerpt cleanup
                    const excerpt = postData.excerpt ? postData.excerpt.substring(0, 150) + '...' : '';

                    allPosts.push({
                        id: slug,
                        slug: slug,
                        title: postData.title,
                        date: postData.date,
                        author: postData.author,
                        category: postData.category,
                        content: postData.content,
                        excerpt: excerpt,
                        image: imagePath,
                        originalUrl: link
                    });
                }

            } catch (err) {
                console.error(`    Error scraping post ${link}:`, err.message);
            }
        }

        // Check for next page
        const nextPageUrl = await page.evaluate(() => {
            const next = document.querySelector('a.next.page-numbers') || document.querySelector('.nav-previous a');
            return next ? next.href : null;
        });

        currentUrl = nextPageUrl;
        pageNum++;
        
        // Safety break to prevent infinite loops if something goes wrong
        if (pageNum > 10) break; 
    }

    await browser.close();

    console.log(`Total posts scraped: ${allPosts.length}`);
    fs.writeFileSync(path.join(DATA_DIR, 'blog-posts.json'), JSON.stringify(allPosts, null, 2));
    console.log('Done!');
}

scrape().catch(console.error);
