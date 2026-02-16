//import { authOptions } from "@/lib/authOptions";
import { type NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai"

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

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
