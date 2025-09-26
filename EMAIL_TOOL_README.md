# Human-in-the-Loop Email Tool

This project demonstrates a human-in-the-loop email tool using assistant-ui and Resend. When the AI assistant wants to send an email, it will ask for user confirmation before proceeding.

## Features

- **Human-in-the-Loop**: User confirmation required before sending emails
- **Email Template**: Uses a beautiful React email template from `@react-email/components`
- **Toast Notifications**: User feedback via sonner toasts
- **Resend Integration**: Sends emails via Resend API
- **Type Safety**: Full TypeScript support with Zod validation

## Setup

1. **Install dependencies**:
   ```bash
   bun install
   ```

2. **Set up environment variables**:
   Create a `.env.local` file with:
   ```
   OPENAI_API_KEY=your-openai-api-key
   RESEND_API_KEY=your-resend-api-key
   NEXT_PUBLIC_ASSISTANT_BASE_URL=your-assistant-cloud-url
   ASSISTANT_API_KEY=your-assistant-cloud-api-key
   ```

3. **Run the development server**:
   ```bash
   bun dev
   ```

## How to Use

1. Open the chat interface
2. Ask the AI to send an email, for example:
   - "Send a welcome email to john@example.com"
   - "Send an email to sarah@company.com with subject 'Welcome to our team'"
   - "Email jane@test.com about our new features"

3. The AI will ask for confirmation before sending
4. You'll see toast notifications for approval, sending, and success/error states

## Email Tool Parameters

The `sendWelcomeEmail` tool accepts:
- `to` (required): Email address of the recipient
- `subject` (optional): Email subject line (defaults to "Welcome to Assistant UI")
- `userName` (optional): Name of the recipient (defaults to "there")

## Files Structure

- `lib/email-tool.ts` - The human-in-the-loop email tool definition
- `app/api/send/route.ts` - API route for sending emails via Resend
- `app/api/chat/route.ts` - Chat API with email tool integration
- `emails/assistant-ui.tsx` - React email template
- `app/layout.tsx` - Layout with toast notifications

## Customization

### Email Template
Modify `emails/assistant-ui.tsx` to customize the email design and content.

### Human Approval UI
Replace the `window.confirm()` in `lib/email-tool.ts` with a custom modal component for better UX.

### Tool Behavior
Modify the tool parameters and execution logic in `lib/email-tool.ts` to match your requirements.

## Example Usage

```
User: Send a welcome email to newuser@example.com with their name "Alice"

AI: I'll send a welcome email to Alice at newuser@example.com. Let me confirm this with you first.

[Confirmation dialog appears]
Do you want to send an email to newuser@example.com?

Subject: Welcome to Assistant UI
Recipient: Alice

[User clicks OK]

[Toast notification: "Email approved! Sending..."]
[Toast notification: "Email sent successfully to newuser@example.com!"]
```

