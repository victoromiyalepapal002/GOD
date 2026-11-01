import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { PERSONAS, type Persona } from "@/lib/personas";

export const runtime = "nodejs";
const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5";

export async function POST(req: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Please sign in." }, { status: 401 });

  const { persona, message } = (await req.json()) as { persona: Persona; message: string };
  if (!PERSONAS[persona] || !message?.trim()) {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  // Last 20 messages as context
  const { data: history } = await supabase
    .from("chat_messages")
    .select("role, content")
    .eq("user_id", user.id)
    .eq("persona", persona)
    .order("created_at", { ascending: false })
    .limit(20);
  const messages = [
    ...(history ?? []).reverse().map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
    { role: "user" as const, content: message.slice(0, 2000) },
  ];

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const res = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 600,
    system: PERSONAS[persona].system,
    messages,
  });
  const reply = res.content.map((b) => (b.type === "text" ? b.text : "")).join("");

  await supabase.from("chat_messages").insert([
    { user_id: user.id, persona, role: "user", content: message.slice(0, 2000) },
    { user_id: user.id, persona, role: "assistant", content: reply },
  ]);

  return NextResponse.json({ reply });
}
