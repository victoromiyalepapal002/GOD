import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/admin";

export const runtime = "nodejs";

async function guard() {
  const { data: { user } } = await createClient().auth.getUser();
  return isAdmin(user);
}

// Admin sees every method, including disabled ones.
export async function GET() {
  if (!(await guard())) return NextResponse.json({ error: "Not allowed." }, { status: 403 });
  const db = createAdminClient();
  const [m, s] = await Promise.all([
    db.from("giving_methods").select("*").order("sort_order", { ascending: true }),
    db.from("giving_settings").select("intro").eq("id", 1).maybeSingle(),
  ]);
  if (m.error) {
    return NextResponse.json(
      { error: "Could not load giving settings. Run supabase/giving.sql in Supabase first." },
      { status: 500 }
    );
  }
  return NextResponse.json({ intro: s.data?.intro ?? "", methods: m.data ?? [] });
}

type Incoming = {
  id?: string;
  label: string;
  category: "both" | "tithe" | "donation";
  url?: string;
  details?: string;
  enabled: boolean;
};

export async function PUT(req: Request) {
  if (!(await guard())) return NextResponse.json({ error: "Not allowed." }, { status: 403 });

  const body = (await req.json()) as { intro: string; methods: Incoming[] };
  if (!Array.isArray(body.methods) || body.methods.length > 20) {
    return NextResponse.json({ error: "Add up to 20 giving methods." }, { status: 400 });
  }

  const clean: (Incoming & { sort_order: number })[] = [];
  for (let i = 0; i < body.methods.length; i++) {
    const m = body.methods[i];
    const label = String(m.label ?? "").trim().slice(0, 80);
    const url = String(m.url ?? "").trim().slice(0, 500);
    const details = String(m.details ?? "").trim().slice(0, 600);
    if (!label) return NextResponse.json({ error: `Method ${i + 1}: add a name.` }, { status: 400 });
    if (!url && !details) {
      return NextResponse.json({ error: `"${label}": add a payment link or account details.` }, { status: 400 });
    }
    if (url && !/^https:\/\//i.test(url)) {
      return NextResponse.json({ error: `"${label}": the link must start with https://` }, { status: 400 });
    }
    clean.push({
      id: m.id,
      label,
      url: url || undefined,
      details: details || undefined,
      category: ["both", "tithe", "donation"].includes(m.category) ? m.category : "both",
      enabled: !!m.enabled,
      sort_order: i,
    });
  }

  const db = createAdminClient();

  // Remove methods that were deleted in the editor
  const keep = clean.filter((m) => m.id).map((m) => m.id as string);
  const existing = await db.from("giving_methods").select("id");
  if (existing.error) return NextResponse.json({ error: existing.error.message }, { status: 500 });
  const toDelete = (existing.data ?? []).map((r) => r.id as string).filter((id) => !keep.includes(id));
  if (toDelete.length) {
    const del = await db.from("giving_methods").delete().in("id", toDelete);
    if (del.error) return NextResponse.json({ error: del.error.message }, { status: 500 });
  }

  const now = new Date().toISOString();
  for (const m of clean) {
    const row = {
      label: m.label,
      category: m.category,
      url: m.url ?? null,
      details: m.details ?? null,
      enabled: m.enabled,
      sort_order: m.sort_order,
      updated_at: now,
    };
    const res = m.id
      ? await db.from("giving_methods").update(row).eq("id", m.id)
      : await db.from("giving_methods").insert(row);
    if (res.error) return NextResponse.json({ error: res.error.message }, { status: 500 });
  }

  const intro = String(body.intro ?? "").trim().slice(0, 400);
  const s = await db.from("giving_settings").upsert({ id: 1, intro, updated_at: now });
  if (s.error) return NextResponse.json({ error: s.error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
