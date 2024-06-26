// Import necessary modules and classes from various packages.
import { CopilotRuntime, OpenAIAdapter } from "@copilotkit/backend";
import { createChatbotFlow } from "./researchPlays";
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

const getQuestions: AnnotatedFunction<any> = {
  name: "getQuestions", // Function name.
  description: "Call this function to get the questions to do to the user", // Function description.
  argumentAnnotations: [
    // Annotations for arguments that the function accepts.
    {
      name: "assessmentType", // Argument name.
      type: "string", // Argument type.
      description:
        "Which assessments the user wants to do, could be: financial, business essentials or marketing", // Argument description.
      required: true, // Indicates that the argument is required.
    },
  ],
  implementation: async (assessmentType) => {
    console.log("assessmentType =>", assessmentType);
    console.log("questions =>", questions)
    return questions;
  },
};

// Define an asynchronous function that handles POST requests.
export async function POST(req: Request): Promise<Response> {
  const actions: AnnotatedFunction<any>[] = []; // Initialize an array to hold actions.

  // Check if a specific environment variable is set, indicating access to certain functionality.
  if (process.env["TAVILY_API_KEY"]) { // tavily is the one that browse the internet
    actions.push(generatePlays); // Add the chatbot action to the actions array if the condition is true.
  }
  actions.push(getQuestions);

  // Instantiate CopilotRuntime with the actions defined above.
  const copilotKit = new CopilotRuntime({
    actions: actions,
  });

  // Use the CopilotBackend instance to generate a response for the incoming request using an OpenAIAdapter.
  return copilotKit.response(req, new OpenAIAdapter());
}
