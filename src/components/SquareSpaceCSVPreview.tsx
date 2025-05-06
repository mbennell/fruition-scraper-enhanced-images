
import { Product } from "@/types/product";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Check, AlertTriangle } from "lucide-react";
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
            Preview of the CSV file formatted for SquareSpace import
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
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md overflow-x-auto">
          <div className={`mb-3 p-2 rounded-md flex items-center gap-2 ${allHaveHighRes ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
            {allHaveHighRes ? (
              <Check size={18} className="text-green-500 dark:text-green-400" />
            ) : (
              <AlertTriangle size={18} className="text-amber-500 dark:text-amber-400" />
            )}
            <span>
              Found high-resolution images for {highResImageCount} of {products.length} products ({highResPercentage}%)
              {!allHaveHighRes && " - Some products will use thumbnail images instead."}
            </span>
          </div>
          
          <p className="text-sm text-muted-foreground mb-2">
            This format is compatible with SquareSpace's product import tool.
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
