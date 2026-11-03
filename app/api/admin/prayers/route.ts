import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/admin";

export const runtime = "nodejs";

async function guard() {
  const { data: { user } } = await createClient().auth.getUser();
  return isAdmin(user);
}

// Newest first, including hidden ones, so an admin can review everything.
export async function GET() {
  if (!(await guard())) return NextResponse.json({ error: "Not allowed." }, { status: 403 });
  const { data, error } = await createAdminClient()
    .from("prayer_requests")
    .select("id, display_name, request, prayer_count, hidden, created_at")
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) {
    return NextResponse.json({ error: "Could not load. Run supabase/content.sql in Supabase first." }, { status: 500 });
  }
  return NextResponse.json({ items: data ?? [] });
}

// Hide or show one request.
export async function PATCH(req: Request) {
  if (!(await guard())) return NextResponse.json({ error: "Not allowed." }, { status: 403 });
  const { id, hidden } = (await req.json()) as { id?: string; hidden?: boolean };
  if (!id || typeof hidden !== "boolean") return NextResponse.json({ error: "Bad request." }, { status: 400 });
  const { error } = await createAdminClient().from("prayer_requests").update({ hidden }).eq("id", id);
  if (error) return NextResponse.json({ error: "Could not update." }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  if (!(await guard())) return NextResponse.json({ error: "Not allowed." }, { status: 403 });
  const { id } = (await req.json()) as { id?: string };
  if (!id) return NextResponse.json({ error: "Bad request." }, { status: 400 });
  const { error } = await createAdminClient().from("prayer_requests").delete().eq("id", id);
  if (error) return NextResponse.json({ error: "Could not delete." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
