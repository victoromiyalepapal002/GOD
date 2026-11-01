"use client";
import { useEffect, useState } from "react";

type P = {
  id: string;
  name: string;
  base_url: string;
  model: string;
  enabled: boolean;
  priority: number;
  hasKey: boolean;
  keySource: "saved" | "env" | "none";
  keyHint: string;
  newKey: string;
  clearKey: boolean;
  test?: { state: "idle" | "running" | "ok" | "fail"; text?: string };
};

const KEY_LINKS: Record<string, string> = {
  gemini: "https://aistudio.google.com/apikey",
  groq: "https://console.groq.com/keys",
  openrouter: "https://openrouter.ai/keys",
};

export default function AdminPanel() {
  const [list, setList] = useState<P[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/providers");
    const data = await res.json();
    if (!res.ok) {
      setMsg(data.error ?? "Could not load settings.");
    } else {
      setList(
        (data.providers as P[]).map((p) => ({ ...p, newKey: "", clearKey: false, test: { state: "idle" } }))
      );
    }
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  function patch(id: string, change: Partial<P>) {
    setList((l) => l.map((p) => (p.id === id ? { ...p, ...change } : p)));
  }

  // Move a provider up or down, then renumber priorities 1..n
  function move(index: number, dir: -1 | 1) {
    const j = index + dir;
    if (j < 0 || j >= list.length) return;
    const next = [...list];
    [next[index], next[j]] = [next[j], next[index]];
    setList(next.map((p, i) => ({ ...p, priority: i + 1 })));
  }

  async function save() {
    setBusy(true);
    setMsg("");
    const res = await fetch("/api/admin/providers", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        providers: list.map((p, i) => ({
          id: p.id,
          model: p.model,
          base_url: p.base_url,
          enabled: p.enabled,
          priority: i + 1,
          api_key: p.newKey || undefined,
          clearKey: p.clearKey,
        })),
      }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setMsg(data.error ?? "Could not save.");
      return;
    }
    setMsg("Saved.");
    load();
  }

  async function test(id: string) {
    patch(id, { test: { state: "running" } });
    const res = await fetch("/api/admin/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const data = await res.json();
    patch(id, {
      test: data.ok
        ? { state: "ok", text: `Works (${data.ms} ms): ${data.sample}` }
        : { state: "fail", text: data.message ?? data.error ?? "Failed." },
    });
  }

  if (loading) return <p className="text-ivory/60">Loading…</p>;
  if (!list.length) return <div className="card">{msg || "No providers found. Run supabase/ai_providers.sql first."}</div>;

  return (
    <div className="space-y-4">
      {list.map((p, i) => (
        <div key={p.id} className="card space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-gold font-bold text-night" title="Priority">
                {i + 1}
              </span>
              <h2 className="text-2xl font-semibold text-glow">{p.name}</h2>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" className="btn-ghost !px-3 !py-1" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move ${p.name} up`}>
                ↑
              </button>
              <button type="button" className="btn-ghost !px-3 !py-1" onClick={() => move(i, 1)} disabled={i === list.length - 1} aria-label={`Move ${p.name} down`}>
                ↓
              </button>
              <label className="ml-2 flex items-center gap-2 text-sm">
                <input type="checkbox" checked={p.enabled} onChange={(e) => patch(p.id, { enabled: e.target.checked })} />
                Enabled
              </label>
            </div>
          </div>

          <label className="block text-sm text-ivory/70">
            Model
            <input className="input mt-1" value={p.model} onChange={(e) => patch(p.id, { model: e.target.value })} />
          </label>

          <label className="block text-sm text-ivory/70">
            API key{" "}
            <span className="text-ivory/50">
              {p.keySource === "saved" && `(saved, ends ${p.keyHint})`}
              {p.keySource === "env" && "(using the Vercel environment variable)"}
              {p.keySource === "none" && "(none yet)"}
            </span>
            <input
              className="input mt-1"
              type="password"
              autoComplete="off"
              placeholder={p.hasKey ? "Leave empty to keep the current key" : "Paste your free key"}
              value={p.newKey}
              onChange={(e) => patch(p.id, { newKey: e.target.value, clearKey: false })}
            />
          </label>

          <details className="text-sm text-ivory/70">
            <summary className="cursor-pointer">Advanced: base URL</summary>
            <input className="input mt-2" value={p.base_url} onChange={(e) => patch(p.id, { base_url: e.target.value })} />
          </details>

          <div className="flex flex-wrap items-center gap-3">
            <button type="button" className="btn-ghost !py-1 text-sm" onClick={() => test(p.id)} disabled={p.test?.state === "running"}>
              {p.test?.state === "running" ? "Testing…" : "Test saved settings"}
            </button>
            {p.keySource === "saved" && (
              <button type="button" className="text-sm text-ivory/60 underline" onClick={() => patch(p.id, { clearKey: !p.clearKey, newKey: "" })}>
                {p.clearKey ? "Keep saved key" : "Remove saved key"}
              </button>
            )}
            <a className="text-sm text-gold underline" href={KEY_LINKS[p.id]} target="_blank" rel="noreferrer">
              Get a free key
            </a>
          </div>
          {p.clearKey && <p className="text-sm text-gold">The saved key will be removed when you save.</p>}
          {p.test?.text && (
            <p className={`text-sm ${p.test.state === "ok" ? "text-emerald-300" : "text-rose-300"}`} role="status">
              {p.test.text}
            </p>
          )}
        </div>
      ))}

      <div className="flex flex-wrap items-center gap-4">
        <button className="btn" onClick={save} disabled={busy}>
          {busy ? "Saving…" : "Save changes"}
        </button>
        {msg && <p className="text-sm text-gold" role="status">{msg}</p>}
      </div>
      <p className="text-sm text-ivory/50">
        Save before testing: the test uses the saved settings. Number 1 answers first; if it fails or hits its limit, number 2 answers, then number 3.
      </p>
    </div>
  );
}
