
// api/scrape.js
import { chromium } from 'playwright';
import { createObjectCsvWriter } from 'csv-writer';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  const { url, category = '', tags = '' } = req.body;
  if (!url) return res.status(400).json({ message: 'URL is required' });

  console.log(`Scraping started for: ${url}`);
  
  try {
    // Launch Chromium with reduced memory usage
    const browser = await chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--no-zygote',
        '--single-process',
        '--disable-background-networking',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--disable-client-side-phishing-detection',
        '--disable-component-update',
        '--disable-sync',
        '--metrics-recording-only',
        '--mute-audio',
        '--no-default-browser-check',
        '--no-first-run',
        '--disable-default-apps',
        '--disable-popup-blocking',
        '--disable-extensions'
      ]
    });
    
    console.log('Browser launched successfully');
    const page = await browser.newPage();
    
    // Enable console logging for debugging
    page.on('console', msg => console.log('PAGE CONSOLE:', msg.text()));
    
    console.log(`Navigating to: ${url}`);
    // Use domcontentloaded instead of networkidle to save resources
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    console.log('Page loaded, waiting for product elements');
    
    // Take an initial screenshot for debugging
    const screenshot = await page.screenshot({ type: 'jpeg', quality: 50 }); // Reduced quality
    console.log('Screenshot taken');

    // 2. More efficient product selector for different Shopify themes
    const productSelectors = [
      '.product-card',
      '.grid__item',
      '.productCard',
      '.product-item',
      '.collection-product',
      '.product',
      '.ProductItem',
      '[data-product-id]'
    ];
    
    let products = [];
    
    // Try each selector until we find products
    for (const selector of productSelectors) {
      console.log(`Trying selector: ${selector}`);
      
      // Check if selector exists on page
      const hasSelector = await page.$(selector);
      if (!hasSelector) continue;
      
      // Use evaluateHandle for more memory efficiency
      products = await page.$$eval(selector, items => {
        return items.slice(0, 50).map(item => { // Limit to 50 products max to save memory
          // Try different possible selectors for product elements
          const title = item.querySelector('.product-card__title, .product-item__title, .product-title, .title, h2, h3')?.textContent.trim() || 'Unknown Product';
          const description = item.querySelector('.product-card__description, .product-item__description, .description, p:not(.product-card__price)')?.textContent.trim() || '';
          
          // Get image URL (try multiple possible selectors)
          let imageUrl = '';
          const img = item.querySelector('img');
          if (img) {
            imageUrl = img.dataset.src || img.getAttribute('data-srcset') || img.srcset || img.src || '';
          }
          
          // Get product URL
          let productUrl = '';
          const link = item.querySelector('a');
          if (link) productUrl = link.href;
          
          // Get price (try multiple possible selectors)
          const priceElement = item.querySelector('.product-card__price, .price, .product-item__price, [class*="price"]');
          const price = priceElement ? priceElement.textContent.trim().replace(/\s+/g, ' ') : '';
          
          return {
            Title: title,
            Description: description && description.length > 300 ? description.substring(0, 300) + '...' : description, // Truncate long descriptions
            'Hosted Image URLs': imageUrl,
            'Product URL': productUrl,
            Price: price
          };
        });
      });
      
      console.log(`Found ${products.length} products with selector: ${selector}`);
      
      if (products.length > 0) break;
    }

    await browser.close();
    console.log('Browser closed');

    if (products.length === 0) {
      console.log('No products found, returning error');
      return res.status(404).json({ 
        success: false, 
        message: 'No products found on the page. Try a different URL or contact support.',
        screenshot: `data:image/jpeg;base64,${Buffer.from(screenshot).toString('base64')}`
      });
    }

    // Skip CSV writer creation to save memory, just return the products
    res.status(200).json({
      success: true,
      products: products
    });

  } catch (error) {
    console.error('Scraping error:', error);
    
    // Provide detailed error information to help with debugging
    const errorDetails = {
      message: error.message,
      name: error.name,
      stack: error.stack ? error.stack.split('\n').slice(0, 3).join('\n') : '', // Limit stack trace size
      type: 'Playwright error'
    };
    
    res.status(500).json({ 
      success: false, 
      message: 'Server-side scraping failed. Please check if you entered a valid URL and try again.',
      error: errorDetails
    });
  }
}
