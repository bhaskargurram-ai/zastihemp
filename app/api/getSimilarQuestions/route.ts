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

  // Define the schema for validation, removing static categories
  const schema = z.object({
    marketResearch: z.array(z.string()).length(3),
    sales: z.array(z.string()).length(3),
    production: z.array(z.string()).length(3),
    category: z.string(),  // Allow dynamic category
  });

  // Convert schema to JSON schema
  const jsonSchema = zodToJsonSchema(schema, "mySchema");

  // Generate related questions and dynamically determine the category using the Together API
  const response = await together.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `
          You are a helpful assistant that categorizes questions based on the user's input. Analyze the user's question and dynamically determine the most appropriate category for it. Provide three follow-up questions for each category based on the user's question. 
          Please return a JSON object formatted as follows:
          {
            "marketResearch": ["question1", "question2", "question3"],
            "sales": ["question1", "question2", "question3"],
            "production": ["question1", "question2", "question3"],
            "category": "Dynamically determined category based on the question"
          }
          Ensure that the category is dynamically generated based on the context of the question. 
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

  // Parse the response from the Together API
  let parsedQuestions = response.choices?.[0].message?.content || "{}";
  let questionsData = JSON.parse(parsedQuestions);

  // Return the related questions and the dynamically determined category from the LLM
  return NextResponse.json(questionsData);
}
