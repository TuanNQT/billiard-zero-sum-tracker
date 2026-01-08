
import { GoogleGenAI } from "@google/genai";
import { AppState } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getMatchCommentary(state: AppState): Promise<string> {
  try {
    const prompt = `
      Based on the following billiard match state, provide a short, witty, and fun commentary in Vietnamese.
      Players: ${state.players.map(p => `${p.name} (Score: ${p.totalScore})`).join(', ')}
      Number of matches played: ${state.history.length}
      
      Requirements:
      - Be encouraging or funny.
      - If someone is losing badly, "roast" them gently.
      - If it's a close game, highlight the tension.
      - Keep it under 100 words.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are a professional Billiard commentator who loves to joke around with friends.",
      },
    });

    return response.text || "Vào trận thôi anh em!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Sẵn sàng cho ván tiếp theo chưa?";
  }
}
