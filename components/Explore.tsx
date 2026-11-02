"use client";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { REALMS, type Realm } from "@/lib/realms";

type Msg = { role: "user" | "assistant"; content: string };

export type AskRequest = { text: string; n: number };

export default function Explore({ realm, request }: { realm: Realm; request?: AskRequest }) {
  const cfg = REALMS[realm];
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const bottom = useRef<HTMLDivElement>(null);
  const handled = useRef(0);

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => setSignedIn(!!data.user));
  }, []);
  useEffect(() => {
    if (msgs.length) bottom.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [msgs, busy]);

  // A question sent from outside (for example "Ask the guide about Michael").
  useEffect(() => {
    if (request && request.n > handled.current && signedIn) {
      handled.current = request.n;
      ask(request.text);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request?.n, signedIn]);

  async function ask(text: string) {
    const q = text.trim();
    if (!q || busy) return;
    const next: Msg[] = [...msgs, { role: "user", content: q }];
    setMsgs(next);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/explore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ realm, messages: next }),
      });
      const data = await res.json();
      setMsgs([...next, { role: "assistant", content: data.reply ?? data.error ?? "Something went wrong." }]);
    } catch {
      setMsgs([...next, { role: "assistant", content: "Connection problem. Please try again." }]);
    }
    setBusy(false);
  }

  if (signedIn === false) {
    return (
      <div className="card">
        Please <a className="underline" style={{ color: "var(--accent)" }} href="/login">sign in</a> to explore {cfg.title.toLowerCase()} with the AI guide.
      </div>
    );
  }

  return (
    <div className="card">
      {!msgs.length && (
        <div>
          <p className="mb-3 text-ivory/70">{cfg.greeting}</p>
          <div className="flex flex-wrap gap-2">
            {cfg.topics.map((t) => (
              <button key={t} type="button" onClick={() => ask(t)} disabled={busy || signedIn === null} className="chip">
                {t}
              </button>
            ))}
          </div>
        </div>
      )}

      {!!msgs.length && (
        <div className="max-h-[55vh] space-y-3 overflow-y-auto pr-1">
          {msgs.map((m, i) => (
            <div key={i} className={m.role === "user" ? "text-right" : ""}>
              <span
                className={`inline-block max-w-[92%] whitespace-pre-wrap rounded-2xl px-4 py-2 text-left ${
                  m.role === "user" ? "bubble-user" : "bg-white/10"
                }`}
              >
                {m.content}
              </span>
            </div>
          ))}
          {busy && <p className="text-sm text-ivory/50">Searching the Scriptures…</p>}
          <div ref={bottom} />
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
        className="mt-4 flex gap-2"
      >
        <input
          className="input"
          value={input}
          maxLength={1500}
          onChange={(e) => setInput(e.target.value)}
          placeholder={cfg.placeholder}
          aria-label={cfg.placeholder}
        />
        <button className="btn" disabled={busy || signedIn === null}>Ask</button>
      </form>

      {!!msgs.length && (
        <button type="button" className="mt-3 text-sm text-ivory/55 underline" onClick={() => setMsgs([])}>
          Start over with new questions
        </button>
      )}
    </div>
  );
}
