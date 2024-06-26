// Import necessary modules and classes from various packages.
import {
  CopilotRuntime,
  OpenAIAdapter,
  OpenAIAssistantAdapter,
} from "@copilotkit/backend";
import { smartGoalValidationFunction } from "./smartGoalValidation";
import { AnnotatedFunction } from "@copilotkit/shared";

export interface Answer {
  question: string;
  answer: string;
}

// Define a runtime environment variable, indicating the environment where the code is expected to run.
export const runtime = "edge";

const isSmartGoal: AnnotatedFunction<any> = {
  name: "isSmartGoal", // Function name.
  description: "Call this function to check if a given goal is SMART", // Function description.
  argumentAnnotations: [
    // Annotations for arguments that the function accepts.
    {
      name: "goal", // Argument name.
      type: "string", // Argument type.
      description:
        "The business goal the user wants to check for SMART criteria", // Argument description.
      required: true, // Indicates that the argument is required.
    },
  ],
  implementation: async (goal: string) => {
    // Here you would add the actual implementation to check if the goal is SMART.
    // For example, making an API call or performing local validation.
    console.log("goal =>", goal);
    const result = await smartGoalValidationFunction(goal);
    console.log("result =>", result);

    // Process the result to extract and explain the details if not all are SMART.
    const allSmart = result.every((criteria) => criteria.isSMART);

    if (allSmart) {
      return {
        message:
          "That's fantastic! How much time are you dedicating to this goal? Are you working on it full-time, part-time, or as a side gig?",
        isSmart: true,
        details: result,
      };
    } else {
      const explanation = result
        .filter((criteria) => !criteria.isSMART)
        .map((criteria) => {
          return `Criteria: ${criteria.criteria}\nReason: ${criteria.reason}\nSuggested Fixes: ${criteria.suggestedFixes}`;
        })
        .join("\n\n");
      return {
        message: `The goal is not fully SMART. Here are the details:\n\n${explanation}`,
        isSmart: false,
        details: result,
      };
    }
  },
};

// Define an asynchronous function that handles POST requests.
export async function POST(req: Request): Promise<Response> {
  const actions: AnnotatedFunction<any>[] = []; // Initialize an array to hold actions.
  actions.push(isSmartGoal);
  const copilotKit = new CopilotRuntime({
    actions: actions,
  });

  // Use the CopilotBackend instance to generate a response for the incoming request using an OpenAIAdapter.
  return copilotKit.response(
    req,
    new OpenAIAssistantAdapter({
      assistantId: "asst_ALpUjgwzn57vyR699xkNPU96",
      retrievalEnabled: false,
    })
  );
}
