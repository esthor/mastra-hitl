import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { Resend } from "resend";
import { AssistantUIWelcomeEmail } from "@/emails/assistant-ui";
import React from "react";

const resend = new Resend(process.env.RESEND_API_KEY);

export const emailTool = createTool({
  id: "send-email",
  description: "Send an email to a user",
  inputSchema: z.object({
    to: z.string().describe("Email address of the recipient"),
    subject: z.string().describe("Email subject")
  }),
  outputSchema: z.object({
    response: z.string()
  }),
  execute: async ({ context }) => {
    const { to, subject } = context;
    await resend.emails.send({
      from: 'Assistant UI <onboarding@resend.dev>',
      to: [to],
      subject: subject || 'Welcome to Assistant UI',
      text: 'Welcome to Assistant UI',
      react: React.createElement(AssistantUIWelcomeEmail, {
        userName: 'there',
        steps: [],
        resources: [],
      }),
    });
    return {
      response: "Email sent successfully"
    };
  }
});