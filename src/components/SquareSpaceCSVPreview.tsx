
import { Product } from "@/types/product";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
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
        <div className="p-4 bg-gray-50 rounded-md overflow-x-auto">
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
