import FirecrawlApp from '@mendable/firecrawl-js';
import { createTool } from "@mastra/core/tools";
import { z } from "zod";

const getFirecrawlClient = () => {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey) {
    throw new Error("FIRECRAWL_API_KEY environment variable is not set. The firecrawl-tool is currently unavailable.");
  }
  return new FirecrawlApp({ apiKey });
};

export const firecrawlTool = createTool({
  id: "crawl-website",
  description: "Extract and analyze content from websites for research, context gathering, or information retrieval purposes.",
  inputSchema: z.object({
    url: z.string().describe("URL of the website to crawl")
  }),
  outputSchema: z.object({
    content: z.string().optional()
  }),
  execute: async ({ context, }) => {
    const firecrawl = getFirecrawlClient();
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
