// import { mastra } from "@/mastra";
import { makeAssistantTool, tool, useAssistantApi } from "@assistant-ui/react";
import { makeAssistantToolUI, AssistantToolUI } from "@assistant-ui/react";
import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AssistantUIWelcomeEmail } from "@/emails/assistant-ui";
import { toast } from "sonner";

import z from "zod";
import { Input } from "../ui/input";
import { renderAsync } from "@react-email/components";

export const HumanInTheLoopEmailTool = makeAssistantTool({
  toolName: "humanInTheLoopEmailTool",
  description: "Send an email about assistant-ui to a user",
  parameters: z.object({
    to: z.string().email("Please provide a valid email address"),
    subject: z
      .string()
      .optional()
      .describe("Email subject (defaults to 'Welcome to Assistant UI')"),
  }),
  execute: ({ to, subject }) => {
    return { to, subject, status: "execute" };
  },
  render: (data) => {
    return (
      <div className="my-3 flex gap-3 rounded-lg border px-4 py-2 shadow">
        <p>Render:</p>
        {JSON.stringify(data)}
      </div>
    );
  },
});

export const EmailConfirmationToolUI = makeAssistantToolUI<
  {
    to: string;
    subject: string;
  },
  {
    to: string;
    subject: string;
    confirmed?: boolean;
  }
>({
  toolName: "email-confirmation",
  render: ({ args, result }) => {
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [isRejected, setIsRejected] = useState(false);
    const [emailHtml, setEmailHtml] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const assistantApi = useAssistantApi();

    // Render email preview on mount
    useEffect(() => {
      const loadEmailPreview = async () => {
        const html = await renderAsync(
          AssistantUIWelcomeEmail({
            userName: "there",
            steps: [
              {
                id: 1,
                Description: (
                  <li className="mb-20 text-gray-700" key={1}>
                    <strong>Install assistant-ui.</strong> Get started in
                    seconds with{" "}
                    <a
                      href="https://assistant-ui.com/docs/getting-started"
                      className="text-brand"
                    >
                      npm install assistant-ui
                    </a>{" "}
                    and create your first chat interface.
                  </li>
                ),
              },
              {
                id: 2,
                Description: (
                  <li className="mb-20 text-gray-700" key={2}>
                    <strong>Explore our components.</strong> From simple chat
                    bubbles to complex tool UIs,{" "}
                    <a
                      href="https://assistant-ui.com/docs/components"
                      className="text-brand"
                    >
                      browse our component library
                    </a>{" "}
                    and see live examples.
                  </li>
                ),
              },
              {
                id: 3,
                Description: (
                  <li className="mb-20 text-gray-700" key={3}>
                    <strong>Connect your LLM.</strong> Works seamlessly with
                    OpenAI, Anthropic, or any LLM provider.{" "}
                    <a
                      href="https://assistant-ui.com/docs/providers"
                      className="text-brand"
                    >
                      See integration guides
                    </a>
                    .
                  </li>
                ),
              },
              {
                id: 4,
                Description: (
                  <li className="mb-20 text-gray-700" key={4}>
                    <strong>Deploy your first assistant.</strong> Ship to
                    production with built-in streaming, tool calling, and more.{" "}
                    <a
                      href="https://assistant-ui.com/docs/deployment"
                      className="text-brand"
                    >
                      Read deployment guide
                    </a>
                    .
                  </li>
                ),
              },
            ],
            resources: [],
          }),
        );
        setEmailHtml(html);
        setIsLoading(false);
      };
      loadEmailPreview();
    }, []);

    const handleConfirm = useCallback(async () => {
      setIsConfirmed(true);
      toast.success("Email confirmed and sent!");

      // Send confirmation message back to the assistant
      assistantApi
        .thread()
        .append("Email confirmed and sent successfully to " + args.to);
    }, [assistantApi, args.to]);

    const handleReject = useCallback(async () => {
      setIsRejected(true);
      toast.error("Email rejected");

      // Send rejection message back to the assistant
      assistantApi.thread().append("Email was rejected by the user");
    }, [assistantApi]);

    if (isConfirmed || isRejected) {
      return (
        <div className="my-3 rounded-lg border px-4 py-3 shadow">
          <div
            className={`font-semibold ${isConfirmed ? "text-green-600" : "text-red-600"}`}
          >
            Email {isConfirmed ? "Sent Successfully ✓" : "Rejected ✗"}
          </div>
          <div className="mt-1 text-sm text-gray-600">To: {args.to}</div>
        </div>
      );
    }

    return (
      <div className="my-3 flex flex-col gap-4 rounded-lg border px-4 py-4 shadow">
        <div>
          <h3 className="text-lg font-semibold">Confirm Email</h3>
          <p className="mt-1 text-sm text-gray-600">
            Please review and confirm the email before sending
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex gap-2">
            <span className="font-medium">To:</span>
            <span>{args.to}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-medium">Subject:</span>
            <span>{args.subject || "Welcome to Assistant UI"}</span>
          </div>
        </div>

        <div className="rounded-lg border bg-gray-50 p-4">
          <h4 className="mb-2 font-medium">Email Preview:</h4>
          {isLoading ? (
            <div className="py-4 text-center text-gray-500">
              Loading preview...
            </div>
          ) : (
            <iframe
              srcDoc={emailHtml}
              className="h-96 w-full rounded border bg-white"
              title="Email Preview"
            />
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleReject}
            disabled={isConfirmed || isRejected}
          >
            Reject
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isConfirmed || isRejected}
          >
            Confirm & Send
          </Button>
        </div>
      </div>
    );
  },
});

export const RequestInputToolUI = makeAssistantToolUI<
  {
    label: string;
    placeholder: string;
  },
  {
    result: string;
  }
>({
  toolName: "requestInputTool",
  render: ({ args, status, result, addResult }) => {
    const isCompleted = status.type === "complete";

    const [inputValue, setInputValue] = useState("");
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(
          e.target.value);
      },
      [],
    );

    const handleSubmit = useCallback(async () => {
      addResult({
        result: inputValue,
      });
    }, [inputValue]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (
          e.key === "Enter" &&
          !isCompleted &&
          /^[^\s/$.?#].[^\s]*$/i.test(inputValue)
        ) {
          handleSubmit();
        }
      },
      [handleSubmit, isCompleted, inputValue],
    );

    return (
      <div className="my-3 flex flex-col gap-2 rounded-lg border px-4 py-2 shadow">
        <p className="font-semibold">{args.label}</p>
        <Input
          className="rounded border px-2 py-1"
          aria-label={args.label}
          onChange={handleChange}
          value={result?.result || inputValue}
          disabled={isCompleted}
          onKeyDown={handleKeyDown}
        />
        <Button
          type="button"
          className="mt-2 self-end"
          onClick={handleSubmit}
          disabled={isCompleted || !/^[^\s/$.?#].[^\s]*$/i.test(inputValue)}
        >
          Submit
        </Button>
      </div>
    );
  },
});
