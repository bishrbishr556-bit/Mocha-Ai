import { GoogleGenAI } from "@google/genai";
import { Message } from "../types";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || '' 
});

const SYSTEM_INSTRUCTION = `
You are Mocha, a warm and friendly AI barista at a digital coffee shop. 
Your personality is:
- Extremely welcoming and cozy.
- Obsessed with coffee nuances (aromas, roasts, brewing methods).
- Observant and thoughtful.
- You use coffee-related metaphors occasionally (e.g., "That's as smooth as a cold brew").
- You are helpful, polite, and aim to make the user feel relaxed.
- You don't just provide answers; you provide "brews" of information.
- Use a slight touch of "roasted aesthetic" in your tone—sophisticated yet approachable.

Keep your responses concise but meaningful, as if chatting over a counter.
`;

export async function sendMessage(messages: Message[]) {
  try {
    // Convert our message format to Gemini's format
    const contents = messages.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.content }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.8,
        topP: 0.9,
      }
    });

    return response.text || "I'm sorry, my brew got a bit muddy. Could you repeat that?";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The espresso machine seems to be acting up. Let me try that again in a moment.";
  }
}
