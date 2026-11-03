"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Req = { id: string; display_name: string; request: string; prayer_count: number; created_at: string };

const ago = (iso: string) => {
  const mins = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (mins < 60) return `${mins} min ago`;
  const h = Math.round(mins / 60);
  if (h < 24) return `${h} hour${h === 1 ? "" : "s"} ago`;
  const d = Math.round(h / 24);
  return `${d} day${d === 1 ? "" : "s"} ago`;
};

export default function PrayerWall() {
  const [supabase] = useState(() => createClient());
  const [items, setItems] = useState<Req[]>([]);
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [prayed, setPrayed] = useState<Set<string>>(new Set());

  async function load() {
    const { data } = await supabase
      .from("prayer_requests")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    setItems((data as Req[]) ?? []);
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setSignedIn(!!data.user));
    try {
      setPrayed(new Set(JSON.parse(localStorage.getItem("prayed") ?? "[]")));
    } catch {
      // storage unavailable
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function post(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !text.trim()) return;
    setBusy(true);
    const { error } = await supabase.from("prayer_requests").insert({
      user_id: user.id,
      display_name: name.trim().slice(0, 40) || "Anonymous",
      request: text.trim().slice(0, 500),
    });
    setBusy(false);
    if (error) {
      setMsg("Could not post. Please try again.");
      return;
    }
    setText("");
    setMsg("Your request is on the wall. We are praying with you.");
    load();
  }

  async function pray(id: string) {
    if (prayed.has(id)) return;
    const next = new Set(prayed).add(id);
    setPrayed(next);
    try {
      localStorage.setItem("prayed", JSON.stringify([...next]));
    } catch {
      // storage unavailable
    }
    await supabase.rpc("pray_for", { request_id: id });
    load();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,22rem)_1fr]">
      <div>
        {signedIn === false ? (
          <div className="card">
            <h2 className="text-2xl font-semibold text-glow">Share a request</h2>
            <p className="mt-2 text-ivory/70">Sign in to post a prayer request and let others pray with you.</p>
            <Link href="/login" className="btn mt-4">Sign in</Link>
          </div>
        ) : (
          <form onSubmit={post} className="card space-y-3 lg:sticky lg:top-24">
            <h2 className="text-2xl font-semibold text-glow">Share a request</h2>
            <input className="input" maxLength={40} placeholder="Name (leave empty to stay anonymous)" value={name} onChange={(e) => setName(e.target.value)} />
            <textarea className="input" rows={4} maxLength={500} required placeholder="What would you like prayer for?" value={text} onChange={(e) => setText(e.target.value)} />
            <div className="flex items-center justify-between text-xs text-ivory/50">
              <span>Requests are public. Do not share private details.</span>
              <span>{text.length}/500</span>
            </div>
            <button className="btn" disabled={busy || signedIn === null}>{busy ? "Posting…" : "Post request"}</button>
            {msg && <p className="text-sm text-gold" role="status">{msg}</p>}
          </form>
        )}
      </div>

      <div className="space-y-3">
        {!items.length && <p className="card text-ivory/70">No requests yet. Be the first to share one.</p>}
        {items.map((r) => (
          <article key={r.id} className="card">
            <div className="flex items-baseline justify-between gap-3">
              <p className="font-semibold text-gold">{r.display_name}</p>
              <p className="text-xs text-ivory/50">{ago(r.created_at)}</p>
            </div>
            <p className="mt-2 whitespace-pre-wrap text-ivory/90">{r.request}</p>
            <button
              onClick={() => pray(r.id)}
              disabled={prayed.has(r.id)}
              className="chip mt-3 !px-4 !py-1 text-sm"
            >
              {prayed.has(r.id) ? "You prayed" : "I prayed for this"} · {r.prayer_count}
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
