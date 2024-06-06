This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Environment variables

### Development (local)

Make sure to add the following to an .env.local file:

- OPENAI_API_KEY=your_openai_api_key
- TAVILY_API_KEY=your_tavily_api_key

#### Obtaining Your Tavily Search API Key

To use the Tavily Search API, you need to obtain an API key. Follow the steps below to get your API key:

1. Visit the Tavily Website:

- Navigate to the Tavily home page by clicking here.

2. Sign Up or Log In:

- If you do not have an account, click on the "Sign Up" button and follow the instructions to create a new account.
- If you already have an account, click on the "Log In" button and enter your credentials to access your account.

3. Access Your API Keys:

- Once logged in, navigate to the section where you can manage your API keys. This is usually found under account settings or a similar menu option.
- Look for an option labeled "API Keys," "Developer Settings," or something similar.

4. Generate a New API Key:

- In the API keys section, you should see an option to create or generate a new API key. Click on this option.
- Follow any prompts or instructions to name and generate your new API key.

5. Copy Your API Key:

- Once the API key is generated, it will be displayed on the screen. Copy this key and store it in a secure location.
- You will use this API key to authenticate your requests to the Tavily Search API.

#### Obtaining Your OpenAI API Key

To access the OpenAI Platform, you need to obtain an API key. Follow the steps below to get your API key:

1. Visit the OpenAI Website:

- Navigate to the OpenAI Platform API Keys page by clicking here.

2. Sign Up or Log In:

- If you do not have an account, sign up for an OpenAI account.
- If you already have an account, log in to access your account.

3. Generate a New API Key:

- Once logged in, navigate to the API Keys section.
- Click on the option to generate a new API key.
- Follow any prompts or instructions to generate your new API key.

4. Copy Your API Key:

- Once the API key is generated, it will be displayed on the screen. Copy this key and store it in a secure location.
- You will use this API key to authenticate your requests to the OpenAI Platform.


## Setup Assessments and Plays Files
Create a folder named `data` in the root of your repository and add the following files:

- `assessments.json`
- `plays.json`

```
root/
├── .env.local
├── data/
│   ├── assessments.json
│   └── plays.json
├── src/
│   └── app
├── ...
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
