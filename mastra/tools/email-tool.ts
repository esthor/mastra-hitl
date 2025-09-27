import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { Resend } from "resend";

const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY environment variable is not set. The email-tool is currently unavailable.");
  }
  return new Resend(apiKey);
};

const proposedEmailSchema = z.object({
  emailHandle: z.string(),
  to: z.string(),
  subject: z.string(),
  body: z.string(),
});

type ToolResultContent = {
  type?: string;
  toolName?: string;
  output?: { value?: unknown } | Record<string, unknown>;
  [key: string]: unknown;
};

type ModelMessage = {
  content?: ToolResultContent[];
  [key: string]: unknown;
};

const findProposedEmail = (
  messages: ModelMessage[] | undefined,
  handle: string,
) => {
  if (!messages) return undefined;

  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i];
    const contents = Array.isArray(message.content)
      ? (message.content as ToolResultContent[])
      : [];

    for (const content of contents) {
      if (
        content?.type === "tool-result" &&
        (content.toolName === "propose-email" ||
          content.toolName === "proposeEmailTool") &&
        content.output &&
        typeof content.output === "object"
      ) {
        const output = content.output as { value?: unknown };
        if (!("value" in output) || output.value === undefined) {
          continue;
        }

        try {
          const parsed = proposedEmailSchema.parse(output.value);
          if (parsed.emailHandle === handle) {
            return parsed;
          }
        } catch {
          // Ignore parse failures and keep searching
        }
      }
    }
  }

  return undefined;
};

const toHtml = (body: string) => {
  const escape = (value: string) =>
    value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  return escape(body).replace(/\n/g, "<br />");
};

export const sendEmailTool = createTool({
  id: "send-email",
  description:
    "Execute the delivery of a previously approved message or communication using the handle provided by the approval tool.",
  inputSchema: z.object({
    emailHandle: z
      .string()
      .describe(
        "Handle received from the propose-email tool after the user approves the draft",
      ),
  }),
  outputSchema: z.object({
    response: z.string(),
  }),
  execute: async ({ context: { emailHandle } }, options) => {
    const messages = options?.messages as ModelMessage[] | undefined;
    const proposedEmail = findProposedEmail(messages, emailHandle);

    if (!proposedEmail) {
      throw new Error(
        "Invalid or expired email handle. Please propose the email again and request user approval before sending.",
      );
    }

    const { to, subject, body } = proposedEmail;

    const resend = getResendClient();
    await resend.emails.send({
      from: "Assistant UI <onboarding@resend.dev>",
      to: [to],
      subject: subject || "Welcome to Assistant UI",
      text: body,
      html: toHtml(body),
    });

    return {
      response: "Email sent successfully",
    };
  },
});
