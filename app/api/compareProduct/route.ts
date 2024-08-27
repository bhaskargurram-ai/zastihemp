import { NextResponse } from "next/server";
import Together from "together-ai";

// Initialize Together API client
const together = new Together({
  apiKey: process.env["TOGETHER_API_KEY"],
  baseURL: "https://together.helicone.ai/v1",
  defaultHeaders: {
    "Helicone-Auth": `Bearer ${process.env.HELICONE_API_KEY}`,
  },
});

export async function POST(request: Request) {
  const { product1, product2 } = await request.json(); // Adjusted to accept two products

  const mainAnswerPrompt = `
  You are an expert in sustainability and environmental impact. Please generate a detailed comparison table between ${product1} and ${product2}. The table should be formatted using HTML with the following attributes:

  1. **Definition**: A brief description of each product.
  2. **Ranking of Quality of Data (1: Low; 5: Very High)**: A rating based on the reliability of the data.
  3. **Composition**: The primary materials used in each product.
  4. **Additional Information/Applications**: Specific uses and applications of each product.
  5. **Unit of Comparison**: Ensure all data is in the same unit.
  6. **Carbon Footprint**: Carbon emissions for 1 unit of each product.
  7. **Use of Water**: Water required for 1 unit of each product.
  8. **Use of Land**: Land required for 1 unit of each product.
  9. **Use of Energy**: Energy consumption for 1 unit of each product.
  10. **Use of Raw Material**: Raw material usage for each product.
  11. **Overall Environmental Benefits**: Environmental benefits or drawbacks of each product.
  12. **Conclusion of the Comparison Analysis**: An overall comparison summary.
  13. **Sources**: Provide specific references for each data point.

  The table should be generated using HTML, with CSS classes applied for styling. Ensure the table is responsive and modern-looking, using a clean design that works well on both mobile and desktop devices.
  `;

  try {
    const response = await together.chat.completions.create({
      model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
      messages: [
        { role: "system", content: mainAnswerPrompt },
        { role: "user", content: `Compare ${product1} and ${product2}.` },
      ],
    });

    const answer = response.choices![0].message?.content;
    console.log("Generated table:", answer); // Log the generated table for debugging

    return new NextResponse(JSON.stringify({ answer }), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (e) {
    console.error("Error generating comparison table:", e);
    return new NextResponse(JSON.stringify({ error: "Failed to generate table" }), { status: 500 });
  }
}
