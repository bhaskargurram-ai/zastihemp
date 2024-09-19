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
  const { question } = await request.json();

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
      "General",
    ]),
  });

  // Convert schema to JSON schema
  const jsonSchema = zodToJsonSchema(schema, "mySchema");

  // Asynchronously generate related questions using the Together API
  const generateQuestions = together.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `
          You are an assistant that only gives answers related to industrial hemp. If the user's question is not related to industrial hemp, return exactly the following JSON object:
          {
            "error": "Please ask anything about industrial hemp only."
          }

          If the question is related to industrial hemp, provide three follow-up questions for each category, and identify which category the original question belongs to. Return a JSON object in this format:
          {
            "marketResearch": ["question1", "question2", "question3"],
            "sales": ["question1", "question2", "question3"],
            "production": ["question1", "question2", "question3"],
            "category": "Category of original question"
          }

          Do NOT repeat the original question. ONLY return the JSON object. If the question is not about industrial hemp, do NOT provide similar questions.
          
          Here is the user's original question:
        `,
      },
      {
        role: "user",
        content: question,
      },
    ],
    response_format: { type: "json_object", schema: jsonSchema },
    model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
  });

  // Wait for the Together API response
  let similarQuestions;
  try {
    similarQuestions = await generateQuestions;
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate questions", details: error.message });
  }

  let questions = "{}";
  try {
    questions = similarQuestions.choices?.[0].message?.content || "{}";
  } catch (error) {
    return NextResponse.json({ error: "Invalid response format from Together API", details: error.message });
  }

  let parsedQuestions;
  try {
    parsedQuestions = JSON.parse(questions);
  } catch (error) {
    return NextResponse.json({ error: "Failed to parse response", details: error.message });
  }

  // Check if the response indicates that the question is not about industrial hemp
  if (parsedQuestions.error) {
    return NextResponse.json({ error: "Please ask anything about industrial hemp only." });
  }

  // Determine the category based on keywords in the question (Optimized)
  const categoryMapping = {
    "hemp seed": "Hemp Seed",
    "hemp fiber": "Hemp Fiber",
    "hemp foods": "Hemp Foods",
    "industrial": "Hemp Industrial Products",
  };

  const category = Object.keys(categoryMapping).find((key) =>
    question.toLowerCase().includes(key)
  ) || "General";

  // Set the category based on keyword detection
  parsedQuestions.category = category;

  return NextResponse.json(parsedQuestions);
}
