"use client";

import {
  CopilotKit,
  // useCopilotAction
} from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";
import "@copilotkit/react-textarea/styles.css";

const instructions = `Your mission will be collect information about the business of our clients and with this information generate plays.
To collect the information you will ask all the necessary questions, to know which questions you will ask you MUST call the function named getQuestions, 
and ask strictly the questions that you retrieve from there in the given order. IMPORTANT: to call the getQuestions function you need to send the assessmentType, 
so first, you need to ask the user about what want to improve, the options are: financial, business essentials or marketing.
Once you have the questions, you must ask the questions in the given order and one by one to the user, based on the user answers if you think that is better you can skip some questions.
Once you have asked all the questions, based on user answers you will generate the plays. To do that you will call the function named generatePlays, 
you must send as argument all the questions with each correspondent answer with the format:
question1: answer1, question2: answer2, question3: answer3
`

export default function AIPresentation() {
  
  return (
    <CopilotKit runtimeUrl="/api/copilotkit-chat-2/">
      <CopilotSidebar
        instructions={instructions}
        defaultOpen={true}
        labels={{
          title: "Generate plays",
          initial:
            "Hi you! 👋 I can generate your plays to improve your business!",
        }}
        clickOutsideToClose={false}
      >
        <div>
          Go Tackle chatbot V1 (chat 2)
        </div>
      </CopilotSidebar>
    </CopilotKit>
  );
}


