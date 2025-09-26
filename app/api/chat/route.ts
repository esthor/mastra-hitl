// import { openai } from "@ai-sdk/openai";
// import { convertToModelMessages } from "ai";

import { mastra } from "@/mastra";
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
} from "ai";
// import { frontendTools } from "@assistant-ui/react-ai-sdk";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const agent = mastra.getAgent("emailMarketingAgent");

  // Convert assistant-ui messages to the format expected by mastra
  // const convertedMessages = convertToModelMessages(messages);

  // Stream the response using the agent
  // const result = await agent.streamVNext(convertedMessages);
  const stream = await agent.streamVNext(convertToModelMessages(messages), {
    format: "aisdk",
    onError: ({ error }) => {
      console.error("Mastra streamVNext onError", error);
    },
  });
  return createUIMessageStreamResponse({
    stream: createUIMessageStream({
      execute: ({ writer }) => {
        writer.merge(
          stream.toUIMessageStream().pipeThrough(
            new TransformStream({
              transform(chunk, controller) {
                if (
                  chunk.type === "start" &&
                  messages[messages.length - 1].role === "assistant"
                ) {
                  controller.enqueue({
                    ...chunk,
                    messageId: messages[messages.length - 1].id,
                  });
                } else {
                  controller.enqueue(chunk);
                }
              },
            }),
          ),
        );
      },
    }),
  });

  // Return the result in the format expected by assistant-ui
  return stream.toUIMessageStreamResponse();
}

// export async function POST(req: Request) {

//   const { messages, }: { messages: UIMessage[];  } = await req.json();
//   // Get the chefAgent instance from Mastra
//   const agent = mastra.getAgent("emailMarketingAgent");

//   const result = await agent.streamVNext(messages);
//   console.log("result", result);
//   return result.toUIMessageStreamResponse();

//   // console.log("tools", tools);

//   // console.log("frontendTools", frontendTools(tools));

//   // const result = streamText({
//   //   model: openai("gpt-4o"),
//   //   messages: convertToModelMessages(messages),
//   //   tools: {
//   //     ...frontendTools(tools),
//   //   },
//   // });

//   // return result.toUIMessageStreamResponse();
// }
