import { type NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function GET(req: NextRequest) {
  try {
    const response = await ai.models.generateContentStream({
      model: "gemini-3-flash-preview",
      contents: "List only ten traits of capricorn zodiac sign.",
    });
    for await (const chunk of response) {
      return NextResponse.json(chunk.text);
    }
  } catch (error) {
    return NextResponse.json({ Error: error }, { status: 404 });
  }
}
