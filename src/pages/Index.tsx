
import { useState } from "react";
import { Product, ScrapingLog } from "@/types/product";
import { scrapeProducts } from "@/services/scrapingService";
import ScraperControls from "@/components/ScraperControls";
import ProductTable from "@/components/ProductTable";
import CSVPreview from "@/components/CSVPreview";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastScraped, setLastScraped] = useState<Date | null>(null);
  const [scrapingLogs, setScrapingLogs] = useState<ScrapingLog[]>([]);
  const { toast } = useToast();

  const handleScrape = async (url: string) => {
    try {
      setIsLoading(true);
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
      toast({
        title: "Scraping failed",
        description: "There was an error while scraping the products. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-brand py-6 border-b">
        <div className="scraper-container">
          <h1 className="text-2xl md:text-3xl font-bold text-center">
            R+Co Product Scraper Wizard
          </h1>
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
                ? `Showing ${products.length} products from R+Co's collection.`
                : "Start scraping to see products here."}
            </p>
            
            <ProductTable products={products} isLoading={isLoading} />
            
            <CSVPreview products={products} />
          </div>
        </div>
      </main>
      
      <footer className="border-t py-6">
        <div className="scraper-container text-center text-sm text-muted-foreground">
          <p>© 2025 R+Co Product Scraper Wizard | For demonstration purposes only</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
