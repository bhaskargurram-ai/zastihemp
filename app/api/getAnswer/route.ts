import { Readability } from "@mozilla/readability";
import jsdom, { JSDOM } from "jsdom";
import {
  TogetherAIStream,
  TogetherAIStreamPayload,
} from "@/utils/TogetherAIStream";
import Together from "together-ai";

// Initialize Together API client
const together = new Together({
  apiKey: process.env["TOGETHER_API_KEY"],
  baseURL: "https://together.helicone.ai/v1",
  defaultHeaders: {
    "Helicone-Auth": `Bearer ${process.env.HELICONE_API_KEY}`,
  },
});

export const maxDuration = 45;

export async function POST(request: Request) {
  let { question, sources } = await request.json();

  console.log("[getAnswer] Fetching text from source URLs");

  // Fetching content from source URLs
  let finalResults = await Promise.all(
    sources.map(async (result: any) => {
      try {
        const response = await fetchWithTimeout(result.url);
        const html = await response.text();
        const virtualConsole = new jsdom.VirtualConsole();
        const dom = new JSDOM(html, { virtualConsole });

        const doc = dom.window.document;
        const parsed = new Readability(doc).parse();
        let parsedContent = parsed ? cleanedText(parsed.textContent) : "Nothing found";

        return {
          ...result,
          fullContent: parsedContent,
        };
      } catch (e) {
        console.log(`Error parsing ${result.name}, error: ${e}`);
        return {
          ...result,
          fullContent: "not available",
        };
      }
    })
  );

  // Debugging: Log the results to ensure proper fetching
  console.log("[getAnswer] Fetched and processed sources:", finalResults);

  // Dynamic Category Detection
  const categories = ["Hemp Seed", "Hemp Fiber", "Hemp Foods", "Hemp CBD", "Hemp Industrial Products"];
  let detectedCategory = "General"; // Default category

  for (let category of categories) {
    if (question.toLowerCase().includes(category.toLowerCase().split(" ")[1])) {
      detectedCategory = category;
      break;
    }
  }

  // Prepare the sources for the prompt without explicit citations
  const contextText = finalResults.map(
    (result) => `${result.fullContent} \n\n`
  ).join('');

  const mainAnswerPrompt = `
  You are a hemp sustainability expert. Based on the information provided in the following contexts, write a detailed and accurate answer to the user's question. Your response should be clear and informative, focusing on providing expert advice on hemp sustainability without referencing the sources or mentioning any citations.

  Here are the set of contexts:
  ${contextText}

  Here is the user question:
  ${question}
  `;

  // Log the prompt for debugging purposes
  console.log("[getAnswer] Generated prompt:", mainAnswerPrompt);

  try {
    const payload: TogetherAIStreamPayload = {
      model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
      messages: [
        { role: "system", content: mainAnswerPrompt },
        {
          role: "user",
          content: question,
        },
      ],
      stream: true,
    };

    console.log("[getAnswer] Fetching answer stream from Together API using text and question");
    const stream = await TogetherAIStream(payload);

    // Attach category to the stream response in headers
    return new Response(stream, {
      headers: new Headers({
        "Cache-Control": "no-cache",
        "X-Category": detectedCategory, // Custom header for category
      }),
    });
  } catch (e) {
    console.log("[getAnswer] Answer stream failed. Try fetching non-stream answer.");
    let answer = await together.chat.completions.create({
      model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
      messages: [
        { role: "system", content: mainAnswerPrompt },
        {
          role: "user",
          content: question,
        },
      ],
    });

    let parsedAnswer = answer.choices![0].message?.content;
    console.log("Error is: ", e);

    // Return the answer with the category
    return new Response(JSON.stringify({ answer: parsedAnswer, category: detectedCategory }), {
      status: 202,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

const cleanedText = (text: string) => {
  let newText = text
    .trim()
    .replace(/(\n){4,}/g, "\n\n\n")
    .replace(/\n\n/g, " ")
    .replace(/ {3,}/g, "  ")
    .replace(/\t/g, "")
    .replace(/\n+(\s*\n)*/g, "\n");

  return newText.substring(0, 20000);
};

async function fetchWithTimeout(url: string, options = {}, timeout = 3000) {
  const controller = new AbortController();
  const { signal } = controller;

  const fetchTimeout = setTimeout(() => {
    controller.abort();
  }, timeout);

  return fetch(url, { ...options, signal })
    .then((response) => {
      clearTimeout(fetchTimeout);
      return response;
    })
    .catch((error) => {
      if (error.name === "AbortError") {
        throw new Error("Fetch request timed out");
      }
      throw error;
    });
}
