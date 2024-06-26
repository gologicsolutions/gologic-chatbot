import { ChatOpenAI } from "@langchain/openai";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
interface question {
  content: string;
  options: string[];
  description: string;
}

export async function userSpecificTone(
  questions: question[],
  tone: String
): Promise<string[]> {
  const openAI = new ChatOpenAI({
    temperature: 0,
    modelName: "gpt-4o",
    openAIApiKey: process.env["OPENAI_API_KEY"],
  });

  const response = await openAI.invoke([
    new SystemMessage(
      `I am providing you a Array of Objects with structure:
      [
        {
          "content": "Your business is still ...",
          "options": ["Pre-Launch", "Operating", "On-Hold"],
          "description": "What is your business current stage"
        },
        ]
      in which we have different Questions.I am providing you a tone you have to re phrase  questions content to that specific tone and after making changes return me the array of object in the following JSON format:
     [
      {
        "content": "Your business is still ...",
        "options": ["Pre-Launch", "Operating", "On-Hold"],
        "description": "What is your business current stage"
      },
      ]
      
      IMPORTANT: Your tone should be match with provided tone and dont change the options of the questions and dont add json\n this in JSON
      `.replace(/\s+/g, " ")
    ),
    new HumanMessage(`Questions: ${JSON.stringify(questions)},Tone:${tone}`),
  ]);
  let parsedResponse;
  console.log("toneeeee---", response.content);
  try {
    parsedResponse = JSON.parse(response.content as string);
  } catch (error) {
    console.error("Failed to parse JSON response:", response.content);
    throw new Error("Invalid JSON response from OpenAI API");
  }

  return parsedResponse;
}
