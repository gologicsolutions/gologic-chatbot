import { ChatOpenAI } from "@langchain/openai";
import { StateGraph, END } from "@langchain/langgraph";
import { RunnableLambda } from "@langchain/core/runnables";
import { TavilySearchAPIRetriever } from "@langchain/community/retrievers/tavily_search_api";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

interface AgentState {
  topic: string;
  searchResults?: string;
  assessments?: string;
  responses?: string;
  plays?: string;
  questions?: string;
  article?: string;
  critique?: string;
}

const model = new ChatOpenAI({
  temperature: 0.7,
  modelName: "gpt-4-1106-preview",
  openAIApiKey: process.env["OPENAI_API_KEY"],
});

const retriever = new TavilySearchAPIRetriever({
  apiKey: process.env["TAVILY_API_KEY"],
  k: 10,
});

async function retrieveAdditionalInformation(query: string) {
  const docs = await retriever.getRelevantDocuments(query);
  return docs.map((doc) => doc.pageContent).join("\n");
}

async function generateQuestions(state: {
  agentState: AgentState;
}): Promise<{ agentState: AgentState }> {
  const additionalInfo = await retrieveAdditionalInformation(
    state.agentState.topic
  );
  const response = await model.invoke([
    new SystemMessage(`You are a business consultant AI.`),
    new HumanMessage(
      `Generate questions to assess the business needs of a client using the existing assessment data: ${state.agentState.assessments} and this additional information: ${additionalInfo}.`
    ),
  ]);
  return {
    agentState: {
      ...state.agentState,
      questions: response.content as string,
    },
  };
}

async function generatePlays(state: {
  agentState: AgentState;
}): Promise<{ agentState: AgentState }> {
  const additionalInfo = await retrieveAdditionalInformation(
    state.agentState.topic
  );
  const response = await model.invoke([
    new SystemMessage(`You are a business strategist AI.`),
    new HumanMessage(
      `Based on the client's responses: ${state.agentState.responses}, choose actionable plays from ${state.agentState.plays} to improve their business. You can also use this additional information: ${additionalInfo} to improve your choice. Remember that the plays MUST be from the provided ones. Please be careful to provide the url of the selected play.`
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
        topic: "",
        assessments: "",
        plays: "",
      }),
    },
  },
});

workflow.addNode(
  "generateQuestions",
  new RunnableLambda({ func: generateQuestions }) as any
);
workflow.addNode(
  "generatePlays",
  new RunnableLambda({ func: generatePlays }) as any
);

workflow.addEdge("generateQuestions", "generatePlays");
workflow.addEdge("generatePlays", END);

workflow.setEntryPoint("generateQuestions");
const app = workflow.compile();

export async function createChatbotFlow(
  topic: string,
  assessments: string,
  existingPlays: string
) {
  const inputs = {
    agentState: {
      topic,
      assessments,
      plays: existingPlays,
    },
  };
  const result = await app.invoke(inputs);
  console.log("result =>", result)
  return result.agentState.plays;
}
