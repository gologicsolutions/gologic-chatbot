// Import necessary modules and classes from various packages.
import { CopilotRuntime, OpenAIAdapter } from "@copilotkit/backend";
import { smartGoalValidationFunction } from "./smartGoalValidation";
import { AnnotatedFunction } from "@copilotkit/shared";
// import assessmentsData from '../../../../data/assessments.json';
import playsData from "../../../../data/plays.json";
import questions from "../../../../data/assessments.json";

export interface Answer {
  question: string;
  answer: string;
}

// Define a runtime environment variable, indicating the environment where the code is expected to run.
export const runtime = "edge";

// Define an annotated function for the chatbot. This object includes metadata and an implementation for the function.
const generatePlays: AnnotatedFunction<any> = {
  name: "generatePlays", // Function name.
  description: "Call this function to generate the plays for the user", // Function description.
  argumentAnnotations: [
    // Annotations for arguments that the function accepts.
    {
      name: "questionAndAnswers", // Argument name.
      type: "string", // Argument type.
      description:
        "The questions that were asked to the user with their corresponding response. With the format, question: answer", // Argument description.
      required: true, // Indicates that the argument is required.
    },
  ],
  implementation: async (answers) => {
    // The actual function implementation.
    const existingPlays = JSON.stringify(playsData);
    console.log("answers =>", answers);
    const result = await createChatbotFlow(answers, existingPlays);
    console.log("result =>", result);
    return result;
  },
};

const isSmartGoal: AnnotatedFunction<any> = {
  name: "isSmartGoal", // Function name.
  description: "Call this function to check if a given goal is SMART", // Function description.
  argumentAnnotations: [
    // Annotations for arguments that the function accepts.
    {
      name: "goal", // Argument name.
      type: "string", // Argument type.
      description: "The business goal the user wants to check for SMART criteria", // Argument description.
      required: true, // Indicates that the argument is required.
    },
  ],
  implementation: async (goal: string) => {
    // Here you would add the actual implementation to check if the goal is SMART.
    // For example, making an API call or performing local validation.
    const result = await smartGoalValidationFunction(goal);
    console.log("goal =>", goal);
    console.log("result =>", result);
    
    // Process the result to extract and explain the details if not all are SMART.
    const allSmart = result.every(criteria => criteria.isSMART);
    
    if (allSmart) {
      return {
        message: "That's fantastic! How much time are you dedicating to this goal? Are you working on it full-time, part-time, or as a side gig?",
        isSmart: true,
        details: result
      };
    } else {
      const explanation = result.filter(criteria => !criteria.isSMART).map(criteria => {
        return `Criteria: ${criteria.criteria}\nReason: ${criteria.reason}\nSuggested Fixes: ${criteria.suggestedFixes}`;
      }).join("\n\n");
      return {
        message: `The goal is not fully SMART. Here are the details:\n\n${explanation}`,
        isSmart: false,
        details: result
      };
    }
  },
};

// Define an asynchronous function that handles POST requests.
export async function POST(req: Request): Promise<Response> {
  const actions: AnnotatedFunction<any>[] = []; // Initialize an array to hold actions.
  if (process.env["TAVILY_API_KEY"]) {
    actions.push(isSmartGoal);
  }
  const copilotKit = new CopilotRuntime({
    actions: actions,
  });

  // Use the CopilotBackend instance to generate a response for the incoming request using an OpenAIAdapter.
  return copilotKit.response(req, new OpenAIAdapter());
}
