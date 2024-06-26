import { ChatOpenAI } from "@langchain/openai";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
interface question {
  content: string;
  options: string[];
  description: string;
}
export async function updatingToneFunction(
  questions: question[]
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
      in which we have different Questions.You have to re-phrase content but Maintain important terms bold which are in '' content property of the object in friendly tone which can be easily understand by 13 years old kid and you have to strictly follow the order of questions
        and after making changes return me the array of object in the following JSON format:
     [
      {
        "content": "Your business is still ...",
        "options": ["Pre-Launch", "Operating", "On-Hold"],
        "description": "What is your business current stage"
      },
      ]
      IMPORTANT: must Re-Phrase Content 
      IMPORTANT:You cannot add Questions except from provided Questions
      IMPORTANT: Your tone should be friendly and dont change the options of the questions and dont add json\n this in JSON
      `.replace(/\s+/g, " ")
    ),
    new HumanMessage(`Questions: ${JSON.stringify(questions)}`),
  ]);
  let parsedResponse;
  console.log("parsedResponse", response.content);
  try {
    parsedResponse = JSON.parse(response.content as string);
  } catch (error) {
    console.error("Failed to parse JSON response:", response.content);
    throw new Error("Invalid JSON response from OpenAI API");
  }

  return parsedResponse;
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

// export async function getFormattedChatFunction(
//   messages: any
// ): Promise<Message> {
//   const openAI = new ChatOpenAI({
//     temperature: 0,
//     modelName: "gpt-4o",
//     openAIApiKey: process.env["OPENAI_API_KEY"],
//   });

//   const response = await openAI.invoke([
//     new SystemMessage(
//       `I am providing you array of object in this format:
//      [
//         {
//           content:'xyz',
//           id:'xyz',
//           role:'user'
//         },
//         {
//         content:'xyz',
//         id:'xyz',
//         role:'assisstant'
//          },
//         {
//         content:'xyz',
//         id:'xyz',
//         role:'function'
//         }
//       ]
//       IMPORTANT:You have to format the content for Example if there is options in Content then make it seprate for Example updated JSON will look like this
//       {
//         content:{content:'xyz',options:['X','Y','Z']}
//         id:'xyz',
//         role:'function'
//         }
//       .dont add json\n this in JSON and return updated array of objects
//       `.replace(/\s+/g, " ")
//     ),
//     new HumanMessage(`message: ${messages}`),
//   ]);
//   let parsedResponse;
//   try {
//     parsedResponse = JSON.parse(response.content as string);
//     console.log("parsedResponse", parsedResponse);
//   } catch (error) {
//     console.error("Failed to parse JSON response:", response.content);
//     throw new Error("Invalid JSON response from OpenAI API");
//   }

//   return parsedResponse;
// }
