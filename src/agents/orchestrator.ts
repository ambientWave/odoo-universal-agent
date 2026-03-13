import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { createWorkerAgent } from "./worker.js";
import * as dotenv from "dotenv";

dotenv.config();

const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash-lite",
    apiKey: process.env.GOOGLE_API_KEY!,
    temperature: 0,
});

const systemPrompt = `You are an Orchestrator Agent. 
Input from user will be received by you. 
Your job is to analyze the user requirement and dispatch the specific work to the Worker Agent. 
The Worker Agent is an Odoo expert that can run XML-RPC queries. 
Explain to the Worker Agent what exactly needs to be queried based on the user's intent.`;

export async function runOrchestrator(userInput: string) {
    const workerAgentExecutor = await createWorkerAgent();

    const response = await model.invoke([
        ["system", systemPrompt],
        ["human", userInput],
    ]);

    const dispatchPlan = response.content;
    console.log(`Orchestrator Dispatch Plan: ${dispatchPlan}`);

    const workerResult = await workerAgentExecutor.invoke({
        messages: [{ role: "user", content: dispatchPlan.toString() }],
    });

    const lastMessage = workerResult.messages[workerResult.messages.length - 1];
    return lastMessage?.content?.toString() || "No response from worker";
}
