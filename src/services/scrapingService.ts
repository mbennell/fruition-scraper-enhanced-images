
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
      sourceUrl: url || "https://www.randco.com/collections/all?pf_pt_type=Shampoo"
    },
    {
      id: "2",
      name: `TELEVISION Perfect Hair ${productType}`,
      price: "$36.00",
      description: `A body-building ${productType.toLowerCase()} that creates incredible volume and thickness.`,
      sourceUrl: url || "https://www.randco.com/collections/all?pf_pt_type=Shampoo"
    },
    {
      id: "3",
      name: `ATLANTIS Moisturizing ${productType}`,
      price: "$32.00",
      description: `A moisturizing ${productType.toLowerCase()} that tames frizz and adds shine.`,
      sourceUrl: url || "https://www.randco.com/collections/all?pf_pt_type=Shampoo"
    },
    {
      id: "4",
      name: `BLEU Molecule Moisture ${productType}`,
      price: "$38.00",
      description: `A moisture ${productType.toLowerCase()} for extreme hydration.`,
      sourceUrl: url || "https://www.randco.com/collections/all?pf_pt_type=Shampoo"
    },
    {
      id: "5", 
      name: `GEM WAVES Curl ${productType}`,
      price: "$32.00",
      description: `A curl-defining ${productType.toLowerCase()} for all curl types that adds moisture and fights frizz.`,
      sourceUrl: url || "https://www.randco.com/collections/all?pf_pt_type=Shampoo"
    },
    {
      id: "6",
      name: `GEMSTONE Color ${productType}`,
      price: "$34.00",
      description: `A color-protecting, sulfate-free ${productType.toLowerCase()} that extends the life of your color.`,
      sourceUrl: url || "https://www.randco.com/collections/all?pf_pt_type=Shampoo"
    },
    {
      id: "7",
      name: `CASSETTE Curl ${productType}`,
      price: "$29.00",
      description: `A cleanser that enhances your natural curls, adds moisture and shine.`,
      sourceUrl: url || "https://www.randco.com/collections/all?pf_pt_type=Shampoo"
    },
    {
      id: "8",
      name: `SUNSET BLVD Blonde ${productType}`,
      price: "$33.00",
      description: `A brightening ${productType.toLowerCase()} for blondes that reduces brassiness.`,
      sourceUrl: url || "https://www.randco.com/collections/all?pf_pt_type=Shampoo"
    },
    {
      id: "9",
      name: `OBLIVION Clarifying ${productType}`,
      price: "$27.00",
      description: `A purifying ${productType.toLowerCase()} that removes product buildup and excess oil.`,
      sourceUrl: url || "https://www.randco.com/collections/all?pf_pt_type=Shampoo"
    },
    {
      id: "10",
      name: `ANALOG Cleansing Foam ${productType}`,
      price: "$32.00",
      description: `A unique foaming ${productType.toLowerCase()} that cleanses and conditions in one step.`,
      sourceUrl: url || "https://www.randco.com/collections/all?pf_pt_type=Shampoo"
    }
  ];
  
  return mockProducts;
};

export const convertToCSV = (products: Product[]): string => {
  // Add header row
  const header = ["Product Name", "Price", "Description", "Source URL"];
  
  // Create rows for each product
  const rows = products.map(product => [
    `"${product.name.replace(/"/g, '""')}"`,
    `"${product.price.replace(/"/g, '""')}"`,
    `"${product.description.replace(/"/g, '""')}"`,
    `"${product.sourceUrl?.replace(/"/g, '""') || ""}"`
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
