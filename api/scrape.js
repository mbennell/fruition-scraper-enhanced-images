
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
    // 1. Launch headless Chromium
    const browser = await chromium.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    console.log('Browser launched successfully');
    const page = await browser.newPage();
    
    // Enable console logging for debugging
    page.on('console', msg => console.log('PAGE CONSOLE:', msg.text()));
    
    console.log(`Navigating to: ${url}`);
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    console.log('Page loaded, waiting for product elements');
    
    // Take an initial screenshot for debugging
    const screenshot = await page.screenshot({ type: 'jpeg', quality: 80 });
    console.log('Screenshot taken');

    // 2. More flexible product selector for different Shopify themes
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
      
      products = await page.$$eval(selector, items => {
        return items.map(item => {
          // Try different possible selectors for product elements
          const title = item.querySelector('.product-card__title, .product-item__title, .product-title, .title, h2, h3')?.textContent.trim() || 'Unknown Product';
          const description = item.querySelector('.product-card__description, .product-item__description, .description, p:not(.product-card__price)')?.textContent.trim() || '';
          
          // Get image URL (try multiple possible selectors)
          let imageUrl = '';
          const img = item.querySelector('img');
          if (img) {
            // Try to get high-res version first
            imageUrl = img.dataset.src || img.getAttribute('data-srcset') || img.srcset || img.src || '';
            
            // If we have srcset, get the largest image
            if (img.srcset) {
              const srcsetItems = img.srcset.split(',');
              if (srcsetItems.length > 0) {
                const lastItem = srcsetItems[srcsetItems.length - 1].trim().split(' ')[0];
                if (lastItem) imageUrl = lastItem;
              }
            }
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
            Description: description,
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
        message: 'No products found.',
        screenshot: `data:image/jpeg;base64,${Buffer.from(screenshot).toString('base64')}`
      });
    }

    // 3. Prepare CSV writer (matching Squarespace template)
    const csvPath = path.join('/tmp', 'shopify_to_squarespace.csv');
    const csvWriter = createObjectCsvWriter({
      path: csvPath,
      header: [
        { id: 'Product ID [Non Editable]', title: 'Product ID [Non Editable]' },
        { id: 'Variant ID [Non Editable]', title: 'Variant ID [Non Editable]' },
        { id: 'Product Type [Non Editable]', title: 'Product Type [Non Editable]' },
        { id: 'Product Page', title: 'Product Page' },
        { id: 'Product URL', title: 'Product URL' },
        { id: 'Title', title: 'Title' },
        { id: 'Description', title: 'Description' },
        { id: 'SKU', title: 'SKU' },
        { id: 'Option Name 1', title: 'Option Name 1' },
        { id: 'Option Value 1', title: 'Option Value 1' },
        { id: 'Option Name 2', title: 'Option Name 2' },
        { id: 'Option Value 2', title: 'Option Value 2' },
        { id: 'Option Name 3', title: 'Option Name 3' },
        { id: 'Option Value 3', title: 'Option Value 3' },
        { id: 'Option Name 4', title: 'Option Name 4' },
        { id: 'Option Value 4', title: 'Option Value 4' },
        { id: 'Option Name 5', title: 'Option Name 5' },
        { id: 'Option Value 5', title: 'Option Value 5' },
        { id: 'Option Name 6', title: 'Option Name 6' },
        { id: 'Option Value 6', title: 'Option Value 6' },
        { id: 'Price', title: 'Price' },
        { id: 'Sale Price', title: 'Sale Price' },
        { id: 'On Sale', title: 'On Sale' },
        { id: 'Stock', title: 'Stock' },
        { id: 'Categories', title: 'Categories' },
        { id: 'Tags', title: 'Tags' },
        { id: 'Weight', title: 'Weight' },
        { id: 'Length', title: 'Length' },
        { id: 'Width', title: 'Width' },
        { id: 'Height', title: 'Height' },
        { id: 'Visible', title: 'Visible' },
        { id: 'Hosted Image URLs', title: 'Hosted Image URLs' }
      ]
    });

    // 4. Map scraped data into template rows
    const records = products.map(p => ({
      'Product ID [Non Editable]': '',
      'Variant ID [Non Editable]': '',
      'Product Type [Non Editable]': 'PHYSICAL',
      'Product Page': 'shop',
      'Product URL': p['Product URL'],
      'Title': p.Title,
      'Description': p.Description,
      'SKU': '',
      'Option Name 1': '',
      'Option Value 1': '',
      'Option Name 2': '',
      'Option Value 2': '',
      'Option Name 3': '',
      'Option Value 3': '',
      'Option Name 4': '',
      'Option Value 4': '',
      'Option Name 5': '',
      'Option Value 5': '',
      'Option Name 6': '',
      'Option Value 6': '',
      'Price': p.Price,
      'Sale Price': '',
      'On Sale': 'No',
      'Stock': 'Unlimited',
      'Categories': category,
      'Tags': tags,
      'Weight': '0',
      'Length': '0',
      'Width': '0',
      'Height': '0',
      'Visible': 'Yes',
      'Hosted Image URLs': p['Hosted Image URLs']
    }));

    // 5. Write CSV
    await csvWriter.writeRecords(records);
    console.log(`CSV written to ${csvPath}`);

    // 6. Instead of download link (which won't work in serverless), return products directly
    // We'll handle the CSV conversion client-side
    res.status(200).json({
      success: true,
      products: products,
      csvData: fs.readFileSync(csvPath, 'utf8')
    });

  } catch (error) {
    console.error('Scraping error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message,
      errorDetails: {
        name: error.name,
        stack: error.stack
      }
    });
  }
}
