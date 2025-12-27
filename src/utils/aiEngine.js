import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";

const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const DEEPSEEK_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;

const genAI = GEMINI_KEY ? new GoogleGenerativeAI(GEMINI_KEY) : null;
const openai = DEEPSEEK_KEY && DEEPSEEK_KEY !== "your_deepseek_api_key_here"
  ? new OpenAI({
    apiKey: DEEPSEEK_KEY,
    baseURL: "https://api.deepseek.com",
    dangerouslyAllowBrowser: true
  })
  : null;

const SYSTEM_PROMPT = `
You are an expert web developer and UI/UX designer. Your task is to generate or modify high-quality, modern, and responsive website code based on user requests.

CURRENT CODE:
{{CURRENT_CODE}}

Return ONLY a JSON object with the following structure:
{
  "html": "string (the updated content that goes inside the body tag)",
  "css": "string (the updated full CSS code)",
  "js": "string (updated javascript)",
  "explanation": "string (a brief explanation of what you changed)"
}

Guidelines:
1. If "CURRENT CODE" is empty, generate a full website.
2. If "CURRENT CODE" is provided, modify it intelligently based on the user's request. Keep existing parts unless asked to change them.
3. Use modern CSS (Flexbox, Grid, CSS Variables).
4. Ensure the design is fully responsive and looks premium.
5. Don't include <html>, <head>, or <body> tags.
6. Use placeholder images: https://images.unsplash.com/photo-...
7. Maintain a consistent aesthetic.
8. Be precise and concise.
`;

export const generateWithGemini = async (prompt, currentCode = null) => {
  if (!GEMINI_KEY || GEMINI_KEY === "your_gemini_api_key_here") {
    throw new Error("Gemini API key is not configured.");
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const formattedCode = currentCode
      ? `HTML:\n${currentCode.html}\n\nCSS:\n${currentCode.css}\n\nJS:\n${currentCode.js}`
      : "None";
    const fullPrompt = SYSTEM_PROMPT.replace("{{CURRENT_CODE}}", formattedCode);
    const result = await model.generateContent([fullPrompt, prompt]);
    const response = await result.response;
    const text = response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    throw new Error("Could not parse AI response.");
  } catch (error) {
    if (error.message.includes('404')) {
      throw new Error("Gemini model not found (404). This can happen if the model name is restricted for your API key. Please switch to the 'DEEPSEEK' provider in the Settings sidebar — it's already configured with your key!");
    }
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const generateWithDeepSeek = async (prompt, currentCode = null) => {
  if (!openai) {
    throw new Error("DeepSeek API key is not configured correctly in .env file.");
  }

  try {
    const formattedCode = currentCode
      ? `HTML:\n${currentCode.html}\n\nCSS:\n${currentCode.css}\n\nJS:\n${currentCode.js}`
      : "None";
    const fullPrompt = SYSTEM_PROMPT.replace("{{CURRENT_CODE}}", formattedCode);

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant that source code in JSON format." },
        { role: "user", content: `${fullPrompt}\n\nUser Request: ${prompt}` }
      ],
      model: "deepseek-chat",
      response_format: { type: "json_object" }
    });

    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error("DeepSeek API Error:", error);
    throw error;
  }
};

export const generateSite = async (prompt, currentCode = null, provider = 'gemini') => {
  if (provider === 'deepseek') {
    return await generateWithDeepSeek(prompt, currentCode);
  }
  return await generateWithGemini(prompt, currentCode);
};

// Legacy support
export const interpretPrompt = (prompt) => {
  return { type: 'custom', originalPrompt: prompt };
};
