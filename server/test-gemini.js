import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

console.log("Key loaded:", !!process.env.GEMINI_API_KEY);
console.log("Key length:", process.env.GEMINI_API_KEY?.length);

try {
    console.log("📤 Sending Gemini request...");

    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents: "Say hello in one short sentence.",
    });

    console.log("✅ Gemini response received:");
    console.log(response.text);

} catch (error) {
    console.error("❌ Gemini request failed:");
    console.error(error);
}