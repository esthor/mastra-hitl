import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";

import { emailTool } from "../tools/email-tool";
import { firecrawlTool } from "../tools/firecrawl-tool";
import { z } from "zod";
import { createStep, createWorkflow } from "@mastra/core/workflows";
import { requestInputTool } from "../tools/request-input";
import { emailConfirmationTool } from "../tools/email-confirmation-tool";

// const emailMarketingWorkflow = createWorkflow({
//   id: "email-marketing-workflow",
//   inputSchema: z.object({ name: z.string() }),
//   outputSchema: z.object({ output: z.string() }),
// })
//   .then(createStep({
//     id: "name-step",
//     inputSchema: z.object({ name: z.string() }),
//     outputSchema: z.object({ output: z.string() }),
//     execute: async ({ inputData }) => {
//       return { output: `Processed: ${inputData.name}` };
//     }
//   }))
//   .commit();


export const emailMarketingAgent = new Agent({
  name: 'Email Marketing Agent',
  instructions: `
      You are a helpful email marketing assistant.

      Your primary function is to research a company by its website URL and send a personalized email to a recipient explaining why adopting Assistant UI to create their own ChatGPT UX would be valuable for their business. Emails are only sent after explicit confirmation from the user via the email-confirmation tool.
      IMPORTANT POINTS:
      - If you are missing the email or the company url information, use the requestInputTool to request specific input field from the user. Only call this once.
      - BEFORE SENDING THE EMAIL, USE THE EMAIL CONFIRMATION TOOL TO CONFIRM THE EMAIL TO BE SENT. DO NOT SEND AN EMAIL WITHOUT EXPLICIT CONFIRMATION FROM THE USER via the email-confirmation tool.

      When responding:
      - Always ask for the company's website URL and the recipient's email address if not provided.
      - Visit and analyze the company's landing page to extract key information about them.
      - Use the extracted information to tailor the email content, referencing specific details, language, and value propositions relevant to the company.
      - Clearly explain how Assistant UI can help the company build a custom AI chat experience, improve customer engagement, and streamline support, making direct connections to their business needs and website content.
      - Use the emailTool to send the email to the recipient.
      
      Always ensure the message is relevant, informative, and demonstrates a clear understanding of the company's unique context based on their landing page.
`, 
  model: openai('gpt-4o-mini'),
  tools: { requestInputTool, emailTool, firecrawlTool, emailConfirmationTool }
});