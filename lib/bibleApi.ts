// SERVER ONLY. Fetches public-domain Bible text from free public APIs and caches it.
// Primary: bolls.life (KJV, WEB, YLT; chapters and keyword search).
// Backup for the King James Version: Bible SuperSearch, then bible-api.com for passages.
import { BOOKS as NUMBERED, isTranslation, type TranslationId } from "@/lib/bible";
import { BOOKS } from "@/lib/bibleBooks";
import { getChapter, searchBible } from "@/lib/bibleServer";

export type BibleVerse = { chapter: number; verse: number; text: string; ref: string };

const BSS = "https://bss-api.thechurchofgod.info/api";
const MONTH = 60 * 60 * 24 * 30;
const clean = (t: string) => t.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();

async function getJson(url: string, revalidate = MONTH) {
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(12000),
    next: { revalidate },
  });
  if (!res.ok) throw new Error(`Bible source returned ${res.status}`);
  return res.json();
}

function flattenBss(json: any, bible = "kjv"): BibleVerse[] {
  const out: BibleVerse[] = [];
  for (const r of json?.results ?? []) {
    const chapters = r?.verses?.[bible] ?? {};
    for (const ch of Object.keys(chapters)) {
      for (const v of Object.keys(chapters[ch])) {
        const text = clean(String(chapters[ch][v]?.text ?? ""));
        if (text) out.push({ chapter: Number(ch), verse: Number(v), text, ref: `${r.book_name} ${ch}:${v}` });
      }
    }
  }
  return out;
}

async function kjvBackupChapter(book: string, chapter: number): Promise<BibleVerse[]> {
  try {
    const v = flattenBss(await getJson(`${BSS}?bible=kjv&reference=${encodeURIComponent(`${book} ${chapter}`)}`));
    if (v.length) return v;
  } catch {
    // try the next backup
  }
  const json = await getJson(`https://bible-api.com/${encodeURIComponent(`${book} ${chapter}`)}?translation=kjv`);
  return (json?.verses ?? [])
    .map((v: any) => ({ chapter: Number(v.chapter), verse: Number(v.verse), text: clean(String(v.text ?? "")), ref: `${book} ${v.chapter}:${v.verse}` }))
    .filter((v: BibleVerse) => v.text);
}

export async function chapterVerses(tr: TranslationId, bookName: string, chapter: number): Promise<BibleVerse[]> {
  const n = NUMBERED.find((b) => b.name === bookName);
  if (!n) throw new Error("Unknown book");
  try {
    const verses = await getChapter(tr, n.id, chapter);
    return verses.map((v) => ({ chapter, verse: v.verse, text: v.text, ref: `${bookName} ${chapter}:${v.verse}` }));
  } catch (e) {
    if (tr !== "KJV") throw e;
    const backup = await kjvBackupChapter(bookName, chapter);
    if (!backup.length) throw e;
    return backup;
  }
}

// "John 3:16", "Psalm 23", "1 Cor 13:4-7" -> a book, chapter and optional verse range.
export function parseReference(q: string): { book: string; chapter: number; from?: number; to?: number } | null {
  const m = q.trim().match(/^((?:[1-3]\s?)?[A-Za-z][A-Za-z ]*?)\.?\s+(\d{1,3})(?::(\d{1,3})(?:-(\d{1,3}))?)?$/);
  if (!m) return null;
  const norm = (s: string) => s.toLowerCase().replace(/\./g, "").replace(/\s+/g, " ").trim().replace(/^(\d)\s/, "$1 ");
  const t = norm(m[1]);
  const alias: Record<string, string> = { psalm: "Psalms", "song of songs": "Song of Solomon", songs: "Song of Solomon", revelations: "Revelation" };
  let book = alias[t] ? BOOKS.find((b) => b.name === alias[t]) : BOOKS.find((b) => norm(b.name) === t);
  if (!book && t.length >= 3) {
    const hits = BOOKS.filter((b) => norm(b.name).startsWith(t));
    if (hits.length === 1) book = hits[0];
  }
  if (!book) return null;
  const chapter = Number(m[2]);
  if (chapter < 1 || chapter > book.chapters) return null;
  return { book: book.name, chapter, from: m[3] ? Number(m[3]) : undefined, to: m[4] ? Number(m[4]) : m[3] ? Number(m[3]) : undefined };
}

export async function passageByRef(tr: TranslationId, q: string): Promise<{ title: string; verses: BibleVerse[] } | null> {
  const p = parseReference(q);
  if (!p) return null;
  let verses = await chapterVerses(tr, p.book, p.chapter);
  if (p.from) verses = verses.filter((v) => v.verse >= p.from! && v.verse <= (p.to ?? p.from!));
  if (!verses.length) throw new Error("Passage not found");
  const range = p.from ? `:${p.from}${p.to && p.to !== p.from ? `-${p.to}` : ""}` : "";
  return { title: `${p.book} ${p.chapter}${range}`, verses };
}

export async function searchVerses(tr: TranslationId, q: string, page = 1): Promise<{ verses: BibleVerse[]; hasMore: boolean }> {
  try {
    const r = await searchBible(tr, q, page);
    const verses = r.results.map((h) => ({
      chapter: h.chapter,
      verse: h.verse,
      text: h.text,
      ref: `${NUMBERED.find((b) => b.id === h.book)?.name ?? ""} ${h.chapter}:${h.verse}`.trim(),
    }));
    return { verses, hasMore: page * 25 < r.total };
  } catch (e) {
    if (tr !== "KJV") throw e;
    const json = await getJson(`${BSS}?bible=kjv&search=${encodeURIComponent(q)}&page=${page}&page_limit=30`, 60 * 60 * 24);
    const verses = flattenBss(json);
    return { verses, hasMore: verses.length >= 30 };
  }
}

export { isTranslation };
