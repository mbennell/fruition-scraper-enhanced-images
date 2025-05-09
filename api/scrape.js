
// Server-side scraping endpoint using Puppeteer
import puppeteerCore from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

// Configure Chrome for serverless environment
chromium.setGraphicsMode = false;

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { url } = req.body;
  
  if (!url) {
    return res.status(400).json({ message: 'URL is required' });
  }
  
  console.log(`Server-side scraping started for: ${url}`);
  
  try {
    // Launch browser with optimized serverless settings
    console.log('Attempting to launch Chrome using @sparticuz/chromium');
    
    const browser = await puppeteerCore.launch({
      args: [
        ...chromium.args,
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-features=IsolateOrigins',
        '--disable-site-isolation-trials',
        '--disable-extensions',
        '--disable-component-extensions-with-background-pages',
        '--disable-default-apps',
        '--mute-audio',
        // Additional optimization flags
        '--single-process',
        '--no-zygote',
        '--disable-background-networking',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--disable-sync',
        '--metrics-recording-only',
      ],
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });
    
    console.log('Chrome launched successfully');
    
    const page = await browser.newPage();
    
    // Set a reasonable viewport
    await page.setViewport({ width: 1280, height: 800 });
    
    // Set user agent to avoid detection
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
    );
    
    // Enable detailed console logging for debugging
    page.on('console', msg => console.log('PAGE CONSOLE:', msg.text()));
    page.on('error', err => console.error('PAGE ERROR:', err));
    page.on('pageerror', err => console.error('PAGE ERROR:', err));
    
    console.log(`Navigating to: ${url}`);
    // Navigate to the URL with a timeout
    await page.goto(url, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    console.log('Page loaded, waiting for product elements');
    
    // Instead of immediately waiting for selectors, check if they exist first
    const hasProducts = await page.evaluate(() => {
      const selectors = [
        '.product-item, .ProductItem', 
        '.product-card, .product', 
        'article[data-product-id], div[data-product-id]',
        '.product-grid__item',
        // Check for common grid containers
        '.grid--view-items',
        '.collection-grid'
      ];
      
      for (const selector of selectors) {
        if (document.querySelector(selector)) {
          console.log(`Found products with selector: ${selector}`);
          return true;
        }
      }
      return false;
    });
    
    console.log(`Product detection result: ${hasProducts ? 'Products found' : 'No products detected'}`);
    
    // Only try to wait for selector if we detected products
    if (hasProducts) {
      try {
        await page.waitForSelector('.product-item, .ProductItem, [class*="product-card"], .product-grid', { 
          timeout: 5000 
        });
        console.log('Product selectors loaded successfully');
      } catch (e) {
        console.log('Timed out waiting for specific product selectors, will try to scrape anyway');
      }
    }
    
    // Take an initial screenshot
    const initialScreenshot = await page.screenshot({
      type: "jpeg",
      quality: 80,
      fullPage: false,
    });
    
    // Extract products using Puppeteer's evaluate
    console.log('Attempting to extract products');
    const products = await page.evaluate(() => {
      // Helper function to extract text safely
      const extractText = (element) => element ? element.textContent.trim() : '';
      
      // Different selectors for different e-commerce platforms
      const productSelectors = [
        '.product-item, .ProductItem', // Shopify & SquareSpace
        '.product-card, .product', // WooCommerce & Other
        'article[data-product-id], div[data-product-id]', // Generic product IDs
        '.product-grid__item', // Additional R+Co specific selector
        '.grid__item', // Common Shopify selector
        '.collection-product'
      ];
      
      let productElements = [];
      
      // Try different selectors
      for (const selector of productSelectors) {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
          console.log(`Found ${elements.length} products with selector: ${selector}`);
          productElements = Array.from(elements);
          break;
        }
      }
      
      // If we still don't have products, try looking in product grids
      if (productElements.length === 0) {
        console.log('No products found with standard selectors, trying grid containers');
        const grids = document.querySelectorAll('.product-grid, .products, .collection-products, .collection__products, .grid--view-items');
        if (grids.length > 0) {
          for (const grid of grids) {
            const items = grid.querySelectorAll('li, .grid__item, .grid-item, > div');
            if (items.length > 0) {
              console.log(`Found ${items.length} products in grid container`);
              productElements = Array.from(items);
              break;
            }
          }
        }
      }
      
      // If we still don't have products, try a more aggressive approach
      if (productElements.length === 0) {
        console.log('No products found in grids, trying generic product detection');
        // Look for elements with product-like attributes
        const possibleProducts = document.querySelectorAll('a[href*="product"], div:has(img):has(.price)');
        if (possibleProducts.length > 0) {
          productElements = Array.from(possibleProducts);
        }
      }
      
      console.log(`Total products found: ${productElements.length}`);
      
      return productElements.map((element, index) => {
        // Find product name
        const nameElement = element.querySelector('h2, h3, h4, .product-name, .product-title, .title, [class*="title"], [class*="name"], .product-item__title, .card-title');
        
        // Find price
        const priceElement = element.querySelector('.price, .product-price, [class*="price"], [data-price], .product-item__price');
        
        // Find description
        const descElement = element.querySelector('.description, [class*="description"], p:not(.price):not([class*="price"]):not([class*="title"]):not([class*="name"])');
        
        // Find link to product page
        const linkElement = element.querySelector('a');
        const productUrl = linkElement ? linkElement.href : null;
        
        // Find image
        const imgElement = element.querySelector('img');
        const img = imgElement ? imgElement.getAttribute('src') || imgElement.getAttribute('data-src') : null;
        const imageUrl = img ? new URL(img, window.location.origin).href : null;
        
        // Find high-res image if available
        let highResImageUrl = null;
        if (imgElement) {
          const srcset = imgElement.getAttribute('srcset');
          if (srcset) {
            const srcsetItems = srcset.split(',');
            const lastItem = srcsetItems[srcsetItems.length - 1].trim().split(' ')[0];
            if (lastItem) {
              highResImageUrl = new URL(lastItem, window.location.origin).href;
            }
          }
        }
        
        // Attempt to use higher resolution versions if available
        if ((imageUrl && imageUrl.includes("_small.")) || (imageUrl && imageUrl.includes("_medium."))) {
          highResImageUrl = imageUrl.replace("_small.", "_large.").replace("_medium.", "_large.");
        }
        
        const name = extractText(nameElement) || `Product ${index + 1}`;
        const price = extractText(priceElement) || 'Price not available';
        const description = extractText(descElement) || 'No description available';
        
        return {
          id: `scraped-${index}`,
          name,
          price,
          description,
          imageUrl,
          highResImageUrl: highResImageUrl || imageUrl,
          sourceUrl: productUrl || window.location.href
        };
      });
    });
    
    // Take a final screenshot for debugging purposes
    const screenshot = await page.screenshot({
      type: "jpeg",
      quality: 80,
      fullPage: false,
    });
    
    // Get page HTML for debugging
    const pageHtml = await page.content();
    const htmlPreview = pageHtml.slice(0, 1000) + '... [truncated]';
    console.log('Page HTML preview:', htmlPreview);
    
    await browser.close();
    
    console.log(`Server-side scraping completed. Found ${products.length} products.`);
    
    // Check if we found any products
    if (products.length === 0) {
      console.log('No products found, returning initial screenshot for debugging');
      return res.status(404).json({
        success: false,
        message: "No products found on the page",
        screenshot: `data:image/jpeg;base64,${initialScreenshot.toString("base64")}`,
        htmlPreview,
        fallback: true
      });
    }
    
    // Return the scraped products
    return res.status(200).json({ 
      success: true, 
      products: products.filter(p => p.name && p.name !== 'undefined'),
      screenshot: `data:image/jpeg;base64,${screenshot.toString("base64")}`
    });
    
  } catch (error) {
    console.error('Error during server-side scraping:', error);
    return res.status(500).json({ 
      success: false, 
      message: `Failed to scrape products: ${error.message}`,
      errorDetails: {
        name: error.name,
        stack: error.stack,
        isVercel: !!process.env.VERCEL
      },
      fallback: true
    });
  }
}
