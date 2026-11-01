import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";
import { PROVIDER_IDS, callProvider, loadProviders, type ProviderId } from "@/lib/llm";

export const runtime = "nodejs";
export const maxDuration = 30;

// Sends one tiny message to a single provider using its saved settings.
export async function POST(req: Request) {
  const { data: { user } } = await createClient().auth.getUser();
  if (!isAdmin(user)) return NextResponse.json({ error: "Not allowed." }, { status: 403 });

  const { id } = (await req.json()) as { id: ProviderId };
  if (!PROVIDER_IDS.includes(id)) return NextResponse.json({ error: "Bad request." }, { status: 400 });

  const row = (await loadProviders()).find((p) => p.id === id);
  if (!row) return NextResponse.json({ ok: false, message: "Provider not found." });

  const started = Date.now();
  try {
    const text = await callProvider(row, [{ role: "user", content: "Reply with one short sentence: Peace be with you." }], 60);
    return NextResponse.json({ ok: true, ms: Date.now() - started, sample: text.slice(0, 120) });
  } catch (e) {
    return NextResponse.json({ ok: false, message: (e as Error).message });
  }
}
