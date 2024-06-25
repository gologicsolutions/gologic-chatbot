const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
const OpenAI = require("openai");

console.log("API+KEY ==>", process.env.OPENAI_API_KEY);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function main() {
  const myAssistant = await openai.beta.assistants.create({
    instructions:
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
    ]
    IMPORTANT: the isSMART key MUST be a boolean value (true or false)
    `.replace(/\s+/g, " "),
    name: "Smart goal Assistant",
    tools: [{ type: "code_interpreter" }],
    model: "gpt-4-turbo",
  });

  console.log(myAssistant);
}

main();
