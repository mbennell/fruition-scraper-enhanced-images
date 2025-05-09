
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
    // Launch Puppeteer with appropriate options for serverless environments
    const browser = await puppeteerCore.launch({
      args: [...chromium.args, '--no-sandbox', '--disable-setuid-sandbox', '--hide-scrollbars', '--disable-web-security'],
      defaultViewport: chromium.defaultViewport,
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || (await chromium.executablePath()),
      headless: true,
      ignoreHTTPSErrors: true,
    });
    
    const page = await browser.newPage();
    
    // Set a reasonable viewport
    await page.setViewport({ width: 1280, height: 800 });
    
    // Set user agent to avoid detection
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
    );
    
    // Navigate to the URL with a timeout
    await page.goto(url, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    // Wait for product elements to be visible
    await page.waitForSelector('.product-item, .ProductItem, [class*="product-card"], .product-grid', { 
      timeout: 10000 
    }).catch(() => console.log('Could not find product elements, will try to scrape anyway'));
    
    // Extract products using Puppeteer's evaluate
    const products = await page.evaluate(() => {
      // Helper function to extract text safely
      const extractText = (element) => element ? element.textContent.trim() : '';
      
      // Different selectors for different e-commerce platforms
      const productSelectors = [
        '.product-item, .ProductItem', // Shopify & SquareSpace
        '.product-card, .product', // WooCommerce & Other
        'article[data-product-id], div[data-product-id]', // Generic product IDs
        '.product-grid__item' // Additional R+Co specific selector
      ];
      
      let productElements = [];
      
      // Try different selectors
      for (const selector of productSelectors) {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
          productElements = Array.from(elements);
          break;
        }
      }
      
      // If we still don't have products, try looking in product grids
      if (productElements.length === 0) {
        const grids = document.querySelectorAll('.product-grid, .products, .collection-products, .collection__products');
        if (grids.length > 0) {
          for (const grid of grids) {
            const items = grid.querySelectorAll('li, .grid__item, .grid-item, > div');
            if (items.length > 0) {
              productElements = Array.from(items);
              break;
            }
          }
        }
      }
      
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
    
    // Take a screenshot for debugging purposes
    const screenshot = await page.screenshot({
      type: "jpeg",
      quality: 80,
      fullPage: false,
    });
    
    await browser.close();
    
    console.log(`Server-side scraping completed. Found ${products.length} products.`);
    
    // Check if we found any products
    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found on the page",
        screenshot: `data:image/jpeg;base64,${screenshot.toString("base64")}`,
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
      fallback: true
    });
  }
}
