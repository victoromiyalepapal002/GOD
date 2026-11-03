import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/admin";
import { draftDevotional } from "@/lib/devotional";
import { verseForDate } from "@/lib/verses";

export const runtime = "nodejs";
export const maxDuration = 60;

async function guard() {
  const { data: { user } } = await createClient().auth.getUser();
  return isAdmin(user);
}
const validDate = (d: unknown): d is string => typeof d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d);

// GET ?date=YYYY-MM-DD -> the saved devotional for that day (or null) plus that day's verse.
export async function GET(req: Request) {
  if (!(await guard())) return NextResponse.json({ error: "Not allowed." }, { status: 403 });
  const date = new URL(req.url).searchParams.get("date");
  if (!validDate(date)) return NextResponse.json({ error: "Bad date." }, { status: 400 });
  const v = verseForDate(date);
  const { data, error } = await createAdminClient().from("devotionals").select("*").eq("date", date).maybeSingle();
  if (error) {
    return NextResponse.json({ error: "Could not load. Run supabase/content.sql in Supabase first." }, { status: 500 });
  }
  return NextResponse.json({ devotional: data, verse: { ref: v.ref, text: v.text } });
}

// PUT: save (replaces whatever is there for that date)
export async function PUT(req: Request) {
  if (!(await guard())) return NextResponse.json({ error: "Not allowed." }, { status: 403 });
  const b = await req.json();
  if (!validDate(b.date)) return NextResponse.json({ error: "Bad date." }, { status: 400 });
  const row = {
    date: b.date,
    title: String(b.title ?? "").trim().slice(0, 120),
    verse_ref: String(b.verse_ref ?? "").trim().slice(0, 80),
    verse_text: String(b.verse_text ?? "").trim().slice(0, 1500),
    reflection: String(b.reflection ?? "").trim().slice(0, 4000),
    prayer: String(b.prayer ?? "").trim().slice(0, 1200) || null,
    question: String(b.question ?? "").trim().slice(0, 400) || null,
    source: "admin" as const,
    updated_at: new Date().toISOString(),
  };
  if (!row.title || !row.verse_ref || !row.verse_text || !row.reflection) {
    return NextResponse.json({ error: "Add a title, verse reference, verse text and reflection." }, { status: 400 });
  }
  const { error } = await createAdminClient().from("devotionals").upsert(row, { onConflict: "date" });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

// DELETE ?date= : remove, so the AI writes a fresh one next time the page is opened
export async function DELETE(req: Request) {
  if (!(await guard())) return NextResponse.json({ error: "Not allowed." }, { status: 403 });
  const date = new URL(req.url).searchParams.get("date");
  if (!validDate(date)) return NextResponse.json({ error: "Bad date." }, { status: 400 });
  const { error } = await createAdminClient().from("devotionals").delete().eq("date", date);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

// POST {date}: ask the AI for a draft (not saved) so the admin can edit it
export async function POST(req: Request) {
  if (!(await guard())) return NextResponse.json({ error: "Not allowed." }, { status: 403 });
  const { date } = await req.json();
  if (!validDate(date)) return NextResponse.json({ error: "Bad date." }, { status: 400 });
  try {
    return NextResponse.json({ draft: await draftDevotional(date) });
  } catch {
    return NextResponse.json({ error: "The AI could not write a draft. Check the AI settings above and try again." }, { status: 502 });
  }
}
