
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, RefreshCw } from "lucide-react";
import { Product } from "@/types/product";
import { convertToCSV, downloadCSV } from "@/services/scrapingService";

interface ScraperControlsProps {
  onScrape: () => void;
  isLoading: boolean;
  products: Product[];
  lastScraped: Date | null;
}

const ScraperControls = ({ onScrape, isLoading, products, lastScraped }: ScraperControlsProps) => {
  const handleExportCSV = () => {
    const csv = convertToCSV(products);
    downloadCSV(csv);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>R+Co Shampoo Scraper</CardTitle>
        <CardDescription>
          Extract product information from the R+Co website
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-4">
          This tool scrapes shampoo products from the R+Co website, specifically from the collection page:
          <a href="https://www.randco.com/collections/all?pf_pt_type=Shampoo" 
             target="_blank" 
             rel="noopener noreferrer"
             className="text-blue-600 hover:underline block mt-1 truncate">
            https://www.randco.com/collections/all?pf_pt_type=Shampoo
          </a>
        </p>
        
        {lastScraped && (
          <p className="text-xs text-muted-foreground mb-4">
            Last scraped: {lastScraped.toLocaleString()}
          </p>
        )}
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            onClick={onScrape} 
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
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground border-t pt-4 flex flex-col items-start">
        <p>Note: In this demo, product data is simulated. In a production environment, this would connect to a backend service that performs the actual web scraping.</p>
      </CardFooter>
    </Card>
  );
};

export default ScraperControls;
