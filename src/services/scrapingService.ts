
import { Product } from "@/types/product";

// This is a simulated scraper service since we can't do actual browser scraping in this environment
export const scrapeProducts = async (url?: string): Promise<Product[]> => {
  // In a real implementation, this would use a headless browser like Puppeteer 
  // or a server-side API to perform the actual scraping
  
  // Simulating network delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Extract product type from URL for simulation purposes
  const productType = url?.includes('Conditioner') ? 'Conditioner' : 'Shampoo';
  
  // Mocked product data as an example of what would be scraped
  const mockProducts: Product[] = [
    {
      id: "1",
      name: `DALLAS Biotin Thickening ${productType}`,
      price: "$32.00",
      description: `A thickening ${productType.toLowerCase()} with biotin that adds volume to fine, flat hair.`,
      sourceUrl: url || "https://www.randco.com/collections/all?pf_pt_type=Shampoo",
      imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80"
    },
    {
      id: "2",
      name: `TELEVISION Perfect Hair ${productType}`,
      price: "$36.00",
      description: `A body-building ${productType.toLowerCase()} that creates incredible volume and thickness.`,
      sourceUrl: url || "https://www.randco.com/collections/all?pf_pt_type=Shampoo",
      imageUrl: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800&q=80"
    },
    {
      id: "3",
      name: `ATLANTIS Moisturizing ${productType}`,
      price: "$32.00",
      description: `A moisturizing ${productType.toLowerCase()} that tames frizz and adds shine.`,
      sourceUrl: url || "https://www.randco.com/collections/all?pf_pt_type=Shampoo",
      imageUrl: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80"
    },
    {
      id: "4",
      name: `BLEU Molecule Moisture ${productType}`,
      price: "$38.00",
      description: `A moisture ${productType.toLowerCase()} for extreme hydration.`,
      sourceUrl: url || "https://www.randco.com/collections/all?pf_pt_type=Shampoo",
      imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80"
    },
    {
      id: "5", 
      name: `GEM WAVES Curl ${productType}`,
      price: "$32.00",
      description: `A curl-defining ${productType.toLowerCase()} for all curl types that adds moisture and fights frizz.`,
      sourceUrl: url || "https://www.randco.com/collections/all?pf_pt_type=Shampoo",
      imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80"
    },
    {
      id: "6",
      name: `GEMSTONE Color ${productType}`,
      price: "$34.00",
      description: `A color-protecting, sulfate-free ${productType.toLowerCase()} that extends the life of your color.`,
      sourceUrl: url || "https://www.randco.com/collections/all?pf_pt_type=Shampoo",
      imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80"
    },
    {
      id: "7",
      name: `CASSETTE Curl ${productType}`,
      price: "$29.00",
      description: `A cleanser that enhances your natural curls, adds moisture and shine.`,
      sourceUrl: url || "https://www.randco.com/collections/all?pf_pt_type=Shampoo",
      imageUrl: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&q=80"
    },
    {
      id: "8",
      name: `SUNSET BLVD Blonde ${productType}`,
      price: "$33.00",
      description: `A brightening ${productType.toLowerCase()} for blondes that reduces brassiness.`,
      sourceUrl: url || "https://www.randco.com/collections/all?pf_pt_type=Shampoo",
      imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&q=80"
    },
    {
      id: "9",
      name: `OBLIVION Clarifying ${productType}`,
      price: "$27.00",
      description: `A purifying ${productType.toLowerCase()} that removes product buildup and excess oil.`,
      sourceUrl: url || "https://www.randco.com/collections/all?pf_pt_type=Shampoo",
      imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80"
    },
    {
      id: "10",
      name: `ANALOG Cleansing Foam ${productType}`,
      price: "$32.00",
      description: `A unique foaming ${productType.toLowerCase()} that cleanses and conditions in one step.`,
      sourceUrl: url || "https://www.randco.com/collections/all?pf_pt_type=Shampoo",
      imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80"
    }
  ];
  
  return mockProducts;
};

export const convertToCSV = (products: Product[]): string => {
  // Add header row
  const header = ["Product Name", "Price", "Description", "Source URL", "Image URL"];
  
  // Create rows for each product
  const rows = products.map(product => [
    `"${product.name.replace(/"/g, '""')}"`,
    `"${product.price.replace(/"/g, '""')}"`,
    `"${product.description.replace(/"/g, '""')}"`,
    `"${product.sourceUrl?.replace(/"/g, '""') || ""}"`,
    `"${product.imageUrl?.replace(/"/g, '""') || ""}"`
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
