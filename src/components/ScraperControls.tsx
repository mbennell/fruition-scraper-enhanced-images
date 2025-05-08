
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, RefreshCw, History, Info, AlertTriangle } from "lucide-react";
import { Product, ScrapingLog } from "@/types/product";
import { convertToCSV, downloadCSV } from "@/services/scrapingService";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

interface ScraperControlsProps {
  onScrape: (url: string) => void;
  isLoading: boolean;
  products: Product[];
  lastScraped: Date | null;
  scrapingLogs: ScrapingLog[];
  lastError: string | null;
}

const ScraperControls = ({ 
  onScrape, 
  isLoading, 
  products, 
  lastScraped, 
  scrapingLogs,
  lastError 
}: ScraperControlsProps) => {
  const [url, setUrl] = useState("https://www.randco.com/collections/all");
  
  const handleExportCSV = () => {
    const csv = convertToCSV(products);
    downloadCSV(csv);
  };

  const handleScrape = () => {
    onScrape(url);
  };

  // Determine if products are real or fallback demo products
  const isUsingDemoProducts = products.length > 0 && lastError?.includes("fallback");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Fruition Product Scraper</span>
          {isUsingDemoProducts && (
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
              Demo Mode
            </Badge>
          )}
        </CardTitle>
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
            <div className="flex flex-col gap-2">
              <p className="text-xs text-muted-foreground">
                Examples:
              </p>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-5">
                <li>https://www.randco.com/collections/all</li>
                <li>https://www.randco.com/collections/all?pf_pt_type=Conditioner</li>
                <li>https://www.randco.com/collections/bleu-shop-all</li>
              </ul>
            </div>
          </div>
          
          {lastError && !lastError.includes("fallback") && (
            <Alert variant="destructive" className="mb-4 py-2">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-sm">{lastError}</AlertDescription>
            </Alert>
          )}

          {isUsingDemoProducts && (
            <Alert variant="warning" className="mb-4 py-2 bg-amber-50 text-amber-700 border-amber-200">
              <Info className="h-4 w-4" />
              <AlertDescription className="text-sm">
                Using demo products because the site couldn't be scraped directly. 
                This is normal for sites with modern anti-scraping measures.
              </AlertDescription>
            </Alert>
          )}
          
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
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-auto hidden sm:flex"
                  >
                    <Info className="h-4 w-4 text-muted-foreground" />
                    <span className="sr-only">Scraper information</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="end" className="max-w-xs">
                  <p>Current scraper uses client-side extraction which has limitations with modern websites. 
                     For better results with sites like Shopify stores, a server with tools like Puppeteer would be needed.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
        <p>Note: In this demo, product data is simulated for sites with anti-scraping measures. For production use, a backend service with browser automation would provide better results.</p>
      </CardFooter>
    </Card>
  );
};

export default ScraperControls;
