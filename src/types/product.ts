
export interface Product {
  id?: string;
  name: string;
  price: string;
  description: string;
  sourceUrl?: string;
  imageUrl?: string; // Keeping this optional for data structure compatibility
  category?: string;
  sku?: string; // Added for SquareSpace compatibility
}

export interface ScrapingLog {
  url: string;
  timestamp: Date;
  productCount: number;
}

// SquareSpace specific interface for CSV export
export interface SquareSpaceProduct {
  productId: string;
  variantId: string;
  productType: string;
  productPage: string;
  productUrl: string;
  title: string;
  description: string;
  sku: string;
  optionName1: string;
  optionValue1: string;
  optionName2: string;
  optionValue2: string;
  optionName3: string;
  optionValue3: string;
  optionName4: string;
  optionValue4: string;
  optionName5: string;
  optionValue5: string;
  optionName6: string;
  optionValue6: string;
  price: string;
  salePrice: string;
  onSale: string;
  stock: string;
  categories: string;
  tags: string;
  weight: string;
  length: string;
  width: string;
  height: string;
  visible: string;
  hostedImageUrls: string;
}
