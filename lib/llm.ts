// Multi-provider chat with automatic failover.
// Providers (OpenRouter, Gemini, Groq) all speak the OpenAI-compatible /chat/completions format.
// Their model, key, enabled flag and priority live in the ai_providers table (edited on /admin).
// Providers are tried in priority order (lowest number first); if one fails, the next is used.

import { createAdminClient } from "@/lib/supabase/admin";

export type LlmMessage = { role: "system" | "user" | "assistant"; content: string };
export type ProviderId = "openrouter" | "gemini" | "groq";

export const PROVIDER_IDS: ProviderId[] = ["gemini", "groq", "openrouter"];

// Optional fallback keys from environment variables, used when no key is saved in the database.
export const ENV_KEYS: Record<ProviderId, string> = {
  openrouter: "OPENROUTER_API_KEY",
  gemini: "GEMINI_API_KEY",
  groq: "GROQ_API_KEY",
};

export type ProviderRow = {
  id: ProviderId;
  name: string;
  base_url: string;
  model: string;
  api_key: string | null;
  enabled: boolean;
  priority: number;
};

export class LlmError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function loadProviders(): Promise<ProviderRow[]> {
  try {
    const { data, error } = await createAdminClient()
      .from("ai_providers")
      .select("*")
      .order("priority", { ascending: true });
    if (error) throw error;
    return (data ?? []) as ProviderRow[];
  } catch {
    throw new LlmError(
      "AI settings could not be loaded. Check SUPABASE_SERVICE_ROLE_KEY and that supabase/ai_providers.sql was run.",
      500
    );
  }
}

export function keyFor(p: ProviderRow): string | null {
  return p.api_key?.trim() || process.env[ENV_KEYS[p.id]] || null;
}

export async function callProvider(
  p: ProviderRow,
  messages: LlmMessage[],
  maxTokens: number
): Promise<string> {
  const key = keyFor(p);
  if (!key) throw new LlmError(`${p.name} has no API key.`, 400);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${key}`,
  };
  if (p.id === "openrouter") headers["X-Title"] = "GOD";

  let res: Response;
  try {
    res = await fetch(`${p.base_url.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers,
      body: JSON.stringify({ model: p.model, messages, max_tokens: maxTokens, temperature: 0.8 }),
      signal: AbortSignal.timeout(15000),
    });
  } catch {
    throw new LlmError(`${p.name} did not respond in time.`, 504);
  }

  if (!res.ok) {
    let detail = "";
    try {
      const j = await res.json();
      detail = (j?.error?.message ?? j?.[0]?.error?.message ?? "").toString().slice(0, 200);
    } catch {
      // response had no JSON body
    }
    throw new LlmError(`${p.name} returned ${res.status}${detail ? `: ${detail}` : ""}`, res.status);
  }

  const data = await res.json();
  const text: string = data?.choices?.[0]?.message?.content ?? "";
  if (!text.trim()) throw new LlmError(`${p.name} returned an empty answer.`, 502);
  return text.trim();
}

export async function chatComplete(
  messages: LlmMessage[],
  maxTokens = 800
): Promise<{ text: string; provider: ProviderId }> {
  const usable = (await loadProviders()).filter((p) => p.enabled && keyFor(p));
  if (!usable.length) {
    throw new LlmError("No AI is set up yet. An admin can add a free key on the Admin page.", 503);
  }

  const failures: string[] = [];
  let rateLimited = 0;
  for (const p of usable) {
    try {
      const text = await callProvider(p, messages, maxTokens);
      return { text, provider: p.id };
    } catch (e) {
      if (e instanceof LlmError) {
        failures.push(e.message);
        if (e.status === 429) rateLimited++;
      } else {
        failures.push(`${p.name} failed.`);
      }
    }
  }

  console.error("All AI providers failed:", failures);
  if (rateLimited === usable.length) {
    throw new LlmError("The free AI limit was reached. Please wait a minute and try again.", 429);
  }
  throw new LlmError("The AI is unavailable right now. Please try again shortly.", 502);
}
