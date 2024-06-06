import { ChatOpenAI } from "@langchain/openai";
import { StateGraph, END } from "@langchain/langgraph";
import { RunnableLambda } from "@langchain/core/runnables";
// import { TavilySearchAPIRetriever } from "@langchain/community/retrievers/tavily_search_api";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { Answer } from "./route";

interface AgentState {
  answers: string;
  searchResults?: string;
  assessments?: string;
  plays?: string;
  questions?: string;
  article?: string;
  critique?: string;
}

const model = new ChatOpenAI({
  temperature: 0.7,
  modelName: "gpt-4o",
  openAIApiKey: process.env["OPENAI_API_KEY"],
});

// const retriever = new TavilySearchAPIRetriever({
//   apiKey: process.env["TAVILY_API_KEY"],
//   k: 10,
// });

// async function retrieveAdditionalInformation(query: string) {
//   const docs = await retriever.getRelevantDocuments(query);
//   return docs.map((doc) => doc.pageContent).join("\n");
// }

// async function generateQuestions(state: {
//   agentState: AgentState;
// }): Promise<{ agentState: AgentState }> {
//   const additionalInfo = await retrieveAdditionalInformation(
//     state.agentState.topic
//   );
//   const response = await model.invoke([
//     new SystemMessage(`You are a business consultant AI.`),
//     new HumanMessage(
//       `Generate questions to assess the business needs of a client using the existing assessment data: ${state.agentState.assessments} and this additional information: ${additionalInfo}.`
//     ),
//   ]);
//   return {
//     agentState: {
//       ...state.agentState,
//       questions: response.content as string,
//     },
//   };
// }

async function generatePlays(state: {
  agentState: AgentState;
}): Promise<{ agentState: AgentState }> {
  // const additionalInfo = await retrieveAdditionalInformation(
  //   state.agentState.topic
  // );
  const response = await model.invoke([
    new SystemMessage(`You are a business strategist AI.`),
    new HumanMessage(
      `Based on the client's responses: ${state.agentState.answers}, you will choose the best recommendations from this ones: ${state.agentState.plays}. To decide which ones are the best you have to look into the description of each one
       Return a list of selected place id with this format:
        {
         plays: [
          {
            "id": "id1",
            "description": "description1",
            "title": "title1"
          }, 
          {
            "id": "id2",
            "description": "description1",
            "title": "title1"
          }, 
          {
            "id": "id3",
            "description": "description1",
            "title": "title1"
          }
          ]
        }
      `
    ),
  ]);
  // new HumanMessage(`Based on the client's responses: ${state.agentState.responses}, generate actionable plays to improve their business. Use the existing plays as reference: ${state.agentState.plays} and this additional information: ${additionalInfo}. `)
  return {
    agentState: {
      ...state.agentState,
      plays: response.content as string,
    },
  };
}

const workflow = new StateGraph({
  channels: {
    agentState: {
      value: (x: AgentState, y: AgentState) => y,
      default: () => ({
        answers: "",
        plays: "",
      }),
    },
  },
});

// workflow.addNode(
//   "generateQuestions",
//   new RunnableLambda({ func: generateQuestions }) as any
// );
workflow.addNode(
  "generatePlays",
  new RunnableLambda({ func: generatePlays }) as any
);

// workflow.addEdge("generateQuestions", "generatePlays");
workflow.addEdge("generatePlays", END);

workflow.setEntryPoint("generatePlays");
const app = workflow.compile();

export async function createChatbotFlow(
  answers: Answer[],
  existingPlays: string
) {
  const inputs = {
    agentState: {
      answers,
      plays: existingPlays,
    },
  };
  const result = await app.invoke(inputs);
  console.log("result =>", result);
  return result.agentState.plays;
}
