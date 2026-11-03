"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BOOKS, findBook, neighbours } from "@/lib/bibleBooks";
import { TRANSLATIONS } from "@/lib/bible";

type V = { chapter: number; verse: number; text: string; ref: string };
type Result =
  | { kind: "chapter"; book: string; chapter: number; verses: V[] }
  | { kind: "passage"; ref: string; verses: V[] }
  | { kind: "search"; q: string; page: number; verses: V[]; hasMore: boolean };

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function Highlight({ text, q }: { text: string; q: string }) {
  const words = q.split(/\s+/).filter((w) => w.length > 1).map(escapeRe);
  if (!words.length) return <>{text}</>;
  const parts = text.split(new RegExp(`(${words.join("|")})`, "gi"));
  return (
    <>
      {parts.map((p, i) => (i % 2 ? <mark key={i}>{p}</mark> : <span key={i}>{p}</span>))}
    </>
  );
}

export default function BibleReader() {
  const router = useRouter();
  const sp = useSearchParams();

  const book = findBook(sp.get("b") ?? "") ?? findBook("John")!;
  const cRaw = Number(sp.get("c"));
  const chapter = Number.isInteger(cRaw) && cRaw >= 1 && cRaw <= book.chapters ? cRaw : 1;
  const q = (sp.get("q") ?? "").trim();
  const hi = Number(sp.get("v")) || 0;
  const tInfo = TRANSLATIONS.find((x) => x.id === (sp.get("t") ?? "").toUpperCase()) ?? TRANSLATIONS[0];
  const tr = tInfo.id;

  const [data, setData] = useState<Result | null>(null);
  const [more, setMore] = useState<V[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [input, setInput] = useState(q);
  const [picked, setPicked] = useState<Set<number>>(new Set());
  const [size, setSize] = useState(21);
  const [copied, setCopied] = useState(false);
  const top = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const s = Number(localStorage.getItem("bible-size"));
      if (s >= 16 && s <= 30) setSize(s);
    } catch {
      // storage unavailable
    }
  }, []);
  const resize = (d: number) => {
    const n = Math.max(16, Math.min(30, size + d));
    setSize(n);
    try {
      localStorage.setItem("bible-size", String(n));
    } catch {
      // storage unavailable
    }
  };

  useEffect(() => setInput(q), [q]);

  useEffect(() => {
    let live = true;
    setLoading(true);
    setError("");
    setPicked(new Set());
    setMore([]);
    setPage(1);
    const url = q
      ? `/api/bible?q=${encodeURIComponent(q)}&t=${tr}`
      : `/api/bible?book=${encodeURIComponent(book.name)}&chapter=${chapter}&t=${tr}`;
    fetch(url)
      .then(async (r) => {
        const j = await r.json();
        if (!r.ok) throw new Error(j.error ?? "Could not load.");
        return j as Result;
      })
      .then((j) => {
        if (!live) return;
        setData(j);
        setLoading(false);
      })
      .catch((e: Error) => {
        if (!live) return;
        setError(e.message);
        setData(null);
        setLoading(false);
      });
    return () => {
      live = false;
    };
  }, [book.name, chapter, q, tr]);

  // Scroll to the linked verse, or to the top of the new chapter.
  useEffect(() => {
    if (loading || !data) return;
    if (data.kind === "chapter" && hi) document.getElementById(`v${hi}`)?.scrollIntoView({ block: "center" });
    else top.current?.scrollIntoView({ block: "start" });
  }, [loading, data, hi]);

  const go = useCallback(
    (b: string, c: number, v?: number) =>
      router.push(`/bible?b=${encodeURIComponent(b)}&c=${c}&t=${tr}${v ? `&v=${v}` : ""}`, { scroll: false }),
    [router, tr]
  );

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const t = input.trim();
    if (!t) return;
    router.push(`/bible?q=${encodeURIComponent(t)}&t=${tr}`, { scroll: false });
  }

  async function loadMore() {
    if (data?.kind !== "search") return;
    const next = page + 1;
    setLoading(true);
    try {
      const r = await fetch(`/api/bible?q=${encodeURIComponent(q)}&page=${next}&t=${tr}`);
      const j = await r.json();
      if (!r.ok) throw new Error(j.error);
      setMore((m) => [...m, ...j.verses]);
      setPage(next);
      setData({ ...data, hasMore: j.hasMore });
    } catch {
      setError("Could not load more results.");
    }
    setLoading(false);
  }

  function toggle(n: number) {
    setPicked((p) => {
      const s = new Set(p);
      if (s.has(n)) s.delete(n);
      else s.add(n);
      return s;
    });
  }

  async function copyPicked() {
    if (data?.kind === "search" || !data) return;
    const chosen = data.verses.filter((v) => picked.has(v.verse)).sort((a, b) => a.verse - b.verse);
    if (!chosen.length) return;
    const first = chosen[0];
    const label = chosen.length === 1 ? first.ref : `${first.ref}-${chosen[chosen.length - 1].verse}`;
    try {
      await navigator.clipboard.writeText(`${label} (${tr})\n${chosen.map((v) => v.text).join(" ")}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  const nb = neighbours(book.name, chapter);
  const title = q ? (data?.kind === "passage" ? q : `Search: ${q}`) : `${book.name} ${chapter}`;
  const all = data?.kind === "search" ? [...data.verses, ...more] : data?.verses ?? [];

  return (
    <div ref={top} className="scroll-mt-24">
      {/* Controls */}
      <div className="card space-y-4">
        <form onSubmit={submitSearch} className="flex gap-2" role="search">
          <input
            className="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search a word (love) or a verse (John 3:16)"
            aria-label="Search the Bible"
            maxLength={80}
          />
          <button className="btn">Search</button>
        </form>
        <div className="flex flex-wrap items-center gap-2">
          <select
            className="input !w-auto"
            aria-label="Book"
            value={book.name}
            onChange={(e) => go(e.target.value, 1)}
          >
            <optgroup label="Old Testament">
              {BOOKS.filter((b) => b.testament === "Old").map((b) => <option key={b.name}>{b.name}</option>)}
            </optgroup>
            <optgroup label="New Testament">
              {BOOKS.filter((b) => b.testament === "New").map((b) => <option key={b.name}>{b.name}</option>)}
            </optgroup>
          </select>
          <select className="input !w-auto" aria-label="Chapter" value={chapter} onChange={(e) => go(book.name, Number(e.target.value))}>
            {Array.from({ length: book.chapters }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          <select
            className="input !w-auto"
            aria-label="Translation"
            value={tr}
            onChange={(e) => router.push(`/bible?${q ? `q=${encodeURIComponent(q)}` : `b=${encodeURIComponent(book.name)}&c=${chapter}`}&t=${e.target.value}`, { scroll: false })}
          >
            {TRANSLATIONS.map((t) => <option key={t.id} value={t.id}>{t.id}</option>)}
          </select>
          <div className="ml-auto flex items-center gap-2">
            <button type="button" className="btn-ghost !px-3 !py-1" onClick={() => resize(-1)} aria-label="Smaller text">A−</button>
            <button type="button" className="btn-ghost !px-3 !py-1" onClick={() => resize(1)} aria-label="Larger text">A+</button>
          </div>
        </div>
      </div>

      {/* Reading area */}
      <div className="card mt-4 min-h-[16rem]">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="font-serif text-4xl font-bold text-glow md:text-5xl">{title}</h2>
          {q && (
            <button type="button" className="text-sm text-gold underline" onClick={() => router.push(`/bible?b=${encodeURIComponent(book.name)}&c=${chapter}&t=${tr}`)}>
              Back to reading
            </button>
          )}
        </div>
        <p className="mt-1 text-sm text-ivory/50">{tInfo.name}</p>

        {loading && !all.length && (
          <div className="mt-6 space-y-3" aria-busy="true" aria-label="Loading">
            {[92, 100, 85, 96, 70, 98, 88].map((w, i) => <div key={i} className="skeleton h-5" style={{ width: `${w}%` }} />)}
          </div>
        )}
        {error && <p className="mt-6 text-rose-300" role="alert">{error}</p>}

        {data && data.kind !== "search" && (
          <div className="bible-text mt-6" style={{ fontSize: `${size}px` }}>
            {data.verses.map((v) => (
              <span
                key={v.verse}
                id={`v${v.verse}`}
                role="button"
                tabIndex={0}
                onClick={() => toggle(v.verse)}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), toggle(v.verse))}
                className={`verse ${picked.has(v.verse) ? "picked" : ""} ${hi === v.verse && data.kind === "chapter" ? "linked" : ""}`}
              >
                <sup>{v.verse}</sup>
                {v.text}{" "}
              </span>
            ))}
          </div>
        )}

        {data?.kind === "search" && !error && (
          <div className="mt-6 space-y-4">
            {!all.length && !loading && <p className="text-ivory/70">No verses found for “{q}”. Try a different word.</p>}
            {all.map((v, i) => (
              <button
                key={`${v.ref}-${i}`}
                type="button"
                className="result block w-full text-left"
                style={{ fontSize: `${Math.max(16, size - 2)}px` }}
                onClick={() => go(v.ref.replace(/ \d+:\d+$/, ""), v.chapter, v.verse)}
              >
                <span className="block text-sm font-semibold text-gold">{v.ref}</span>
                <span className="font-serif leading-relaxed text-ivory/90"><Highlight text={v.text} q={q} /></span>
              </button>
            ))}
            {data.hasMore && (
              <button type="button" className="btn-ghost" onClick={loadMore} disabled={loading}>
                {loading ? "Loading…" : "Show more verses"}
              </button>
            )}
          </div>
        )}

        {data && data.kind !== "search" && (
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
            <div className="flex gap-2">
              {nb.prev && <button type="button" className="btn-ghost" onClick={() => go(nb.prev!.book, nb.prev!.chapter)}>← {nb.prev.book} {nb.prev.chapter}</button>}
            </div>
            <div className="flex items-center gap-3">
              {picked.size > 0 && (
                <button type="button" className="btn !py-1.5 text-sm" onClick={copyPicked}>
                  {copied ? "Copied" : `Copy ${picked.size} verse${picked.size > 1 ? "s" : ""}`}
                </button>
              )}
              {data.kind === "chapter" && nb.next && <button type="button" className="btn-ghost" onClick={() => go(nb.next!.book, nb.next!.chapter)}>{nb.next.book} {nb.next.chapter} →</button>}
            </div>
          </div>
        )}
        {data && data.kind !== "search" && <p className="mt-3 text-xs text-ivory/40">Tap a verse to select it, then copy it to share.</p>}
      </div>
    </div>
  );
}
