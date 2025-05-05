
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, RefreshCw, History } from "lucide-react";
import { Product, ScrapingLog } from "@/types/product";
import { convertToCSV, downloadCSV } from "@/services/scrapingService";
import { Input } from "@/components/ui/input";

interface ScraperControlsProps {
  onScrape: (url: string) => void;
  isLoading: boolean;
  products: Product[];
  lastScraped: Date | null;
  scrapingLogs: ScrapingLog[];
}

const ScraperControls = ({ onScrape, isLoading, products, lastScraped, scrapingLogs }: ScraperControlsProps) => {
  const [url, setUrl] = useState("https://www.randco.com/collections/all?pf_pt_type=Shampoo");
  
  const handleExportCSV = () => {
    const csv = convertToCSV(products);
    downloadCSV(csv);
  };

  const handleScrape = () => {
    onScrape(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fruition Product Scraper</CardTitle>
        <CardDescription>
          Extract product information from e-commerce websites
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="url" className="text-sm font-medium">URL to Scrape</label>
            <Input 
              id="url"
              value={url} 
              onChange={(e) => setUrl(e.target.value)}
              className="w-full"
              placeholder="Enter product collection URL"
            />
            <p className="text-xs text-muted-foreground">
              Example: https://www.randco.com/collections/all?pf_pt_type=Conditioner
            </p>
          </div>
          
          {lastScraped && (
            <p className="text-xs text-muted-foreground">
              Last scraped: {lastScraped.toLocaleString()}
            </p>
          )}
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              onClick={handleScrape} 
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Scraping...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  <span>Start Scraping</span>
                </>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleExportCSV}
              disabled={isLoading || products.length === 0}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              <span>Export CSV</span>
            </Button>
          </div>
          
          {scrapingLogs.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium flex items-center gap-1">
                <History className="h-4 w-4" />
                Scraping History
              </h3>
              <div className="mt-2 max-h-40 overflow-y-auto">
                <ul className="text-xs space-y-2">
                  {scrapingLogs.map((log, index) => (
                    <li key={index} className="border-b pb-1 last:border-0">
                      <p className="font-medium truncate">{log.url}</p>
                      <div className="flex justify-between text-muted-foreground">
                        <span>{log.timestamp.toLocaleString()}</span>
                        <span>{log.productCount} products</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground border-t pt-4 flex flex-col items-start">
        <p>Note: In this demo, product data is simulated. In a production environment, this would connect to a backend service that performs the actual web scraping.</p>
      </CardFooter>
    </Card>
  );
};

export default ScraperControls;
