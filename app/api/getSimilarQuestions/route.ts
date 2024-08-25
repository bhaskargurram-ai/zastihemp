import { NextResponse } from "next/server";
import Together from "together-ai";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

// Initialize the Together API client
const together = new Together({
  apiKey: process.env["TOGETHER_API_KEY"],
  baseURL: "https://together.helicone.ai/v1",
  defaultHeaders: {
    "Helicone-Auth": `Bearer ${process.env.HELICONE_API_KEY}`,
  },
});

export async function POST(request: Request) {
  let { question } = await request.json();

  // Determine the category based on keywords in the question
  let category = "";
  if (question.toLowerCase().includes("hemp seed")) {
    category = "Hemp Seed";
  } else if (question.toLowerCase().includes("hemp fiber")) {
    category = "Hemp Fiber";
  } else if (question.toLowerCase().includes("hemp foods")) {
    category = "Hemp Foods";
  } else if (question.toLowerCase().includes("hemp cbd")) {
    category = "Hemp CBD";
  } else if (question.toLowerCase().includes("industrial")) {
    category = "Hemp Industrial Products";
  } else {
    category = "General";  // Fallback category
  }

  // Define the schema for validation
  const schema = z.object({
    marketResearch: z.array(z.string()).length(3),
    sales: z.array(z.string()).length(3),
    production: z.array(z.string()).length(3),
    category: z.enum([
      "Hemp Seed",
      "Hemp Fiber",
      "Hemp Foods",
      "Hemp CBD",
      "Hemp Industrial Products",
      "General"
    ]),
  });

  // Convert schema to JSON schema
  const jsonSchema = zodToJsonSchema(schema, "mySchema");

  // Generate related questions using the Together API
  const similarQuestions = await together.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `
          You are a helpful assistant that categorizes similar questions based on the user's original question. The categories are Hemp Seed, Hemp Fiber, Hemp Foods, Hemp CBD, and Hemp Industrial Products. Provide three follow-up questions for each category, and identify which category the original question belongs to.
          Please return a JSON object with the format:
          {
            "marketResearch": ["question1", "question2", "question3"],
            "sales": ["question1", "question2", "question3"],
            "production": ["question1", "question2", "question3"],
            "category": "Category of original question"
          }
          Ensure that the category names are exactly: "Hemp Seed", "Hemp Fiber", "Hemp Foods", "Hemp CBD", "Hemp Industrial Products", "General".
          Do NOT repeat the original question. ONLY return the JSON object.
          Here is the user's original question:`,
      },
      {
        role: "user",
        content: question,
      },
    ],
    // @ts-ignore
    response_format: { type: "json_object", schema: jsonSchema },
    model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
  });

  let questions = similarQuestions.choices?.[0].message?.content || "{}";
  let parsedQuestions = JSON.parse(questions);

  // Set the category based on keyword detection
  parsedQuestions.category = category;

  return NextResponse.json(parsedQuestions);
}
