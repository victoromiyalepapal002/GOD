"use client";
import { useCallback, useEffect, useState } from "react";

type Item = { id: string; topic: string; status: "upcoming" | "live" | "finished"; rounds: number; scheduled_for: string | null; turns: number };

export default function DebateAdmin() {
  const [items, setItems] = useState<Item[] | null>(null);
  const [topic, setTopic] = useState("");
  const [rounds, setRounds] = useState(4);
  const [when, setWhen] = useState("");
  const [msg, setMsg] = useState("");
  const [working, setWorking] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/debates");
    const data = await res.json();
    if (!res.ok) return setMsg(data.error ?? "Could not load.");
    setItems(data.items);
  }, []);
  useEffect(() => { load(); }, [load]);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    const res = await fetch("/api/admin/debates", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, rounds, scheduled_for: when || null }),
    });
    const data = await res.json();
    if (!res.ok) return setMsg(data.error ?? "Could not save.");
    setTopic(""); setWhen("");
    load();
  }

  async function act(id: string, action: "live" | "finish" | "reset" | "turn") {
    const res = await fetch("/api/admin/debates", {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, action }),
    });
    return (await res.json()) as { state?: string; message?: string; finished?: boolean; error?: string };
  }

  // Writes every remaining turn, one request at a time, so no request runs too long.
  async function runAll(it: Item) {
    setMsg(""); setWorking(it.id);
    if (it.status !== "live") await act(it.id, "live");
    for (let i = 0; i < it.rounds * 2 + 2; i++) {
      const r = await act(it.id, "turn");
      await load();
      if (r.state === "error") { setMsg(r.message ?? "The AI could not answer. Check the AI keys above."); break; }
      if (r.state === "done" || r.state === "notlive" || r.finished) break;
      if (r.state === "wait") await new Promise((ok) => setTimeout(ok, 3000));
    }
    setWorking(null);
    load();
  }

  async function simple(id: string, action: "live" | "finish" | "reset") {
    setMsg("");
    if (action === "reset" && !confirm("Delete all speeches and start this debate over?")) return;
    await act(id, action);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this debate for good?")) return;
    await fetch("/api/admin/debates", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    load();
  }

  return (
    <div className="space-y-8">
      <form onSubmit={create} className="card max-w-2xl space-y-3">
        <input className="input" required minLength={5} maxLength={200} placeholder="Topic, e.g. Is it wrong to want riches?" value={topic} onChange={(e) => setTopic(e.target.value)} />
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm text-ivory/70">Rounds (each round is one speech from each side)
            <input className="input mt-1" type="number" min={1} max={8} value={rounds} onChange={(e) => setRounds(Number(e.target.value))} />
          </label>
          <label className="text-sm text-ivory/70">Planned date (optional, shows under &quot;Up next&quot;)
            <input className="input mt-1" type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} />
          </label>
        </div>
        <button className="btn">Add topic</button>
      </form>

      {msg && <p className="text-sm text-red-300" role="alert">{msg}</p>}

      {!items ? <div className="skeleton h-24 w-full" /> : items.length === 0 ? <p className="text-ivory/60">No debates yet.</p> : (
        <ul className="space-y-3">
          {items.map((it) => (
            <li key={it.id} className="card">
              <p className="font-semibold">{it.topic}</p>
              <p className="mt-1 text-xs text-ivory/55">
                {it.status === "live" ? "Live now" : it.status === "finished" ? "Finished" : "Up next"} · {it.turns} of {it.rounds * 2} speeches
                {it.scheduled_for && ` · planned ${new Date(it.scheduled_for).toLocaleString()}`}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {it.status !== "finished" && (
                  <button className="btn !px-4 !py-1 text-sm" disabled={working !== null} onClick={() => runAll(it)}>
                    {working === it.id ? "Writing…" : it.status === "live" ? "Write remaining speeches" : "Start and write all"}
                  </button>
                )}
                {it.status === "upcoming" && <button className="btn-ghost !px-4 !py-1 text-sm" onClick={() => simple(it.id, "live")}>Go live (viewers advance it)</button>}
                {it.status === "live" && <button className="btn-ghost !px-4 !py-1 text-sm" onClick={() => simple(it.id, "finish")}>End now</button>}
                <button className="btn-ghost !px-4 !py-1 text-sm" onClick={() => simple(it.id, "reset")}>Start over</button>
                <button className="btn-ghost !px-4 !py-1 text-sm" onClick={() => remove(it.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
