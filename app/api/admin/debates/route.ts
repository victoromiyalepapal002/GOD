import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/admin";
import { generateTurn } from "@/lib/debate";

export const runtime = "nodejs";
export const maxDuration = 60;

async function guard() {
  const { data: { user } } = await createClient().auth.getUser();
  return isAdmin(user);
}
const no = () => NextResponse.json({ error: "Not allowed." }, { status: 403 });

export async function GET() {
  if (!(await guard())) return no();
  const db = createAdminClient();
  const { data, error } = await db
    .from("debates")
    .select("id, topic, status, rounds, scheduled_for, created_at, debate_turns(count)")
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) return NextResponse.json({ error: "Could not load. Run supabase/content.sql in Supabase first." }, { status: 500 });
  type Row = { id: string; topic: string; status: string; rounds: number; scheduled_for: string | null; created_at: string; debate_turns: { count: number }[] };
  const items = ((data ?? []) as unknown as Row[]).map((r) => ({
    id: r.id, topic: r.topic, status: r.status, rounds: r.rounds, scheduled_for: r.scheduled_for,
    turns: r.debate_turns?.[0]?.count ?? 0,
  }));
  return NextResponse.json({ items });
}

// Create a debate topic.
export async function POST(req: Request) {
  if (!(await guard())) return no();
  const b = (await req.json()) as { topic?: string; rounds?: number; scheduled_for?: string | null };
  const topic = (b.topic ?? "").trim();
  if (topic.length < 5 || topic.length > 200) return NextResponse.json({ error: "Write a topic of 5 to 200 characters." }, { status: 400 });
  const rounds = Math.min(8, Math.max(1, Math.round(Number(b.rounds) || 4)));
  const when = b.scheduled_for ? new Date(b.scheduled_for) : null;
  const { error } = await createAdminClient().from("debates").insert({
    topic, rounds, scheduled_for: when && !isNaN(when.getTime()) ? when.toISOString() : null,
  });
  if (error) return NextResponse.json({ error: "Could not save." }, { status: 500 });
  return NextResponse.json({ ok: true });
}

// action: live | finish | reset | turn
export async function PATCH(req: Request) {
  if (!(await guard())) return no();
  const { id, action } = (await req.json()) as { id?: string; action?: string };
  if (!id) return NextResponse.json({ error: "Bad request." }, { status: 400 });
  const db = createAdminClient();
  if (action === "live") {
    await db.from("debates").update({ status: "live", started_at: new Date().toISOString(), finished_at: null }).eq("id", id);
    return NextResponse.json({ ok: true });
  }
  if (action === "finish") {
    await db.from("debates").update({ status: "finished", finished_at: new Date().toISOString() }).eq("id", id);
    return NextResponse.json({ ok: true });
  }
  if (action === "reset") {
    await db.from("debate_turns").delete().eq("debate_id", id);
    await db.from("debates").update({ status: "upcoming", started_at: null, finished_at: null, lock_until: null }).eq("id", id);
    return NextResponse.json({ ok: true });
  }
  if (action === "turn") {
    const r = await generateTurn(id, true);
    return NextResponse.json(r);
  }
  return NextResponse.json({ error: "Unknown action." }, { status: 400 });
}

export async function DELETE(req: Request) {
  if (!(await guard())) return no();
  const { id } = (await req.json()) as { id?: string };
  if (!id) return NextResponse.json({ error: "Bad request." }, { status: 400 });
  await createAdminClient().from("debates").delete().eq("id", id);
  return NextResponse.json({ ok: true });
}
