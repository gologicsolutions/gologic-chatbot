// Import necessary modules and classes from various packages.
import { CopilotBackend, OpenAIAdapter } from "@copilotkit/backend";
import { createChatbotFlow } from "./researchPlays";
import { AnnotatedFunction } from "@copilotkit/shared";
import assessmentsData from '../../../../data/assessments.json';
import playsData from '../../../../data/plays.json';

// Define a runtime environment variable, indicating the environment where the code is expected to run.
export const runtime = "edge";

// Define an annotated function for the chatbot. This object includes metadata and an implementation for the function.
const chatbotAction: AnnotatedFunction<any> = {
  name: "chatbot", // Function name.
  description: "Call this function to create a chatbot flow for a given topic.", // Function description.
  argumentAnnotations: [ // Annotations for arguments that the function accepts.
    {
      name: "topic", // Argument name.
      type: "string", // Argument type.
      description: "The topic for the chatbot. 5 characters or longer.", // Argument description.
      required: true, // Indicates that the argument is required.
    }
  ],
  implementation: async (topic) => { // The actual function implementation.
    const assessments = JSON.stringify(assessmentsData);
    const existingPlays = JSON.stringify(playsData);
    console.log("topic =>", topic)
    const result = await createChatbotFlow(topic, assessments, existingPlays);
    console.log("result =>", result);
    return result;
  },
};

// Define an asynchronous function that handles POST requests.
export async function POST(req: Request): Promise<Response> {
  const actions: AnnotatedFunction<any>[] = []; // Initialize an array to hold actions.
  
  // Check if a specific environment variable is set, indicating access to certain functionality.
  if (process.env["TAVILY_API_KEY"]) {
    actions.push(chatbotAction); // Add the chatbot action to the actions array if the condition is true.
  }
  
  // Instantiate CopilotBackend with the actions defined above.
  const copilotKit = new CopilotBackend({
    actions: actions,
  });

  // Use the CopilotBackend instance to generate a response for the incoming request using an OpenAIAdapter.
  return copilotKit.response(req, new OpenAIAdapter());
}
