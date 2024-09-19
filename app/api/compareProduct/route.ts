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

// Mock function to fetch alternative product. Replace with your logic.
const getAlternativeProduct = async (product) => {
  // Example: Fetch alternative from a database or predefined list
  const alternatives = {
    // Hemp Seed - Food and Technical Products
    "Hemp Seed Oil": "Olive Oil", // Common cooking oil
    "Margarine": "Butter", // Alternative spread
    "Hemp Food Supplements": "Fish Oil Capsules", // Common dietary supplement
    "Hemp Oil Paints": "Acrylic Paints", // Different type of paint
    "Hemp Varnishes": "Polyurethane Finish", // Non-hemp varnish
    "Hemp Printing Inks": "Soy-based Ink", // Environment-friendly ink alternative
    "Hemp Fuel": "Diesel Fuel", // Standard fuel
    "Hemp Solvents": "Acetone", // Common solvent
    "Hemp Lubricants": "Synthetic Motor Oil", // Non-hemp lubricant
    "Hemp Putty": "Silicone Sealant", // Common sealing compound
    "Hemp Coatings": "Latex Paint", // General purpose coating
    "Hemp Biofuel": "Ethanol", // Biofuel from corn or sugarcane
    "Hemp Soap": "Castile Soap", // Made from olive oil
    "Hemp Shampoo": "Coconut Oil Shampoo", // Non-hemp shampoo
    "Hemp Bath Gels": "Aloe Vera Bath Gel", // Non-hemp bath gel
    "Hemp Cosmetics": "Argan Oil Cosmetics", // Non-hemp cosmetics
  
    // Hemp Fiber - Textiles and Technical Textiles
    "Apparel": "Cotton T-shirt", // Common apparel material
    "Diapers": "Bamboo Diapers", // Alternative natural fiber
    "Fabrics": "Linen Fabric", // Non-hemp textile
    "Handbags": "Leather Handbag", // Common material for bags
    "Working Clothes": "Polyester Workwear", // Common work clothing
    "Denim": "Cotton Denim", // Standard denim material
    "Socks": "Wool Socks", // Alternative natural fiber
    "Shoes": "Leather Shoes", // Common shoe material
    "Fine Textiles (from cottonized fibers)": "Silk Fabric", // Luxury fabric
    "Underwear": "Cotton Underwear", // Common underwear material
    "Twine": "Jute Twine", // Common natural fiber
    "Rope": "Nylon Rope", // Synthetic alternative
    "Hempwool": "Sheep Wool", // Common insulation material
    "Canvas Bag": "Polyester Bag", // Common bag material
    "Carpets": "Nylon Carpet", // Synthetic carpet material
    "Geotextiles (erosion control mats)": "Coconut Coir Mats", // Natural erosion control
    "Tarps": "Polyethylene Tarp", // Common tarp material
    "Fiber": "Glass Fiber", // Alternative fiber material
    "Nets": "Polypropylene Net", // Synthetic netting material
  
    // Industrial Products
    "Agro Fiber Composites": "Wood Composites", // Non-hemp composite
    "Compression Moulded Parts": "Plastic Molded Parts", // Common material for parts
    "Brake/Clutch Linings": "Asbestos Brake Lining", // Traditional brake lining material
    "Caulking": "Silicone Caulk", // Common caulking material
    "Automotive (BioPlastics)": "ABS Plastic", // Common automotive plastic
  
    // Paper
    "Printing Paper": "Recycled Paper", // Common alternative paper
    "Fine Paper": "Cotton Paper", // High-quality paper alternative
    "Technical Filter Paper": "Cellulose Filter Paper", // Standard filter paper
    "Newsprint": "Recycled Newsprint", // Non-hemp newsprint
    "Cardboard and Packaging": "Corrugated Cardboard", // Standard packaging material
  
    // Building Materials
    "Fiberboard": "MDF (Medium Density Fiberboard)", // Common engineered wood
    "Fiberglass Substitute": "Fiberglass", // Traditional fiberglass
    "Hempbrick": "Clay Brick", // Common brick material
    "Stucco and Mortar": "Cement Mortar", // Standard construction material
    "Hempcrete": "Concrete", // Common building material
  
    // Animal Products
    "Animal Bedding": "Wood Shavings", // Common bedding material
    "Mulch": "Bark Mulch" // Non-hemp mulch
  };
  
  return alternatives[product] || "DefaultAlternative"; // Fallback to a default alternative
};

export async function POST(request: Request) {
  try {
    const { product } = await request.json(); // Adjusted to accept one product
    const alternativeProduct = await getAlternativeProduct(product);

    const mainAnswerPrompt = `
    You are an expert in sustainability and environmental impact. Please generate a detailed comparison table between ${product} and ${alternativeProduct}. The table should be formatted using HTML with the following attributes:

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

    There should be generated modern tables sing HTML, with CSS classes applied for styling. Ensure the table is responsive and modern-looking, using a clean design that works well on both mobile and desktop devices.
    `;

    const response = await together.chat.completions.create({
      model: "meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo",
      messages: [
        { role: "system", content: mainAnswerPrompt },
        { role: "user", content: `Compare ${product} and ${alternativeProduct}.` },
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
