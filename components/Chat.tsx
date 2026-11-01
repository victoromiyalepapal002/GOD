"use client";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PERSONAS, type Persona } from "@/lib/personas";

type Msg = { role: "user" | "assistant"; content: string };

export default function Chat({ persona }: { persona: Persona }) {
  const p = PERSONAS[persona];
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "assistant", content: p.greeting }]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      setSignedIn(!!data.user);
      if (!data.user) return;
      const { data: rows } = await supabase
        .from("chat_messages")
        .select("role, content")
        .eq("persona", persona)
        .order("created_at", { ascending: true })
        .limit(100);
      if (rows?.length) setMsgs([{ role: "assistant", content: p.greeting }, ...(rows as Msg[])]);
    });
  }, [persona, p.greeting]);

  useEffect(() => bottom.current?.scrollIntoView({ behavior: "smooth" }), [msgs]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    setBusy(true);
    setMsgs((m) => [...m, { role: "user", content: text }]);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ persona, message: text }),
      });
      const data = await res.json();
      setMsgs((m) => [...m, { role: "assistant", content: data.reply ?? data.error ?? "Something went wrong." }]);
    } catch {
      setMsgs((m) => [...m, { role: "assistant", content: "Connection problem. Please try again." }]);
    }
    setBusy(false);
  }

  if (signedIn === false) {
    return (
      <div className="card text-center">
        <p>Please <a className="text-gold underline" href="/login">sign in</a> to talk with {p.name}.</p>
      </div>
    );
  }

  return (
    <div className="card flex h-[65vh] flex-col">
      <div className="flex-1 space-y-3 overflow-y-auto pr-1">
        {msgs.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-right" : ""}>
            <span
              className={`inline-block max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2 text-left ${
                m.role === "user" ? "bg-gold text-night" : "bg-white/10"
              }`}
            >
              {m.content}
            </span>
          </div>
        ))}
        {busy && <p className="text-sm text-white/50">…</p>}
        <div ref={bottom} />
      </div>
      <form onSubmit={send} className="mt-3 flex gap-2">
        <input className="input" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type here…" />
        <button className="btn" disabled={busy}>Send</button>
      </form>
    </div>
  );
}
