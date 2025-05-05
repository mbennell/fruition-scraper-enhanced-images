
export interface Product {
  id?: string;
  name: string;
  price: string;
  description: string;
  sourceUrl?: string;
}

export interface ScrapingLog {
  url: string;
  timestamp: Date;
  productCount: number;
}
