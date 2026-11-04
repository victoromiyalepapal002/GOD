import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { countablePath } from "@/lib/views";

export const runtime = "nodejs";

// POST { path, inc }: counts one view when inc is true, and always returns the page's total.
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { path?: unknown; inc?: unknown };
    const path = countablePath(body.path);
    if (!path) return NextResponse.json({ views: null });
    const db = createAdminClient();
    if (body.inc === true) {
      const { data, error } = await db.rpc("increment_view", { p: path });
      if (error) return NextResponse.json({ views: null });
      return NextResponse.json({ views: Number(data) });
    }
    const { data } = await db.from("page_views").select("views").eq("path", path).maybeSingle();
    return NextResponse.json({ views: data ? Number(data.views) : 0 });
  } catch {
    return NextResponse.json({ views: null });
  }
}
