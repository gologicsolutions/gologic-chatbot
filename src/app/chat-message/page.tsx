"use client";

import {
  CopilotKit,
  useCopilotChat,
  // useCopilotAction
} from "@copilotkit/react-core";
import { CopilotSidebar, MessagesProps } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";
import "@copilotkit/react-textarea/styles.css";
import { instructions } from "../chat-tone/page";
import { useId, useState } from "react";

// const instructions = `Your mission will be collect information about the business of our clients and with this information generate plays.
// To collect the information you will ask all the necessary questions, to know which questions you will ask you MUST call the function named getQuestions and getAppreciation for getAppreciation,
// and ask strictly the questions that you retrieve from there in the given order. IMPORTANT: to call the getQuestions function you need to send the assessmentType,
// so first, you need to ask the user about what want to improve, the options are: financial, business essentials or marketing.
// Question format will be like
// {
//   "content": "Your business is still ...",
//   "options": ["Pre-Launch", "Operating", "On-Hold"],
//   "description": "What is your business current stage"
// },
// so you have to ask question from content and list options from options if any
// and description is for if you user ask explaination then use description to explain it
// Once you have the questions, you must ask the questions in the given order and one by one to the user, based on the user answers if you think that is better you can skip some questions.
// Once you have asked all the questions, based on user answers you will generate the plays. To do that you will call the function named generatePlays,
// you must send as argument all the questions with each correspondent answer with the format:
// question1: answer1, question2: answer2, question3: answer3
// You need to ask Question in friendly user tone and show apprecation like Great!, Wow on thier response.
// IMPORTANT:Start with an empathetic and thoughtful response, then provide the explanation
// `;

export default function AIPresentation() {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit-chat-message/">
      <CopilotSidebar
        instructions={instructions}
        defaultOpen={true}
        labels={{
          title: "Generate plays",
          initial:
            "Hi you! 👋 I can generate your plays to improve your business!",
        }}
        clickOutsideToClose={false}
        Messages={Messages}
      >
        <div>Go Tackle chatbot V1 (chat 3)</div>
      </CopilotSidebar>
    </CopilotKit>
  );
}

const Messages = ({ messages }: MessagesProps) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const { appendMessage } = useCopilotChat();
  const id = useId();

  let updatedMessages = messages.map((message) => {
    if (message.role === "user" || message.role === "assistant") {
      let content = message.content;
      let optionsMatch = content.match(/-\s([^\n]+)/g);
      if (optionsMatch) {
        let options = optionsMatch.map((option) =>
          option.replace(/-\s/, "").trim()
        );
        return {
          ...message,
          content: content.replace(/-\s[^\n]+\n/g, ""),
          options: options,
        };
      }
    }
    return message;
  });

  console.log("Updated Messgea", updatedMessages);

  const handleClick = (option: any) => {
    setSelectedOption(option);
    appendMessage({ content: option, id, role: "user" });
  };

  return (
    <div style={{ height: "max-content", overflow: "auto" }}>
      <h2 style={{ color: "black" }}>
        Hi you! 👋 I can generate your plays to improve your business!
      </h2>
      {updatedMessages.map((message: any, index) => (
        <div
          key={index}
          style={{
            color: message.role === "user" ? "blue" : "black",
            border: "8px",
            display: "flex",
            margin: "3px",
            justifyContent: message.role === "user" ? "flex-end" : "flex-start",
          }}
        >
          {message.role === "user" || message.role === "assistant" ? (
            message.options ? (
              <div>
                <p>{message.content}</p>
                <ul>
                  {message.options.map((option: any, idx: any) => (
                    <li
                      key={idx}
                      style={{
                        border: "3px solid black",
                        margin: "9px",
                        cursor: "pointer",
                        backgroundColor:
                          selectedOption === option ? "grey" : "white",
                      }}
                      onClick={() => handleClick(option)}
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p>{message.content}</p>
            )
          ) : null}
        </div>
      ))}
    </div>
  );
};
