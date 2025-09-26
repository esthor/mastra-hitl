import { tool } from "ai";
import { z } from "zod";
import { toast } from "sonner";

// Human approval request function
async function requestHumanApproval({
  action,
  details,
}: {
  action: string;
  details: {
    to: string;
    subject: string;
    userName?: string;
  };
}): Promise<boolean> {
  // Show a toast notification for better UX
  const message = `Do you want to send an email to ${details.to}?`;
  
  // For now, we'll use a simple confirm dialog
  // In a production app, you'd want a more sophisticated UI with custom modal
  const confirmed = window.confirm(`${message}\n\nSubject: ${details.subject}\nRecipient: ${details.userName || 'there'}`);
  
  if (confirmed) {
    toast.success("Email approved! Sending...");
  } else {
    toast.error("Email cancelled by user");
  }
  
  return confirmed;
}

// Email tool definition
export const sendWelcomeEmail = tool({
  description: "Send a welcome email to a user using the Assistant UI email template",
  parameters: z.object({
    to: z.string().email("Please provide a valid email address"),
    subject: z.string().optional().describe("Email subject (defaults to 'Welcome to Assistant UI')"),
    userName: z.string().optional().describe("Name of the recipient (defaults to 'there')"),
  }),
  execute: async ({ to, subject, userName }) => {
    // Wait for human approval
    const approved = await requestHumanApproval({
      action: "send_email",
      details: { to, subject: subject || 'Welcome to Assistant UI', userName },
    });
    
    if (!approved) {
      throw new Error("Email sending was cancelled by user");
    }

    // Send the email via API
    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to,
          subject,
          userName,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to send email: ${error.error || 'Unknown error'}`);
      }

      const result = await response.json();
      toast.success(`Email sent successfully to ${to}!`);
      return {
        success: true,
        messageId: result.id,
        message: `Email sent successfully to ${to}`,
      };
    } catch (error) {
      const errorMessage = `Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`;
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },
});
