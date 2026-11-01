import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/admin";
import { ENV_KEYS, PROVIDER_IDS, loadProviders, type ProviderId } from "@/lib/llm";

export const runtime = "nodejs";

async function guard() {
  const { data: { user } } = await createClient().auth.getUser();
  return isAdmin(user);
}

// Never send saved keys to the browser: only whether one exists and its last 4 characters.
export async function GET() {
  if (!(await guard())) return NextResponse.json({ error: "Not allowed." }, { status: 403 });
  try {
    const rows = await loadProviders();
    return NextResponse.json({
      providers: rows.map((p) => {
        const saved = p.api_key?.trim() || "";
        const fromEnv = !saved && !!process.env[ENV_KEYS[p.id]];
        return {
          id: p.id,
          name: p.name,
          base_url: p.base_url,
          model: p.model,
          enabled: p.enabled,
          priority: p.priority,
          hasKey: !!saved || fromEnv,
          keySource: saved ? "saved" : fromEnv ? "env" : "none",
          keyHint: saved ? `…${saved.slice(-4)}` : "",
        };
      }),
    });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

type Incoming = {
  id: ProviderId;
  model: string;
  base_url: string;
  enabled: boolean;
  priority: number;
  api_key?: string; // only sent when the admin typed a new key
  clearKey?: boolean;
};

export async function PUT(req: Request) {
  if (!(await guard())) return NextResponse.json({ error: "Not allowed." }, { status: 403 });

  const { providers } = (await req.json()) as { providers: Incoming[] };
  if (!Array.isArray(providers)) return NextResponse.json({ error: "Bad request." }, { status: 400 });

  const db = createAdminClient();
  for (const p of providers) {
    if (!PROVIDER_IDS.includes(p.id)) continue;
    const model = String(p.model ?? "").trim().slice(0, 200);
    const base = String(p.base_url ?? "").trim().slice(0, 300);
    if (!model || !/^https:\/\//i.test(base)) {
      return NextResponse.json({ error: `${p.id}: model and an https base URL are required.` }, { status: 400 });
    }
    const update: Record<string, unknown> = {
      model,
      base_url: base,
      enabled: !!p.enabled,
      priority: Math.max(1, Math.min(99, Math.round(Number(p.priority) || 1))),
      updated_at: new Date().toISOString(),
    };
    if (p.clearKey) update.api_key = null;
    else if (typeof p.api_key === "string" && p.api_key.trim()) update.api_key = p.api_key.trim();

    const { error } = await db.from("ai_providers").update(update).eq("id", p.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
