
import { Product } from "@/types/product";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { convertToCSV } from "@/services/scrapingService";

interface CSVPreviewProps {
  products: Product[];
  maxRows?: number;
}

const CSVPreview = ({ products, maxRows = 5 }: CSVPreviewProps) => {
  if (products.length === 0) {
    return null;
  }

  const csv = convertToCSV(products);
  const lines = csv.split("\n");
  const previewLines = lines.slice(0, maxRows + 1); // Header + maxRows
  const hasMoreLines = lines.length > previewLines.length;

  return (
    <Card className="w-full mt-6">
      <CardHeader>
        <CardTitle>CSV Preview</CardTitle>
        <CardDescription>
          Preview of how the CSV file will look when exported
        </CardDescription>
      </CardHeader>
      <CardContent>
        <pre className="p-4 bg-gray-50 rounded-md overflow-x-auto text-xs md:text-sm">
          {previewLines.join("\n")}
          {hasMoreLines && "\n..."}
        </pre>
      </CardContent>
    </Card>
  );
};

export default CSVPreview;
