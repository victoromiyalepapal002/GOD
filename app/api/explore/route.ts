import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { REALMS, type Realm } from "@/lib/realms";
import { REALM_PROMPTS } from "@/lib/realmPrompts";
import { chatComplete, LlmError, type LlmMessage } from "@/lib/llm";

export const runtime = "nodejs";
export const maxDuration = 60;

type In = { role: "user" | "assistant"; content: string };

export async function POST(req: Request) {
  const { data: { user } } = await createClient().auth.getUser();
  if (!user) return NextResponse.json({ error: "Please sign in." }, { status: 401 });

  const body = (await req.json()) as { realm: Realm; messages: In[] };
  if (!(body.realm in REALMS) || !Array.isArray(body.messages) || !body.messages.length) {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  // Keep the last 8 turns, trimmed, and make sure the last one is from the user.
  const turns = body.messages
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-8)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 1500) }));
  if (!turns.length || turns[turns.length - 1].role !== "user") {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  const messages: LlmMessage[] = [{ role: "system", content: REALM_PROMPTS[body.realm] }, ...turns];

  try {
    const { text } = await chatComplete(messages, 700);
    return NextResponse.json({ reply: text });
  } catch (e) {
    const err = e instanceof LlmError ? e : new LlmError("Something went wrong.", 500);
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
}
