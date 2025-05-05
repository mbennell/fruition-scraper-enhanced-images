
import { Product } from "@/types/product";

// This is a simulated scraper service since we can't do actual browser scraping in this environment
export const scrapeProducts = async (): Promise<Product[]> => {
  // In a real implementation, this would use a headless browser like Puppeteer 
  // or a server-side API to perform the actual scraping
  
  // Simulating network delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mocked product data as an example of what would be scraped
  const mockProducts: Product[] = [
    {
      id: "1",
      name: "DALLAS Biotin Thickening Shampoo",
      price: "$32.00",
      description: "A thickening shampoo with biotin that adds volume to fine, flat hair."
    },
    {
      id: "2",
      name: "TELEVISION Perfect Hair Shampoo",
      price: "$36.00",
      description: "A body-building shampoo that creates incredible volume and thickness."
    },
    {
      id: "3",
      name: "ATLANTIS Moisturizing Shampoo",
      price: "$32.00",
      description: "A moisturizing shampoo that tames frizz and adds shine."
    },
    {
      id: "4",
      name: "BLEU Molecule Moisture Shampoo",
      price: "$38.00",
      description: "A moisture shampoo for extreme hydration."
    },
    {
      id: "5", 
      name: "GEM WAVES Curl Shampoo",
      price: "$32.00",
      description: "A curl-defining shampoo for all curl types that adds moisture and fights frizz."
    },
    {
      id: "6",
      name: "GEMSTONE Color Shampoo",
      price: "$34.00",
      description: "A color-protecting, sulfate-free shampoo that extends the life of your color."
    },
    {
      id: "7",
      name: "CASSETTE Curl Shampoo",
      price: "$29.00",
      description: "A cleanser that enhances your natural curls, adds moisture and shine."
    },
    {
      id: "8",
      name: "SUNSET BLVD Blonde Shampoo",
      price: "$33.00",
      description: "A brightening shampoo for blondes that reduces brassiness."
    },
    {
      id: "9",
      name: "OBLIVION Clarifying Shampoo",
      price: "$27.00",
      description: "A purifying shampoo that removes product buildup and excess oil."
    },
    {
      id: "10",
      name: "ANALOG Cleansing Foam Conditioner",
      price: "$32.00",
      description: "A unique foaming conditioner that cleanses and conditions in one step."
    }
  ];
  
  return mockProducts;
};

export const convertToCSV = (products: Product[]): string => {
  // Add header row
  const header = ["Product Name", "Price", "Description"];
  
  // Create rows for each product
  const rows = products.map(product => [
    `"${product.name.replace(/"/g, '""')}"`,
    `"${product.price.replace(/"/g, '""')}"`,
    `"${product.description.replace(/"/g, '""')}"`
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
