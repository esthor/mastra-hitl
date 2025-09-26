import { Mastra } from "@mastra/core";
import { emailMarketingAgent } from "./agents/email-marketing-agent";
import { ConsoleLogger } from "@mastra/core/logger";

export const mastra = new Mastra({
  agents: { emailMarketingAgent },
  // storage: new LibSQLStore({
  //   // stores telemetry, evals, ... into memory storage, if it needs to persist, change to file:../mastra.db
  //   url: ":memory:",
  // }),
  logger: new ConsoleLogger(),
});
