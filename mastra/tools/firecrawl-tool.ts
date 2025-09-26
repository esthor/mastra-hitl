import FirecrawlApp from '@mendable/firecrawl-js';
import { createTool } from "@mastra/core/tools";
import { z } from "zod";
 
const firecrawl = new FirecrawlApp({
    apiKey: process.env.FIRECRAWL_API_KEY
});

export const firecrawlTool = createTool({
  id: "crawl-website",
  description: "Crawl a website",
  inputSchema: z.object({
    url: z.string().describe("URL of the website to crawl")
  }),
  outputSchema: z.object({
    content: z.string().optional()
  }),
  execute: async ({ context, }) => {
    const scrapeResponse = await firecrawl.scrape(context.url, {
        formats: ['markdown'],
        includeTags: ['title', 'meta', 'h1', 'h2', 'h3', 'p'],
        excludeTags: ['script', 'style', 'nav', 'footer'],
        waitFor: 3000
      });
    return {
      content: scrapeResponse.markdown
    };
  }
});
