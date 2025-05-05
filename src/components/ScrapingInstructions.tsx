
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ChevronDown, Filter, Link } from "lucide-react";

const ScrapingInstructions = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <ChevronDown className="h-4 w-4" />
          <span>How to Use</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>How to Scrape Products</SheetTitle>
          <SheetDescription>
            Follow these steps to scrape product information from websites
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-8">
          <div className="space-y-3">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Filter className="h-5 w-5" /> 
              Step 1: Filter Products on the Website
            </h3>
            <p className="text-sm text-muted-foreground">
              Visit the website and use the filter options to narrow down the products you want to scrape.
            </p>
            <div className="rounded-md overflow-hidden border">
              <img 
                src="/lovable-uploads/1158a0c1-d275-48f1-b5e8-c7c6cfd08b06.png"
                alt="Filtering products on R+Co website"
                className="w-full"
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Link className="h-5 w-5" /> 
              Step 2: Copy the Filtered URL
            </h3>
            <p className="text-sm text-muted-foreground">
              After applying filters, copy the URL from your browser's address bar.
            </p>
            <div className="rounded-md overflow-hidden border">
              <img 
                src="/lovable-uploads/f23f8abb-ad22-427d-bf28-e1a13eb80584.png"
                alt="Copying the filtered URL"
                className="w-full"
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <ChevronDown className="h-5 w-5" /> 
              Step 3: Paste URL and Start Scraping
            </h3>
            <p className="text-sm text-muted-foreground">
              Paste the copied URL into the scraper tool and click "Start Scraping" to extract product information.
            </p>
            <div className="rounded-md overflow-hidden border">
              <img 
                src="/lovable-uploads/a601d38c-c276-4e07-8ddd-814ae6b7e554.png"
                alt="Sample product information"
                className="w-full"
              />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ScrapingInstructions;
