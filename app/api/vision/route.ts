import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5";

const PROMPTS = {
  vision: `Write a short, personal "vision" for the person: a hopeful, Scripture-rooted word of encouragement about the season ahead, using their name, focus and birth date as inspiration. 120-180 words. Include one accurate Bible verse.`,
  horoscope: `Write a short, light-hearted "horoscope-style" reading using their zodiac sign (from the birth date), framed as reflection and encouragement. 100-150 words. End with one accurate Bible verse for the day.`,
};

export async function POST(req: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Please sign in." }, { status: 401 });

  const { kind, name, birthDate, focus } = await req.json();
  if (!(kind in PROMPTS)) return NextResponse.json({ error: "Bad request." }, { status: 400 });

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const res = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 500,
    system: `${PROMPTS[kind as keyof typeof PROMPTS]}
This is for inspiration and entertainment only. Never present it as a certain prediction and never give medical, legal or financial instructions. Do not claim divine authority.`,
    messages: [{
      role: "user",
      content: `Name: ${String(name).slice(0, 80)}\nBirth date: ${String(birthDate).slice(0, 20)}\nFocus for this season: ${String(focus ?? "").slice(0, 300)}\nToday: ${new Date().toDateString()}`,
    }],
  });
  const content = res.content.map((b) => (b.type === "text" ? b.text : "")).join("");

  await supabase.from("visions").insert({ user_id: user.id, kind, content });
  return NextResponse.json({ content });
}
