// playwright-test.js
import { chromium } from '@playwright/test';

(async () => {
  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('https://www.randco.com');
    const title = await page.title();
    console.log(`Page Title: ${title}`);
    await browser.close();
    console.log("✅ Playwright is working correctly.");
  } catch (error) {
    console.error("❌ Playwright Error:", error);
  }
})();
