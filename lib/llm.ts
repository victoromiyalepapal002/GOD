// Provider-agnostic chat helper using the OpenAI-compatible /chat/completions format.
// Works with Google Gemini (free tier), Groq (free tier), OpenRouter free models, etc.
// Configure with LLM_API_KEY, LLM_BASE_URL and LLM_MODEL (see .env.example).

export type LlmMessage = { role: "system" | "user" | "assistant"; content: string };

export class LlmError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function chatComplete(messages: LlmMessage[], maxTokens = 800): Promise<string> {
  const key = process.env.LLM_API_KEY;
  if (!key) throw new LlmError("The AI key is not set on the server.", 500);

  const base = (
    process.env.LLM_BASE_URL || "https://generativelanguage.googleapis.com/v1beta/openai"
  ).replace(/\/$/, "");
  const model = process.env.LLM_MODEL || "gemini-2.5-flash-lite";

  const res = await fetch(`${base}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({ model, messages, max_tokens: maxTokens, temperature: 0.8 }),
  });

  if (!res.ok) {
    if (res.status === 429) {
      throw new LlmError("The free AI limit was reached. Please wait a minute and try again.", 429);
    }
    throw new LlmError("The AI could not answer right now. Please try again.", 502);
  }

  const data = await res.json();
  const text: string = data?.choices?.[0]?.message?.content ?? "";
  if (!text.trim()) throw new LlmError("The AI returned an empty answer. Please try again.", 502);
  return text.trim();
}
