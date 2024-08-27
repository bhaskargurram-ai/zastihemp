import { TogetherAIStream, TogetherAIStreamPayload } from "@/utils/TogetherAIStream";
import Together from "together-ai";
import { encodeChat } from "gpt-tokenizer/model/gpt-3.5-turbo";
import { ChatMessage } from "gpt-tokenizer/GptEncoding";

// Initialize Together API client
const together = new Together({
  apiKey: process.env["TOGETHER_API_KEY"],
  baseURL: "https://together.helicone.ai/v1",
  defaultHeaders: {
    "Helicone-Auth": `Bearer ${process.env.HELICONE_API_KEY}`,
  },
});

export const maxDuration = 60;

export async function POST(request: Request) {
  let { question } = await request.json();

  console.log("[getAnswer] Generating answer directly from question");

  // Construct initial prompt with just the question
  const mainAnswerPrompt = `
  You are an expert in industrial hemp. Your job is to provide detailed, accurate, and specific answers strictly about industrial hemp. This includes information about hemp fiber, hemp seeds, and hemp-based industrial products. 

  Please note:
  - Do not provide any information related to medical hemp, CBD, or any other cannabinoid-related products.
  - If the question pertains to medicinal hemp or any topic outside of industrial hemp, simply state: "I only have information on industrial hemp. Please ask questions related to industrial hemp."
  - Avoid any mention of being an AI model or discussing AI capabilities.

  Here is the user's question:
  ${question}
  `;

  let messages: ChatMessage[] = [
    { role: "system", content: mainAnswerPrompt },
    { role: "user", content: question },
  ];

  let chatTokens = encodeChat(messages);

  // Check token length and truncate if necessary
  const maxTokens = 32768;
  const maxNewTokens = 1024;
  const maxInputTokens = maxTokens - maxNewTokens;

  if (chatTokens.length > maxInputTokens) {
    console.log("[getAnswer] Truncating prompt to fit within token limits.");
    // Dynamically reduce prompt length until token limit is satisfied
    while (chatTokens.length > maxInputTokens && mainAnswerPrompt.length > 0) {
      messages[0].content = mainAnswerPrompt.slice(0, -1000); // Remove last 1000 characters
      chatTokens = encodeChat(messages);
    }
  }

  try {
    const payload: TogetherAIStreamPayload = {
      model: "meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo",
      messages,
      stream: true,
    };

    console.log("[getAnswer] Fetching answer stream from Together API using text and question");
    const stream = await TogetherAIStream(payload);
    return new Response(stream, {
      headers: new Headers({
        "Cache-Control": "no-cache",
      }),
    });
  } catch (e) {
    console.log("[getAnswer] Answer stream failed. Attempting to fetch non-stream answer.");
    try {
      let answer = await together.chat.completions.create({
        model: "meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo",
        messages,
      });

      let parsedAnswer = answer.choices![0].message?.content;
      console.log("Error is: ", e);
      return new Response(parsedAnswer, { status: 202 });
    } catch (error) {
      console.error("[getAnswer] Error fetching non-stream answer:", error);

      // Return a fallback response in case of error
      return new Response(
        JSON.stringify({ answer: "I only have information on industrial hemp. Please ask questions related to industrial hemp." }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }
}
