const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  // Set a large viewport width for high quality
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });

  console.log('Navigating to homepage...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

  // Scroll to bottom to trigger all animations
  console.log('Scrolling to trigger animations...');
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100); // Scroll every 100ms
    });
  });

  // Wait for any final animations (counters etc)
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Scroll back to top if needed? Fullpage screenshot usually captures whole content.
  // Sometimes fixing the header at top might obscure things.
  // But let's just take the shot.

  console.log('Taking screenshot...');
  const outputPath = path.resolve(__dirname, 'public/assets/homepage-full.png');
  
  await page.screenshot({ 
    path: outputPath, 
    fullPage: true 
  });

  console.log(`Screenshot saved to ${outputPath}`);
  await browser.close();
})();
