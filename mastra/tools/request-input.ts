import { z } from "zod";

import { createTool } from "@mastra/core/tools";

export const requestInputTool = createTool({
    id: "request-input",
    description: "This tool is used to request specific input field from the user.",
    inputSchema: z.object({
      label: z.string().describe("Label for the input"),
      placeholder: z.string().describe("Placeholder for the input")
    }),
    execute: async ({ context, }) => {
      
      return {
        label: context.label,
        placeholder: context.placeholder
      }
    }
  });
  