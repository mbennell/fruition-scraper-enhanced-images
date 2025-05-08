
import React from 'react';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Code } from 'lucide-react';

const ScrapingServerInstructions: React.FC = () => {
  return (
    <div className="space-y-4">
      <Alert className="bg-blue-50 border-blue-200">
        <Code className="h-4 w-4 text-blue-500" />
        <AlertTitle>Setting up the server-side scraper</AlertTitle>
        <AlertDescription className="mt-2">
          This app now includes server-side scraping capabilities for better results with modern e-commerce sites.
          Follow the instructions below to set up and use the server-side scraper.
        </AlertDescription>
      </Alert>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="setup">
          <AccordionTrigger>Setup Instructions</AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">1. Install Puppeteer</h3>
              <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                npm install puppeteer
              </div>
              <p className="text-sm text-muted-foreground">
                Puppeteer is required for the server-side scraper to work properly.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">2. Set Up API Route</h3>
              <p className="text-sm">
                Ensure the <code>/api/scrape</code> route is properly set up. For most frameworks:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Next.js - Make sure the api/scrape.js file is in the pages/api folder</li>
                <li>Express - Set up the route in your server.js file</li>
                <li>For pure static sites - Consider using a serverless function (Vercel, Netlify, etc.)</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">3. Test the Scraper</h3>
              <p className="text-sm text-muted-foreground">
                Enter a URL in the scraper controls and click "Start Scraping" to test if the server-side scraper is working.
                If you see actual product data (not demo products), the server-side scraper is working correctly.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ScrapingServerInstructions;
