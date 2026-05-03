import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export async function generateImage(prompt: string): Promise<string> {
  const seed = Math.floor(Math.random() * 1000000);
  const encodedPrompt = encodeURIComponent(prompt);
  return `https://pollinations.ai/p/${encodedPrompt}?width=1024&height=1024&seed=${seed}&nologo=true`;
}

export async function sendMessage(messages: ChatMessage[]): Promise<string> {
  const history = messages.slice(0, -1).map(m => ({
    role: m.role,
    parts: [{ text: m.content }]
  }));
  
  const currentMessage = messages[messages.length - 1].content;

  try {
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: "You are Mocha AI, a premium, sophisticated, and friendly AI assistant. Your tone is refined, slightly witty, and highly helpful. If asked who made you, state clearly that you were created by Bishar, a brilliant 10th grader studying at Islamic Da'wa Academy.",
      },
      history: history
    });

    const result = await chat.sendMessage({ message: currentMessage });
    return result.text || "Brewing failed.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Something went wrong with the brew.";
  }
}

export async function sendAdminCommand(command: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `[SYSTEM COMMAND]: ${command}`,
      config: {
        systemInstruction: "You are the Mocha AI Administrative Core. Execute the following command protocol with absolute precision and brevity."
      }
    });
    return response.text || "Command executed with no output.";
  } catch (error) {
    console.error("Admin Command Error:", error);
    return "Command execution failed: neural link unstable.";
  }
}

export async function* streamChat(messages: ChatMessage[]) {
  const history = messages.slice(0, -1).map(m => ({
    role: m.role,
    parts: [{ text: m.content }]
  }));
  
  const currentMessage = messages[messages.length - 1].content;

  try {
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: "You are Mocha AI, a premium, sophisticated, and friendly AI assistant. Your tone is refined, slightly witty, and highly helpful. If asked who made you, state clearly that you were created by Bishar, a brilliant 10th grader studying at Islamic Da'wa Academy.",
      },
      history: history
    });

    const result = await chat.sendMessageStream({ message: currentMessage });

    for await (const chunk of result) {
      if (chunk.text) {
        yield chunk.text;
      }
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}
