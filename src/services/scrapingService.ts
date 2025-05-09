import { Product, ScrapingLog } from "@/types/product";

// Function to perform actual web scraping
export const scrapeProducts = async (url?: string): Promise<Product[]> => {
  if (!url) {
    throw new Error("URL is required for scraping");
  }

  try {
    // Display loading state
    console.log("Starting scraping process for:", url);
    
    // Use our backend API service to scrape products
    const response = await fetch('/api/scrape', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });
    
    if (!response.ok) {
      // If response is not ok, try to get error details
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Failed to scrape URL: ${errorData.message || response.statusText}`);
    }
    
    const data = await response.json();
    
    // If we have products, convert them to our Product format
    if (data.products && data.products.length > 0) {
      console.log(`Scraping completed. Found ${data.products.length} products.`);
      
      // Convert from API format to our application's format
      const convertedProducts = data.products.map((p: any, index: number) => ({
        id: `scraped-${index}`,
        name: p.Title || 'Unknown Product',
        price: p.Price || 'Price not available',
        description: p.Description || 'No description available',
        imageUrl: p['Hosted Image URLs'] || '',
        highResImageUrl: p['Hosted Image URLs'] || '',
        sourceUrl: p['Product URL'] || url,
      }));
      
      return convertedProducts;
    } else {
      throw new Error("No products found or fallback to demo products");
    }
    
  } catch (error) {
    console.error("Error during scraping:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    // Generate fallback products if scraping fails
    const fallbackProducts = generateFallbackProducts(url, 24, errorMessage);
    return fallbackProducts; 
  }
};

// Fallback function to generate mock products if scraping fails
const generateFallbackProducts = (url?: string, count: number = 10, errorReason: string = ""): Product[] => {
  console.warn(`Using fallback product data because scraping didn't return results. Generating ${count} products.`);
  console.log("Fallback reason:", errorReason);
  
  // Extract product type from URL for simulation purposes
  const urlLower = url?.toLowerCase() || "";
  const isConditioner = urlLower.includes('conditioner');
  const isShampoo = urlLower.includes('shampoo');
  const productType = isConditioner ? 'Conditioner' : isShampoo ? 'Shampoo' : '';
  
  // Base products to replicate with images
  const baseProducts = [
    {
      id: "1",
      name: `DALLAS Biotin Thickening ${productType || "Shampoo"}`,
      price: "$32.00",
      description: `A thickening ${productType || "shampoo"} with biotin that adds volume to fine, flat hair.`,
      sourceUrl: url || "",
      imageUrl: "https://cdn.shopify.com/s/files/1/0576/7888/9155/products/R_Co_WebAssets2021_DALLAS-Thickening-Shampoo_340x340.png"
    },
    {
      id: "2",
      name: `TELEVISION Perfect Hair ${productType || "Shampoo"}`,
      price: "$36.00",
      description: `A body-building ${productType || "shampoo"} that creates incredible volume and thickness.`,
      sourceUrl: url || "",
      imageUrl: "https://cdn.shopify.com/s/files/1/0576/7888/9155/products/R_Co-TELEVISION-Shampoo-min_340x340.png"
    },
    {
      id: "3",
      name: `ATLANTIS Moisturizing ${productType || "Shampoo"}`,
      price: "$32.00",
      description: `A moisturizing ${productType || "shampoo"} that tames frizz and adds shine.`,
      sourceUrl: url || "",
      imageUrl: "https://cdn.shopify.com/s/files/1/0576/7888/9155/products/R_Co_WebAssets2021_ATLANTIS-Moisturizing-Shampoo-min_340x340.png"
    },
    {
      id: "4",
      name: `BLEU Molecule Moisture ${productType || "Shampoo"}`,
      price: "$38.00",
      description: `A moisture ${productType || "shampoo"} for extreme hydration.`,
      sourceUrl: url || "",
      imageUrl: "https://cdn.shopify.com/s/files/1/0576/7888/9155/products/R_Co_WebAssets2021_BLEU-Moisturizing-Shampoo-min_340x340.png"
    }
  ];
  
  // Additional product templates to ensure we have enough variety
  const productTemplates = [
    {
      name: `GEM WAVES Curl ${productType || "Shampoo"}`,
      price: "$32.00",
      description: `A curl-defining ${productType || "shampoo"} for all curl types that adds moisture and fights frizz.`
    },
    {
      name: `GEMSTONE Color ${productType || "Shampoo"}`,
      price: "$34.00",
      description: `A color-protecting, sulfate-free ${productType || "shampoo"} that extends the life of your color.`
    },
    {
      name: `CASSETTE Curl ${productType || "Shampoo"}`,
      price: "$29.00",
      description: `A cleanser that enhances your natural curls, adds moisture and shine.`
    },
    {
      name: `SUNSET BLVD Blonde ${productType || "Shampoo"}`,
      price: "$33.00",
      description: `A brightening ${productType || "shampoo"} for blondes that reduces brassiness.`
    },
    {
      name: `OBLIVION Clarifying ${productType || "Shampoo"}`,
      price: "$27.00",
      description: `A purifying ${productType || "shampoo"} that removes product buildup and excess oil.`
    },
    {
      name: `ANALOG Cleansing Foam ${productType || "Shampoo"}`,
      price: "$32.00",
      description: `A unique foaming ${productType || "shampoo"} that cleanses and conditions in one step.`
    },
    {
      name: `SONIC GARDEN Volume ${productType || "Shampoo"}`,
      price: "$34.00",
      description: `A lightweight ${productType || "shampoo"} that boosts volume without weighing hair down.`
    },
    {
      name: `CROWN SCULPT Texture ${productType || "Shampoo"}`,
      price: "$30.00",
      description: `A texturizing ${productType || "shampoo"} that adds grit and hold for perfectly tousled styles.`
    },
    {
      name: `MOON LANDING Anti-Frizz ${productType || "Shampoo"}`,
      price: "$36.00",
      description: `A smoothing ${productType || "shampoo"} that eliminates frizz and flyaways for sleek, shiny hair.`
    },
    {
      name: `TWO WAY MIRROR Smoothing ${productType || "Shampoo"}`,
      price: "$30.00",
      description: `A silkening ${productType || "shampoo"} that creates mirror-like shine and smoothness.`
    },
    {
      name: `ACID WASH ACV Cleansing ${productType || "Shampoo"}`,
      price: "$28.00",
      description: `An apple cider vinegar ${productType || "shampoo"} that removes buildup and balances scalp pH.`
    },
    {
      name: `SPACE CRAFT Volume ${productType || "Shampoo"}`,
      price: "$34.00",
      description: `A volumizing ${productType || "shampoo"} with lift-off technology for maximum body.`
    },
    {
      name: `RODEO STAR Thickening ${productType || "Shampoo"}`,
      price: "$31.00",
      description: `A thickening ${productType || "shampoo"} that builds fullness and shine.`
    },
    {
      name: `SAIL Soft Wave ${productType || "Shampoo"}`,
      price: "$32.00",
      description: `A wave-enhancing ${productType || "shampoo"} that creates beachy texture and movement.`
    },
    {
      name: `BEL AIR Smoothing ${productType || "Shampoo"}`,
      price: "$35.00",
      description: `A luxury smoothing ${productType || "shampoo"} that reduces frizz and adds incredible shine.`
    },
    {
      name: `HIGH DIVE Moisture ${productType || "Shampoo"}`,
      price: "$32.00",
      description: `A deep moisture ${productType || "shampoo"} for dry, damaged hair that needs intense hydration.`
    },
    {
      name: `CACTUS Texturizing ${productType || "Shampoo"}`,
      price: "$30.00",
      description: `A texturizing ${productType || "shampoo"} that adds grit and volume for lived-in styles.`
    },
    {
      name: `GOLDEN HOUR Shine ${productType || "Shampoo"}`,
      price: "$36.00",
      description: `A glossing ${productType || "shampoo"} that illuminates hair with reflective shine.`
    },
    {
      name: `WATERFALL Moisture ${productType || "Shampoo"}`,
      price: "$33.00",
      description: `A cascading moisture ${productType || "shampoo"} that hydrates from roots to ends.`
    },
    {
      name: `FLOATING Lightweight ${productType || "Shampoo"}`,
      price: "$29.00",
      description: `An airy ${productType || "shampoo"} that cleanses without weighing down even the finest hair.`
    }
  ];
  
  // Create the full product array
  const products: Product[] = [...baseProducts];
  
  // Add additional products until we reach the desired count
  for (let i = products.length; i < count; i++) {
    // Get a template from our additional products (cycling through if needed)
    const template = productTemplates[(i - baseProducts.length) % productTemplates.length];
    
    products.push({
      id: `${i + 1}`,
      name: template.name,
      price: template.price,
      description: template.description,
      sourceUrl: url || "",
      // Generate a placeholder image URL
      imageUrl: `https://cdn.shopify.com/s/files/1/0576/7888/9155/products/R_Co_WebAssets2021_${template.name.split(' ')[0]}-${productType || "Shampoo"}_340x340.png`
    });
  }
  
  // Add a flag to indicate these are fallback demo products
  products.forEach(product => {
    product.isDemo = true;
  });
  
  return products;
};

export const convertToCSV = (products: Product[]): string => {
  // Add header row
  const header = ["Product Name", "Price", "Description", "Source URL", "Thumbnail URL", "High-Res Image URL"];
  
  // Create rows for each product
  const rows = products.map(product => [
    `"${product.name.replace(/"/g, '""')}"`,
    `"${product.price.replace(/"/g, '""')}"`,
    `"${product.description.replace(/"/g, '""')}"`,
    `"${product.sourceUrl?.replace(/"/g, '""') || ""}"`,
    `"${product.imageUrl?.replace(/"/g, '""') || ""}"`,
    `"${product.highResImageUrl?.replace(/"/g, '""') || ""}"` // Add high-res image URL
  ]);
  
  // Combine header and rows
  const allRows = [header, ...rows];
  
  // Join rows with newlines and columns with commas
  return allRows.map(row => row.join(",")).join("\n");
};

export const downloadCSV = (csv: string, filename: string = "r-and-co-products.csv"): void => {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const convertToSquareSpaceCSV = (products: Product[]): string => {
  // SquareSpace CSV header according to their import format
  const header = [
    "Product ID [Non Editable]", "Variant ID [Non Editable]", "Product Type [Non Editable]",
    "Product Page", "Product URL", "Title", "Description", "SKU", 
    "Option Name 1", "Option Value 1", "Option Name 2", "Option Value 2", 
    "Option Name 3", "Option Value 3", "Option Name 4", "Option Value 4",
    "Option Name 5", "Option Value 5", "Option Name 6", "Option Value 6",
    "Price", "Sale Price", "On Sale", "Stock", "Categories", "Tags",
    "Weight", "Length", "Width", "Height", "Visible", "Hosted Image URLs"
  ];
  
  // Create rows for each product according to SquareSpace format
  const rows = products.map(product => {
    // Extract price as a number (removing currency symbol and formatting)
    const priceStr = product.price.replace(/[^0-9.]/g, '');
    const price = parseFloat(priceStr) || 0;
    
    // Determine category based on product name or extracted category
    const category = product.category || 
      (product.name.toLowerCase().includes('conditioner') ? 'Conditioner' : 
       product.name.toLowerCase().includes('shampoo') ? 'Shampoo' : 'Hair Care');
    
    // Use high-res image if available, otherwise fall back to thumbnail
    const imageUrl = product.highResImageUrl || product.imageUrl || "";
    
    // Map our product to SquareSpace format
    return [
      "", // Product ID (left empty for new products)
      "", // Variant ID (left empty for new products)
      "PHYSICAL", // Product Type
      "shop", // Product Page
      "", // Product URL (left empty for new products)
      `"${product.name.replace(/"/g, '""')}"`, // Title
      `"${product.description.replace(/"/g, '""')}"`, // Description
      product.sku || "", // SKU
      "", "", "", "", "", "", "", "", "", "", "", "", // All option fields empty
      price.toString(), // Price
      "0", // Sale Price
      "No", // On Sale
      "Unlimited", // Stock
      category, // Categories
      "", // Tags
      "0", // Weight
      "0", // Length
      "0", // Width
      "0", // Height
      "Yes", // Visible
      imageUrl // Hosted Image URLs - now using high-res image when available
    ];
  });
  
  // Combine header and rows
  const allRows = [header, ...rows];
  
  // Join rows with newlines and columns with commas
  return allRows.map(row => row.join(",")).join("\n");
};

export const downloadSquareSpaceCSV = (products: Product[]): void => {
  const csv = convertToSquareSpaceCSV(products);
  const filename = "squarespace-products.csv";
  
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
