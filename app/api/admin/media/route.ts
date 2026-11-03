import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/admin";
import { parseMedia } from "@/lib/media";

export const runtime = "nodejs";

async function guard() {
  const { data: { user } } = await createClient().auth.getUser();
  return isAdmin(user);
}

export async function GET() {
  if (!(await guard())) return NextResponse.json({ error: "Not allowed." }, { status: 403 });
  const { data, error } = await createAdminClient()
    .from("media_items").select("*").order("sort_order", { ascending: true });
  if (error) {
    return NextResponse.json({ error: "Could not load. Run supabase/content.sql in Supabase first." }, { status: 500 });
  }
  return NextResponse.json({ items: data ?? [] });
}

type Incoming = {
  id?: string;
  kind: "music" | "sermon";
  title: string;
  artist?: string;
  url: string;
  description?: string;
  enabled: boolean;
};

export async function PUT(req: Request) {
  if (!(await guard())) return NextResponse.json({ error: "Not allowed." }, { status: 403 });
  const body = (await req.json()) as { items: Incoming[] };
  if (!Array.isArray(body.items) || body.items.length > 200) {
    return NextResponse.json({ error: "Add up to 200 items." }, { status: 400 });
  }

  const clean: (Incoming & { sort_order: number })[] = [];
  for (let i = 0; i < body.items.length; i++) {
    const m = body.items[i];
    const title = String(m.title ?? "").trim().slice(0, 120);
    const url = String(m.url ?? "").trim().slice(0, 500);
    if (!title) return NextResponse.json({ error: `Item ${i + 1}: add a title.` }, { status: 400 });
    if (!parseMedia(url)) {
      return NextResponse.json({ error: `"${title}": paste a link that starts with https://` }, { status: 400 });
    }
    clean.push({
      id: m.id,
      kind: m.kind === "sermon" ? "sermon" : "music",
      title,
      artist: String(m.artist ?? "").trim().slice(0, 120) || undefined,
      url,
      description: String(m.description ?? "").trim().slice(0, 400) || undefined,
      enabled: !!m.enabled,
      sort_order: i,
    });
  }

  const db = createAdminClient();
  const keep = clean.filter((m) => m.id).map((m) => m.id as string);
  const existing = await db.from("media_items").select("id");
  if (existing.error) return NextResponse.json({ error: existing.error.message }, { status: 500 });
  const toDelete = (existing.data ?? []).map((r) => r.id as string).filter((id) => !keep.includes(id));
  if (toDelete.length) {
    const del = await db.from("media_items").delete().in("id", toDelete);
    if (del.error) return NextResponse.json({ error: del.error.message }, { status: 500 });
  }

  const now = new Date().toISOString();
  for (const m of clean) {
    const row = {
      kind: m.kind,
      title: m.title,
      artist: m.artist ?? null,
      url: m.url,
      description: m.description ?? null,
      enabled: m.enabled,
      sort_order: m.sort_order,
      updated_at: now,
    };
    const res = m.id
      ? await db.from("media_items").update(row).eq("id", m.id)
      : await db.from("media_items").insert(row);
    if (res.error) return NextResponse.json({ error: res.error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
