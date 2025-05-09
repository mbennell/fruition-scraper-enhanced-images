
// Server-side scraping endpoint using Puppeteer
const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium');

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
    const browser = await puppeteer.launch({
      args: [...chromium.args, '--no-sandbox', '--disable-setuid-sandbox'],
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });
    
    const page = await browser.newPage();
    
    // Set a reasonable viewport
    await page.setViewport({ width: 1280, height: 800 });
    
    // Set user agent to appear as a regular browser
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
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
        'article[data-product-id], div[data-product-id]' // Generic product IDs
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
        const nameElement = element.querySelector('h2, h3, h4, .product-name, .product-title, .title, [class*="title"], [class*="name"]');
        
        // Find price
        const priceElement = element.querySelector('.price, .product-price, [class*="price"], [data-price]');
        
        // Find description
        const descElement = element.querySelector('.description, [class*="description"], p:not(.price):not([class*="price"]):not([class*="title"]):not([class*="name"])');
        
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
        
        const name = extractText(nameElement) || `Product ${index + 1}`;
        const price = extractText(priceElement) || 'Price not available';
        const description = extractText(descElement) || 'No description available';
        
        return {
          id: `scraped-${index}`,
          name,
          price,
          description,
          imageUrl,
          highResImageUrl,
          sourceUrl: window.location.href
        };
      });
    });
    
    await browser.close();
    
    console.log(`Server-side scraping completed. Found ${products.length} products.`);
    
    // Return the scraped products
    return res.status(200).json({ 
      success: true, 
      products: products.filter(p => p.name && p.name !== 'undefined')
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
