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
${ingredients.map((i: any) => `- ${i.ingredient}: ${i.measure}`).join("\n")}

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
          "You are a professional chef AI that improves and generates recipes clearly and concisely.",
      },
    });

    return NextResponse.json({ result: response.text });
  } catch (error: any) {
    return NextResponse.json(error);
  }
}

export async function GET(req: NextRequest) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Outline common features found ina recipe maker web app",
    });
    return NextResponse.json({ res: response.text });
  } catch (error) {
    return NextResponse.json({ Error: error }, { status: 404 });
  }
}
