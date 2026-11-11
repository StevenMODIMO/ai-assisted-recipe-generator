//import { authOptions } from "@/lib/authOptions";
import { type NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(req: NextRequest) {
  const { meal, instructions, ingredients, input } = await req.json();
  try {
    const prompt = `
Meal: ${meal}

Ingredients:
${ingredients
  .map(
    (i: { ingredient: string; measure: string }) =>
      `- ${i.ingredient}: ${i.measure}`,
  )
  .join("\n")}

Instructions:
${instructions}

User request:
${input}
`;
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction:
          "You are a professional chef AI that improves and generates recipes clearly and concisely. Format recipe responses as readable Markdown with a clear title, a short summary, an Ingredients section with a bulleted list, and a numbered Method section. Add helpful tips or dietary notes when relevant, and omit sections that do not apply. For questions that are not asking for a full recipe, answer directly with a short heading and organized bullets where useful. Respect the user's requested changes and do not invent nutrition facts.",
      },
    });

    return NextResponse.json({ result: response.text });
  } catch (error: unknown) {
    console.error("AI recipe generation failed", error);
    return NextResponse.json(
      { error: "We couldn't create your recipe update. Please try again." },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Outline common features found in a recipe maker web app",
    });
    return NextResponse.json({ res: response.text });
  } catch (error) {
    return NextResponse.json({ Error: error }, { status: 404 });
  }
}
