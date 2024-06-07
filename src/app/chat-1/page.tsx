"use client";

import {
  CopilotKit,
  // useCopilotAction
} from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";
import "@copilotkit/react-textarea/styles.css";

const instructions = `The initial chat starts with a message from the user specifying a business goal they have
(if not, try to ask in another way with an example of goals that meet the SMART criteria).
Once they provide the goal, send it to the isSmartGoal function to check if it is a SMART goal.
You need to send a string with the goal the user wrote to the isSmartGoal function. Once it returns,
it will provide a JSON in this format:
{
  message: string,
  isSmart: boolean,
  details: [
    {
      criteria: string,
      isSMART: boolean,
      reason: string,
      suggestedFixes: string
    }
  ]
}
If the isSmart value is true, then ask, "That's fantastic!
How much time are you dedicating to this goal? Are you working on it full-time,
part-time, or as a side gig?" in a user-friendly manner and end the chat. If the isSmart
value is false, explain the reason and suggest solutions based on what the backend returned.
`

export default function AIPresentation() {

  return (
    <CopilotKit runtimeUrl="/api/copilotkit-chat-1/">
      <CopilotSidebar
        instructions={instructions}
        defaultOpen={true}
        labels={{
          title: "AI Execution Plan",
          initial:
            "Hello! 👋 Could you please share any specific goals you have for this year? For example, these could be related to revenue, growth, or any other area important to you. Understanding your goals will help us provide the best support possible",
        }}
        clickOutsideToClose={false}
      >
        <div>
          Go Tackle chatbot V1 (AI Execution Plan)
        </div>
      </CopilotSidebar>
    </CopilotKit>
  );
}