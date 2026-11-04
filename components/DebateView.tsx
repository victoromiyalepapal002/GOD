"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Icon from "@/components/Icon";

export type Turn = { seq: number; speaker: "jesus" | "devil"; body: string };
type Status = "upcoming" | "live" | "finished";

export default function DebateView({ id, initialStatus, rounds, initialTurns }: { id: string; initialStatus: Status; rounds: number; initialTurns: Turn[] }) {
  const [supabase] = useState(() => createClient());
  const [status, setStatus] = useState<Status>(initialStatus);
  const [turns, setTurns] = useState<Turn[]>(initialTurns);
  const end = useRef<HTMLDivElement>(null);
  const total = rounds * 2;

  const refresh = useCallback(async () => {
    const [t, d] = await Promise.all([
      supabase.from("debate_turns").select("seq, speaker, body").eq("debate_id", id).order("seq", { ascending: true }),
      supabase.from("debates").select("status").eq("id", id).maybeSingle(),
    ]);
    if (t.data) setTurns(t.data as Turn[]);
    if (d.data?.status) setStatus(d.data.status as Status);
  }, [supabase, id]);

  // While live: check for new speeches, and nudge the debate forward (the server allows one every 35 seconds).
  useEffect(() => {
    if (status !== "live") return;
    let stop = false;
    const tick = async () => {
      if (stop || document.hidden) return;
      await fetch("/api/debate/advance", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }).catch(() => {});
      await refresh();
    };
    tick();
    const a = setInterval(tick, 12000);
    const b = setInterval(() => !document.hidden && refresh(), 5000);
    return () => { stop = true; clearInterval(a); clearInterval(b); };
  }, [status, id, refresh]);

  const count = turns.length;
  useEffect(() => {
    if (status === "live" && count > initialTurns.length) end.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [count, status, initialTurns.length]);

  const next = turns.length % 2 === 0 ? "The Devil" : "Jesus";

  return (
    <div>
      <ol className="space-y-4" aria-live="polite">
        {turns.map((t) => (
          <li key={t.seq} className={`dbt dbt-${t.speaker}`}>
            <span className="dbt-badge" aria-hidden="true"><Icon name={t.speaker === "jesus" ? "cross" : "flame"} size={20} /></span>
            <div className="dbt-bubble">
              <p className="dbt-name">{t.speaker === "jesus" ? "Jesus" : "The Devil"} <span>· AI portrayal</span></p>
              <p className="mt-1 whitespace-pre-wrap">{t.body}</p>
            </div>
          </li>
        ))}
      </ol>

      {status === "live" && turns.length < total && (
        <p className="dbt-typing mt-5" role="status">{next} is preparing a reply…</p>
      )}
      {status === "upcoming" && <p className="mt-2 text-ivory/65">This debate has not started yet. Come back soon.</p>}
      {status === "finished" && <p className="mt-6 text-center text-sm uppercase tracking-[0.3em] text-gold/80">The debate has ended</p>}
      <div ref={end} />
    </div>
  );
}
