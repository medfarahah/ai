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

export const generateWithOpenRouter = async (prompt, currentCode = null, history = []) => {
  if (!OPENROUTER_KEY) throw new Error("OpenRouter not configured. Please check your VITE_OPENROUTER_API_KEY in .env");

  try {
    const formattedCode = currentCode ? JSON.stringify(currentCode) : "None";

    // Construct messages including history
    // Filter history to ensure it's in the correct format for OpenRouter
    const formattedHistory = history.map(msg => ({
      role: msg.role,
      content: msg.content,
      ...(msg.reasoning_details ? { reasoning_details: msg.reasoning_details } : {})
    }));

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...formattedHistory,
      { role: 'user', content: `Current Code: ${formattedCode}\n\nUser Request: ${prompt}` },
    ];

    // Using fetch directly as requested to better handle the custom 'reasoning' parameter
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": typeof window !== 'undefined' ? window.location.origin : '',
        "X-Title": "Vizion AI",
      },
      body: JSON.stringify({
        "model": "deepseek/deepseek-v3.2-speciale",
        "messages": messages,
        "reasoning": { "enabled": true }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `API Error: ${response.status}`);
    }

    const result = await response.json();
    const assistantMessage = result.choices[0].message;
    const content = assistantMessage.content || "";

    // We export the reasoning_details so the UI can save them
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        ...parsed,
        _raw_message: assistantMessage // Include the full message for history preservation
      };
    }
    throw new Error("AI response was not valid JSON. Please try again.");
  } catch (error) {
    console.error("OpenRouter Error:", error);
    throw new Error(error.message || "Site generation failed.");
  }
};

export const generateSite = async (prompt, currentCode = null, history = []) => {
  return await generateWithOpenRouter(prompt, currentCode, history);
};
