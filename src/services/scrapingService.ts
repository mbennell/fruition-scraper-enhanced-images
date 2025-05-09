
import { Product } from "@/types/product";

// Generate a unique ID for products
const generateId = () => `product_${Math.random().toString(36).substr(2, 9)}`;

// Convert products array to CSV format
export const convertToCSV = (products: Product[]): string => {
  if (products.length === 0) return '';
  
  const headers = ['ID', 'Name', 'Description', 'Price', 'Image URL'];
  const rows = products.map(product => [
    product.id || '',
    product.name || '',
    product.description || '',
    product.price || '',
    product.imageUrl || ''
  ]);
  
  return [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\n');
};

// Download CSV file
export const downloadCSV = (csv: string, filename = 'products.csv') => {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Scrape products from a URL
export const scrapeProducts = async (url: string): Promise<Product[]> => {
  try {
    console.log(`Starting scraping process for: ${url}`);
    
    const response = await fetch('/api/scrape', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error("Scraping failed:", data);
      throw new Error(data.message || 'Failed to scrape products');
    }
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to scrape products');
    }
    
    // Map the response data to our Product type
    return data.products.map((item: any) => ({
      id: generateId(),
      name: item.Title,
      description: item.Description,
      price: item.Price,
      imageUrl: item['Hosted Image URLs'],
      url: item['Product URL']
    }));
  } catch (error) {
    // Log the error and re-throw it
    console.error("Error during scraping:", error);
    throw error;
  }
};
