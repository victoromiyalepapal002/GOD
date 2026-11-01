import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { PERSONAS, type Persona } from "@/lib/personas";
import { chatComplete, LlmError, type LlmMessage } from "@/lib/llm";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Please sign in." }, { status: 401 });

  const { persona, message } = (await req.json()) as { persona: Persona; message: string };
  if (!PERSONAS[persona] || !message?.trim()) {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }
  const text = message.slice(0, 2000);

  // Last 12 messages as context (keeps free-tier usage small)
  const { data: history } = await supabase
    .from("chat_messages")
    .select("role, content")
    .eq("user_id", user.id)
    .eq("persona", persona)
    .order("created_at", { ascending: false })
    .limit(12);

  const messages: LlmMessage[] = [
    { role: "system", content: PERSONAS[persona].system },
    ...(history ?? []).reverse().map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
    { role: "user", content: text },
  ];

  try {
    const { text: reply } = await chatComplete(messages, 800);
    await supabase.from("chat_messages").insert([
      { user_id: user.id, persona, role: "user", content: text },
      { user_id: user.id, persona, role: "assistant", content: reply },
    ]);
    return NextResponse.json({ reply });
  } catch (e) {
    const err = e instanceof LlmError ? e : new LlmError("Something went wrong.", 500);
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
}
