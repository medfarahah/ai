import OpenAI from "openai";

const OPENROUTER_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

const openrouter_client = OPENROUTER_KEY ? new OpenAI({
  apiKey: OPENROUTER_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
  defaultHeaders: {
    'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : '',
    'X-Title': 'Vizion AI',
  }
}) : null;

const SYSTEM_PROMPT = `You are a web developer. Generate website code in JSON format.
{
  "html": "body content",
  "css": "css styles",
  "js": "scripts",
  "explanation": "overview"
}
ONLY return the JSON object.`;

export const generateWithOpenRouter = async (prompt, currentCode = null) => {
  if (!openrouter_client) throw new Error("OpenRouter not configured. Please check your VITE_OPENROUTER_API_KEY in .env");

  try {
    const formattedCode = currentCode ? JSON.stringify(currentCode) : "None";
    const completion = await openrouter_client.chat.completions.create({
      model: 'google/gemini-2.0-flash-001',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Current Code: ${formattedCode}\n\nUser Request: ${prompt}` },
      ],
    });

    const content = completion.choices[0]?.message?.content || "";
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    throw new Error("AI response was not valid JSON. Please try again.");
  } catch (error) {
    console.error("OpenRouter Error:", error);
    if (error.status === 404) {
      throw new Error("OpenRouter endpoint error. The selected model might be unavailable.");
    }
    throw new Error(error.message || "Site generation failed.");
  }
};

export const generateSite = async (prompt, currentCode = null) => {
  return await generateWithOpenRouter(prompt, currentCode);
};
