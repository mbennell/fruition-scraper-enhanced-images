
import { Product, SquareSpaceProduct } from "@/types/product";

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

// Convert products to SquareSpace CSV format
export const convertToSquareSpaceCSV = (products: Product[]): string => {
  if (products.length === 0) return '';
  
  const headers = [
    'Product ID [Non Editable]',
    'Variant ID [Non Editable]',
    'Product Type [Non Editable]',
    'Product Page',
    'Product URL',
    'Title',
    'Description',
    'SKU',
    'Option Name 1',
    'Option Value 1',
    'Option Name 2',
    'Option Value 2',
    'Option Name 3',
    'Option Value 3',
    'Option Name 4',
    'Option Value 4',
    'Option Name 5',
    'Option Value 5',
    'Option Name 6',
    'Option Value 6',
    'Price',
    'Sale Price',
    'On Sale',
    'Stock',
    'Categories',
    'Tags',
    'Weight',
    'Length',
    'Width',
    'Height',
    'Visible',
    'Hosted Image URLs'
  ];
  
  const rows = products.map(product => {
    const squareSpaceProduct: SquareSpaceProduct = {
      productId: '',
      variantId: '',
      productType: 'PHYSICAL',
      productPage: 'shop',
      productUrl: product.sourceUrl || '',
      title: product.name || '',
      description: product.description || '',
      sku: product.sku || '',
      optionName1: '',
      optionValue1: '',
      optionName2: '',
      optionValue2: '',
      optionName3: '',
      optionValue3: '',
      optionName4: '',
      optionValue4: '',
      optionName5: '',
      optionValue5: '',
      optionName6: '',
      optionValue6: '',
      price: product.price || '',
      salePrice: '',
      onSale: 'No',
      stock: 'Unlimited',
      categories: product.category || '',
      tags: '',
      weight: '0',
      length: '0',
      width: '0',
      height: '0',
      visible: 'Yes',
      hostedImageUrls: product.highResImageUrl || product.imageUrl || ''
    };
    
    return [
      squareSpaceProduct.productId,
      squareSpaceProduct.variantId,
      squareSpaceProduct.productType,
      squareSpaceProduct.productPage,
      squareSpaceProduct.productUrl,
      squareSpaceProduct.title,
      squareSpaceProduct.description,
      squareSpaceProduct.sku,
      squareSpaceProduct.optionName1,
      squareSpaceProduct.optionValue1,
      squareSpaceProduct.optionName2,
      squareSpaceProduct.optionValue2,
      squareSpaceProduct.optionName3,
      squareSpaceProduct.optionValue3,
      squareSpaceProduct.optionName4,
      squareSpaceProduct.optionValue4,
      squareSpaceProduct.optionName5,
      squareSpaceProduct.optionValue5,
      squareSpaceProduct.optionName6,
      squareSpaceProduct.optionValue6,
      squareSpaceProduct.price,
      squareSpaceProduct.salePrice,
      squareSpaceProduct.onSale,
      squareSpaceProduct.stock,
      squareSpaceProduct.categories,
      squareSpaceProduct.tags,
      squareSpaceProduct.weight,
      squareSpaceProduct.length,
      squareSpaceProduct.width,
      squareSpaceProduct.height,
      squareSpaceProduct.visible,
      squareSpaceProduct.hostedImageUrls
    ];
  });
  
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

// Download SquareSpace CSV file
export const downloadSquareSpaceCSV = (products: Product[], filename = 'squarespace-products.csv') => {
  const csv = convertToSquareSpaceCSV(products);
  downloadCSV(csv, filename);
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
