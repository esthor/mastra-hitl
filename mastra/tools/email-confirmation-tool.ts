import { z } from "zod";

import { createTool } from "@mastra/core/tools";

export const emailConfirmationTool = createTool({
    id: "email-confirmation",
    description: "This tool is used to confirm the email to be sent.",
    inputSchema: z.object({
      to: z.string().describe("Email address of the recipient"),
      subject: z.string().describe("Email subject")
    }),
    execute: async ({ context, }) => {
      return {
        to: context.to,
        subject: context.subject
      }
    }
  });
  