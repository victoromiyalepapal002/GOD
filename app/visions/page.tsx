"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Item = { id: string; kind: string; content: string; created_at: string };

export default function Visions() {
  const [kind, setKind] = useState<"vision" | "horoscope">("vision");
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [focus, setFocus] = useState("");
  const [result, setResult] = useState("");
  const [busy, setBusy] = useState(false);
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [history, setHistory] = useState<Item[]>([]);

  async function loadHistory() {
    const { data } = await createClient()
      .from("visions").select("*").order("created_at", { ascending: false }).limit(10);
    setHistory((data as Item[]) ?? []);
  }

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => {
      setSignedIn(!!data.user);
      if (data.user) loadHistory();
    });
  }, []);

  async function generate(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setResult("");
    const res = await fetch("/api/vision", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, name, birthDate, focus }),
    });
    const data = await res.json();
    setResult(data.content ?? data.error ?? "Something went wrong.");
    setBusy(false);
    loadHistory();
  }

  return (
    <div className="py-8">
      <h1 className="mb-1 text-3xl font-bold text-gold">Visions & Horoscope</h1>
      <p className="mb-4 text-white/70">For encouragement and reflection, not certain prediction.</p>

      {signedIn === false ? (
        <div className="card">Please <a className="text-gold underline" href="/login">sign in</a> to receive your word.</div>
      ) : (
        <form onSubmit={generate} className="card space-y-3">
          <div className="flex gap-2">
            {(["vision", "horoscope"] as const).map((k) => (
              <button type="button" key={k} onClick={() => setKind(k)}
                className={`rounded-full px-4 py-1 ${kind === k ? "bg-gold text-night" : "border border-white/20"}`}>
                {k === "vision" ? "Vision" : "Horoscope"}
              </button>
            ))}
          </div>
          <input className="input" required placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="input" required type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
          <textarea className="input" rows={3} placeholder="What are you praying or hoping for this season?" value={focus} onChange={(e) => setFocus(e.target.value)} />
          <button className="btn" disabled={busy}>{busy ? "Seeking…" : "Receive"}</button>
        </form>
      )}

      {result && <div className="card mt-6 whitespace-pre-wrap text-lg">{result}</div>}

      {history.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-2 text-xl text-gold">Your past words</h2>
          <div className="space-y-3">
            {history.map((h) => (
              <div key={h.id} className="card text-sm">
                <p className="mb-1 text-xs uppercase text-white/50">{h.kind} · {new Date(h.created_at).toLocaleDateString()}</p>
                <p className="whitespace-pre-wrap">{h.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
