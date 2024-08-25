import { NextRequest, NextResponse } from "next/server";
import Together from "together-ai";
import { Readability } from "@mozilla/readability";
import jsdom, { JSDOM } from "jsdom";

// Initialize the Together API client
const together = new Together({
  apiKey: process.env["TOGETHER_API_KEY"],
  baseURL: "https://together.helicone.ai/v1",
  defaultHeaders: {
    "Helicone-Auth": `Bearer ${process.env.HELICONE_API_KEY}`,
  },
});

export async function POST(request: NextRequest) {
  const { product } = await request.json();

  console.log("[getComparison] Fetching alternative for product:", product);

  // Step 1: Fetch alternative product using LLM
  const alternativePrompt = `
    Given the product "${product}", suggest an alternative product for comparison that is commonly used as an alternative to this product. Provide a brief description of why it is considered an alternative.
  `;

  let alternativeProduct = "Alternative Product"; // Default value in case LLM fails
  let alternativeDescription = "No description available."; // Default description

  try {
    const response = await together.chat.completions.create({
      model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
      messages: [{ role: "system", content: alternativePrompt }],
    });

    alternativeProduct = response.choices[0].message?.content.split(".")[0].trim() || alternativeProduct;
    alternativeDescription = response.choices[0].message?.content || alternativeDescription;
    console.log(`[getComparison] Found alternative product: ${alternativeProduct}`);
  } catch (error) {
    console.error("Error fetching alternative product:", error);
  }

  // Fetch resources and generate comparison table
  try {
    const comparisonPrompt = `
      Compare the product "${product}" with the alternative "${alternativeProduct}". Include a detailed comparison in a table format. The table should have specific attributes like Definition, Ranking of Quality, Composition, Applications, Environmental Impact, and Conclusion.
    `;

    const payload = {
      model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
      messages: [{ role: "system", content: comparisonPrompt }],
    };

    const comparisonResponse = await together.chat.completions.create(payload);
    const comparisonData = comparisonResponse.choices[0].message?.content || "No data available";

    return NextResponse.json({ comparisonData, alternativeProduct });
  } catch (error) {
    console.error("Error fetching comparison data:", error);
    return NextResponse.json({ error: "Failed to load comparison data." }, { status: 500 });
  }
}
