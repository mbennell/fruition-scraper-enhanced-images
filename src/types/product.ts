
export interface Product {
  id?: string;
  name: string;
  price: string;
  description: string;
  sourceUrl?: string;
  imageUrl?: string; // Keeping this optional for data structure compatibility
  category?: string;
}

export interface ScrapingLog {
  url: string;
  timestamp: Date;
  productCount: number;
}
