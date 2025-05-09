
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
import { Code, Server, ExternalLink, AlertTriangle } from 'lucide-react';

const ScrapingServerInstructions: React.FC = () => {
  return (
    <div className="space-y-4">
      <Alert className="bg-blue-50 border-blue-200">
        <Server className="h-4 w-4 text-blue-500" />
        <AlertTitle>Deployment Required for Server-Side Scraping</AlertTitle>
        <AlertDescription className="mt-2">
          This app requires deployment to a Node.js environment to use the server-side scraper functionality.
          The preview environment does not support running Puppeteer for web scraping.
        </AlertDescription>
      </Alert>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="setup">
          <AccordionTrigger>Deployment Instructions</AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">Option 1: Deploy to Vercel (Recommended)</h3>
              <p className="text-sm text-muted-foreground">
                Vercel provides serverless functions that can run Puppeteer in a Node.js environment.
              </p>
              <ol className="list-decimal list-inside text-sm space-y-2 pl-2">
                <li>Export this project from Lovable to your GitHub</li>
                <li>Create a new project on Vercel and connect it to your GitHub repo</li>
                <li>Add the following to your Vercel project settings under Environment Variables:</li>
                <div className="bg-gray-100 p-3 rounded font-mono text-sm mt-1">
                  <p>PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true</p>
                </div>
                <li>Create a <code>vercel.json</code> file in your project root with the following settings:</li>
                <div className="bg-gray-100 p-3 rounded font-mono text-sm mt-1">
                  {`{
  "functions": {
    "api/*.js": {
      "memory": 1024,
      "maxDuration": 60
    }
  }
}`}
                </div>
                <li>Deploy your project</li>
              </ol>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Option 2: Run Locally</h3>
              <p className="text-sm text-muted-foreground">
                You can also run the project locally with Node.js:
              </p>
              <ol className="list-decimal list-inside text-sm space-y-2 pl-2">
                <li>Clone the project to your local machine</li>
                <li>Install dependencies:
                  <div className="bg-gray-100 p-3 rounded font-mono text-sm mt-1">
                    npm install
                  </div>
                </li>
                <li>Start the development server:
                  <div className="bg-gray-100 p-3 rounded font-mono text-sm mt-1">
                    npm run dev
                  </div>
                </li>
              </ol>
            </div>
            
            <div className="space-y-2 bg-amber-50 border border-amber-200 rounded p-4 mt-4">
              <h3 className="font-medium flex items-center gap-1 text-amber-700">
                <Code className="h-4 w-4" />
                Important Notes About Deployment
              </h3>
              <ul className="list-disc list-inside text-sm text-amber-700 space-y-1">
                <li>The server-side scraper will only work when deployed to an environment that supports Node.js and Puppeteer</li>
                <li>For Vercel, use Node.js runtime {'>='} 18.x</li>
                <li>Increase memory allocation and function duration in your vercel.json file</li>
                <li>Consider serverless function timeout limits (typical limit is 10-60 seconds)</li>
                <li>Scraping commercial websites may violate their terms of service - use responsibly and only for educational purposes</li>
              </ul>
            </div>

            <div className="bg-red-50 border border-red-200 rounded p-4 mt-4">
              <h3 className="font-medium flex items-center gap-1 text-red-700">
                <AlertTriangle className="h-4 w-4" />
                Troubleshooting Common Errors
              </h3>
              <ul className="list-disc list-inside text-sm text-red-700 space-y-2 mt-2">
                <li><strong>Chrome executable not found</strong>: Make sure <code>PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true</code> is set in your environment variables.</li>
                <li><strong>Function timeout</strong>: If scraping takes too long, increase your function timeout in Vercel settings using vercel.json.</li>
                <li><strong>Memory limits</strong>: Increase memory allocation for your serverless function using vercel.json.</li>
                <li><strong>Puppeteer crashes</strong>: Try using these launch settings:
                  <div className="bg-gray-100 p-3 rounded font-mono text-xs mt-2">
                    {`const browser = await puppeteer.launch({
  args: [...chromium.args, '--no-sandbox', '--disable-setuid-sandbox'],
  defaultViewport: chromium.defaultViewport, 
  executablePath: await chromium.executablePath(),
  headless: true,
});`}
                  </div>
                </li>
              </ul>
            </div>

            <div className="flex items-center gap-1 text-sm text-blue-600 mt-2">
              <ExternalLink className="h-4 w-4" />
              <a href="https://vercel.com/guides/deploying-puppeteer-with-vercel" target="_blank" rel="noopener noreferrer">
                Read more about deploying Puppeteer on Vercel
              </a>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ScrapingServerInstructions;
