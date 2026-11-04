import { NextResponse } from "next/server";
import { generateTurn } from "@/lib/debate";

export const runtime = "nodejs";
export const maxDuration = 60;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

// Viewers of a live debate call this now and then. It adds at most one turn every 35 seconds.
export async function POST(req: Request) {
  const { id } = (await req.json().catch(() => ({}))) as { id?: string };
  if (!id || !UUID.test(id)) return NextResponse.json({ error: "Bad request." }, { status: 400 });
  const r = await generateTurn(id, false);
  return NextResponse.json({ state: r.state });
}
