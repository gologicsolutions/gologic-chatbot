import { ChatOpenAI } from "@langchain/openai";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";

interface Criteria {
  criteria: string;
  isSMART: boolean;
  reason: string;
  suggestedFixes: string;
}

export async function smartGoalValidationFunction(goal: string): Promise<Criteria[]> {
  const openAI = new ChatOpenAI({
    temperature: 0,
    modelName: "gpt-4o",
    openAIApiKey: process.env["OPENAI_API_KEY"],
  });

  const response = await openAI.invoke([
    new SystemMessage(
      `You are an expert in setting SMART goals. Evaluate the following goal and provide feedback on each criterion (Specific, Measurable, Achievable, Relevant, Time-bound) in the following JSON format:
      [
        {
          "criteria": "Specific",
          "isSMART": boolean,
          "reason": string,
          "suggestedFixes": string
        },
        {
          "criteria": "Measurable",
          "isSMART": boolean,
          "reason": string,
          "suggestedFixes": string
        },
        {
          "criteria": "Achievable",
          "isSMART": boolean,
          "reason": string,
          "suggestedFixes": string
        },
        {
          "criteria": "Relevant",
          "isSMART": boolean,
          "reason": string,
          "suggestedFixes": string
        },
        {
          "criteria": "Time-bound",
          "isSMART": boolean,
          "reason": string,
          "suggestedFixes": string
        }
      ]`.replace(/\s+/g, " ")
    ),
    new HumanMessage(`Goal: ${goal}`),
  ]);

  return JSON.parse(response.content as string);
}