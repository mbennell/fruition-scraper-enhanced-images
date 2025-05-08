
import { useState } from "react";
import { Product, ScrapingLog } from "@/types/product";
import { scrapeProducts } from "@/services/scrapingService";
import ScraperControls from "@/components/ScraperControls";
import ProductTable from "@/components/ProductTable";
import CSVPreview from "@/components/CSVPreview";
import SquareSpaceCSVPreview from "@/components/SquareSpaceCSVPreview";
import ScrapingInstructions from "@/components/ScrapingInstructions";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastScraped, setLastScraped] = useState<Date | null>(null);
  const [scrapingLogs, setScrapingLogs] = useState<ScrapingLog[]>([]);
  const [lastError, setLastError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleScrape = async (url: string) => {
    try {
      setIsLoading(true);
      setLastError(null);
      
      const scrapedProducts = await scrapeProducts(url);
      setProducts(scrapedProducts);
      
      const now = new Date();
      setLastScraped(now);
      
      // Add to scraping logs
      const newLog: ScrapingLog = {
        url,
        timestamp: now,
        productCount: scrapedProducts.length
      };
      
      setScrapingLogs(prevLogs => [newLog, ...prevLogs]);
      
      toast({
        title: "Scraping completed",
        description: `Successfully scraped ${scrapedProducts.length} products from ${url}.`,
      });
    } catch (error) {
      console.error("Error during scraping:", error);
      
      let errorMessage = "There was an error while scraping the products.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setLastError(errorMessage);
      
      toast({
        title: "Scraping failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white py-6 border-b">
        <div className="scraper-container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img 
                src="/lovable-uploads/f23f8abb-ad22-427d-bf28-e1a13eb80584.png" 
                alt="Fruition Logo" 
                className="h-12" 
              />
              <h1 className="text-2xl md:text-3xl font-bold text-black">
                Fruition Product Scraper
              </h1>
            </div>
            <ScrapingInstructions />
          </div>
        </div>
      </header>
      
      <main className="scraper-container py-6">
        <div className="grid gap-6">
          <ScraperControls
            onScrape={handleScrape}
            isLoading={isLoading}
            products={products}
            lastScraped={lastScraped}
            scrapingLogs={scrapingLogs}
          />
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Scraped Products</h2>
            <p className="text-sm text-muted-foreground">
              {products.length > 0 
                ? `Showing ${products.length} products from the collection.`
                : "Start scraping to see products here."}
            </p>
            
            <ProductTable products={products} isLoading={isLoading} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CSVPreview products={products} />
              <SquareSpaceCSVPreview products={products} />
            </div>
          </div>
        </div>
      </main>
      
      <footer className="border-t py-6">
        <div className="scraper-container text-center text-sm text-muted-foreground">
          <p>© 2025 Fruition Product Scraper | For demonstration purposes only</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
