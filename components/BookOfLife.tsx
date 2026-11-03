"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Kind = "prayer" | "gratitude" | "scripture" | "testimony";
type Entry = { id: string; kind: Kind; body: string; verse_ref: string | null; answered: boolean; answered_at: string | null; created_at: string };

const KINDS: { id: Kind; label: string; hint: string }[] = [
  { id: "prayer", label: "Prayer", hint: "What are you asking God for?" },
  { id: "gratitude", label: "Thankful", hint: "What are you thankful for today?" },
  { id: "scripture", label: "Scripture", hint: "What did this verse say to you?" },
  { id: "testimony", label: "Testimony", hint: "What has God done for you?" },
];

const day = (iso: string) => new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });

export default function BookOfLife() {
  const [supabase] = useState(() => createClient());
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [items, setItems] = useState<Entry[]>([]);
  const [kind, setKind] = useState<Kind>("prayer");
  const [body, setBody] = useState("");
  const [verse, setVerse] = useState("");
  const [filter, setFilter] = useState<"all" | Kind | "answered">("all");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("life_entries")
      .select("id, kind, body, verse_ref, answered, answered_at, created_at")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) return setMsg("Could not load your book. The owner may need to run supabase/content.sql.");
    setItems((data as Entry[]) ?? []);
  }, [supabase]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setSignedIn(!!data.user);
      if (data.user) load();
    });
  }, [supabase, load]);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !body.trim()) return;
    setBusy(true);
    const { error } = await supabase.from("life_entries").insert({
      user_id: user.id, kind, body: body.trim().slice(0, 1000), verse_ref: verse.trim().slice(0, 60) || null,
    });
    setBusy(false);
    if (error) return setMsg("Could not save that page. Please try again.");
    setBody("");
    setVerse("");
    load();
  }

  async function toggleAnswered(x: Entry) {
    const answered = !x.answered;
    const { error } = await supabase.from("life_entries")
      .update({ answered, answered_at: answered ? new Date().toISOString() : null }).eq("id", x.id);
    if (error) return setMsg("Could not update.");
    load();
  }

  async function remove(x: Entry) {
    if (!confirm("Remove this page from your book?")) return;
    const { error } = await supabase.from("life_entries").delete().eq("id", x.id);
    if (error) return setMsg("Could not remove.");
    load();
  }

  if (signedIn === null) return <div className="skeleton h-40 w-full" />;
  if (!signedIn) {
    return (
      <div className="card max-w-xl">
        <p>Sign in to start your private Book of Life.</p>
        <Link href="/login" className="btn mt-4 inline-block">Sign in</Link>
      </div>
    );
  }

  const answeredCount = items.filter((i) => i.answered).length;
  const shown = items.filter((i) => (filter === "all" ? true : filter === "answered" ? i.answered : i.kind === filter));
  const current = KINDS.find((k) => k.id === kind)!;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
      <form onSubmit={add} className="card h-fit space-y-4">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Page type">
          {KINDS.map((k) => (
            <button type="button" key={k.id} className={`chip ${kind === k.id ? "chip-on" : ""}`} aria-pressed={kind === k.id} onClick={() => setKind(k.id)}>
              {k.label}
            </button>
          ))}
        </div>
        <label className="block">
          <span className="sr-only">{current.hint}</span>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} maxLength={1000} rows={5} required placeholder={current.hint} className="input w-full" />
        </label>
        <label className="block">
          <span className="sr-only">Verse (optional)</span>
          <input value={verse} onChange={(e) => setVerse(e.target.value)} maxLength={60} placeholder="Verse, e.g. Psalm 23:1 (optional)" className="input w-full" />
        </label>
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-ivory/50">{body.length}/1000 · Private to you</span>
          <button className="btn" disabled={busy || !body.trim()}>{busy ? "Saving…" : "Write in my book"}</button>
        </div>
        {msg && <p className="text-sm text-red-300" role="alert">{msg}</p>}
      </form>

      <div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-2 text-sm text-ivory/60">{items.length} pages · {answeredCount} answered</span>
          {(["all", "prayer", "answered", "gratitude", "scripture", "testimony"] as const).map((f) => (
            <button key={f} type="button" className={`chip ${filter === f ? "chip-on" : ""}`} aria-pressed={filter === f} onClick={() => setFilter(f)}>
              {f === "all" ? "All" : f === "answered" ? "Answered" : KINDS.find((k) => k.id === f)!.label}
            </button>
          ))}
        </div>

        {shown.length === 0 ? (
          <p className="mt-6 text-ivory/60">{items.length ? "Nothing here yet." : "Your book is empty. Write your first page."}</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {shown.map((x) => (
              <li key={x.id} className={`card ${x.answered ? "border-gold/50" : ""}`}>
                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="uppercase tracking-widest text-gold/80">
                    {KINDS.find((k) => k.id === x.kind)!.label}{x.answered && " · Answered"}
                  </span>
                  <span className="text-ivory/50">{day(x.created_at)}</span>
                </div>
                <p className="mt-2 whitespace-pre-wrap">{x.body}</p>
                {x.verse_ref && (
                  <p className="mt-2 text-sm">
                    <Link className="text-gold underline" href={`/bible?q=${encodeURIComponent(x.verse_ref)}`}>{x.verse_ref}</Link>
                  </p>
                )}
                {x.answered_at && <p className="mt-2 text-xs text-ivory/55">Answered on {day(x.answered_at)}. Thank You, Lord.</p>}
                <div className="mt-3 flex gap-2">
                  {x.kind === "prayer" && (
                    <button type="button" className="btn-ghost !px-4 !py-1 text-sm" onClick={() => toggleAnswered(x)}>
                      {x.answered ? "Mark unanswered" : "Mark answered"}
                    </button>
                  )}
                  <button type="button" className="btn-ghost !px-4 !py-1 text-sm" onClick={() => remove(x)}>Remove</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
