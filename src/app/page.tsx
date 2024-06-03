"use client";

import {
  CopilotKit,
} from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";
import "@copilotkit/react-textarea/styles.css";
import "./style.css";
import { PlaysPresentation } from "./components/PlaysPresentation";
import plays from "../../data/plays.json"

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

const instructions = `You will be an excellent business assistant, and the user asking questions will be seeking to improve their business. Your mission will be to help them improve. For this, you will need to give them recommendations.
To know what recommend to the user, you will ask all the necessary questions, but these questions must be taken strictly from the following questions: ${questions}. You must ask the questions in the given order and one by one to the user.
Once you have asked all the questions, based on user responses you will choose the best recommendations from this ones: ${plays}. To decide which ones are the best you have to look into the description of each one
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

export default function AIPresentation() {
  
  return (
    <CopilotKit url="/api/copilotkit/">
      <CopilotSidebar
        instructions={instructions}
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