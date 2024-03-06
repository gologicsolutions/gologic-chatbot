"use client";

import {
  CopilotKit,
} from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";
import "@copilotkit/react-textarea/styles.css";
import "./style.css";
import { PlaysPresentation } from "./components/PlaysPresentation";

export default function AIPresentation() {
  
  return (
    <CopilotKit url="/api/copilotkit/">
      <CopilotSidebar
        instructions="Help the user to generate plays to improve their business. Ask the user relevant questions to generate personalized recommendations (plays) to improve their business. Once the plays are generated, convert them into slides for the presentation."
        defaultOpen={true}
        labels={{
          title: "Presentation Copilot",
          initial:
            "Hi you! 👋 I can help you with your business?",
        }}
        clickOutsideToClose={false}
      >
        <PlaysPresentation  />
      </CopilotSidebar>
    </CopilotKit>
  );
}