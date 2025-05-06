
import { Product } from "@/types/product";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Check, AlertTriangle, Info, ExternalLink } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { convertToSquareSpaceCSV, downloadSquareSpaceCSV } from "@/services/scrapingService";

interface SquareSpaceCSVPreviewProps {
  products: Product[];
  maxRows?: number;
}

const SquareSpaceCSVPreview = ({ products, maxRows = 5 }: SquareSpaceCSVPreviewProps) => {
  if (products.length === 0) {
    return null;
  }

  const csv = convertToSquareSpaceCSV(products);
  const lines = csv.split("\n");
  const previewLines = lines.slice(0, maxRows + 1); // Header + maxRows
  const hasMoreLines = lines.length > previewLines.length;
  
  // Count how many products have high-res images
  const highResImageCount = products.filter(p => p.highResImageUrl).length;
  const highResPercentage = products.length > 0 ? Math.round((highResImageCount / products.length) * 100) : 0;
  
  // Check if all products have high-res images
  const allHaveHighRes = highResImageCount === products.length;

  return (
    <Card className="w-full mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>SquareSpace CSV Preview</CardTitle>
          <CardDescription>
            Ready for import to SquareSpace store
          </CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2"
          onClick={() => downloadSquareSpaceCSV(products)}
        >
          <Download size={16} />
          Download
        </Button>
      </CardHeader>
      <CardContent>
        {/* Image Quality Alert */}
        {allHaveHighRes ? (
          <Alert className="mb-4 bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
            <Check className="h-4 w-4 text-green-500 dark:text-green-400" />
            <AlertTitle>High Quality Images Available</AlertTitle>
            <AlertDescription>
              All {products.length} products have high-resolution product images.
            </AlertDescription>
          </Alert>
        ) : highResImageCount > 0 ? (
          <Alert className="mb-4 bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800">
            <AlertTriangle className="h-4 w-4 text-amber-500 dark:text-amber-400" />
            <AlertTitle>Mixed Image Quality</AlertTitle>
            <AlertDescription>
              Found high-resolution images for {highResImageCount} of {products.length} products ({highResPercentage}%).
              Remaining products will use standard thumbnail images.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="mb-4 bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800">
            <Info className="h-4 w-4 text-blue-500 dark:text-blue-400" />
            <AlertTitle>Using Thumbnail Images</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>Using thumbnail images for all products. Modern e-commerce sites like Shopify stores often:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Use client-side JavaScript to load high-resolution images</li>
                <li>Implement anti-scraping measures to protect product content</li>
                <li>Load images dynamically after the page renders</li>
              </ul>
              <p className="text-sm mt-2 pt-2 border-t border-blue-100 dark:border-blue-800">
                <strong>Advanced solution:</strong> For full-quality image extraction, a server-side solution with browser automation 
                tools like Puppeteer would be needed to fully render the pages.
              </p>
            </AlertDescription>
          </Alert>
        )}
        
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md overflow-x-auto mt-4">
          <p className="text-sm text-muted-foreground mb-2">
            This CSV format is compatible with SquareSpace's product import tool.
          </p>
          <pre className="text-xs md:text-sm">
            {previewLines.join("\n")}
            {hasMoreLines && "\n..."}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
};

export default SquareSpaceCSVPreview;
