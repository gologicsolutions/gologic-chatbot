"use client";

import {
  CopilotKit,
  // useCopilotAction
} from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";
import "@copilotkit/react-textarea/styles.css";
import "./style.css";

const questions = [
  "Your business is still ...\n- Pre-Launch\n- Operating\n- On-Hold",
  "Have you decided on a payment processor for your business?",
  "Which payment processor?\n- Stripe\n- Paypal\n- Other",
  "What types of payments will you accept for your business",
  `Do you need help with any of the following? 
  - Downloading Stripe App to a Mobile Device
  - Adding & Managing Products
  - Creating a Payment Link
  - Adding & Managing Customers
  - Creating & Managing Invoices
  - Customizing an Invoice Template
  - Integrating Stripe with QuickBooks
  - None of These
  `,
  "Would you like to learn more about pricing strategies?",
  "Do you use Point of Sale System for business?",
  `Do you need help with any of the following?
  - Transactions
  - Expenses
  - Invoicing
  - Taxes
  - Reports and Statements
  - None of these
  `,
  `Do you need help with any of the following?
  - Adding Items
  - Customizing Your Item Grid
  - Setting Up a Customer Directory
  - Managing Receipts
  - Ordering Hardware
  - Creating and Managing Invoices
  - Creating a POS Passcode and Managing Team Member Access
  - Setting Up Multiple Locations
  - None of These
  `,
  "Are you using a bookkeeping or accounting tool right now?",
  "Have you or an Accountant been bookkeeping for your business?"
];

const instructions = `Your mission will be collect information about the business of our clients and the with this information generate plays.
To collect the information you will ask all the necessary questions, but these questions must be taken strictly from the following questions: ${questions}. 
You must ask the questions in the given order and one by one to the user, based on the user answers if you think that is better you can skip some questions.
Once you have asked all the questions, based on user answers you will generate the plays. To do that you will call the action named generatePlays, 
you must send as argument all the questions with each correspondent answer with the format:
question1: answer1, question2: answer2, question3: answer3
`

export default function AIPresentation() {
  // useCopilotAction(
  //   {
  //     name: "generatePlays",
  //     description: "Generate the plays to recommend to the user what to do",
  //     parameters: [
  //       {
  //         name: "plays",
  //         type: "object[]",
  //         description: "The plays to recommend to the user",
  //         attributes: [
  //           {
  //             name: "id",
  //             type: "string",
  //             description: "The id of the play",
  //             required: true,
  //           },
  //           {
  //             name: "description",
  //             type: "string",
  //             description: "The description of the play",
  //             required: true,
  //           },
  //           {
  //             name: "title",
  //             type: "string",
  //             description: "The title of the play",
  //             required: true,
  //           }
  //         ]
  //       },
  //     ],
  //     handler: async ({plays}) => {
  //       console.log(plays);
  //     },
  //   }
  // );
  
  return (
    <CopilotKit runtimeUrl="/api/copilotkit/">
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
          Go Tackle chatbot V1
        </div>
      </CopilotSidebar>
    </CopilotKit>
  );
}


