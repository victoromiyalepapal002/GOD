// SERVER ONLY. Reads Bible text from the free bolls.life API and caches it for a week,
// so each chapter is fetched at most once per week per server region.
import { BOOKS, isTranslation, type SearchHit, type Verse } from "@/lib/bible";

const BASE = "https://bolls.life";

export function cleanText(html: string): string {
  return String(html ?? "")
    .replace(/<S>.*?<\/S>/gi, "") // Strong's numbers
    .replace(/<sup>.*?<\/sup>/gi, "")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

export async function getChapter(tr: string, book: number, chapter: number): Promise<Verse[]> {
  const b = BOOKS.find((x) => x.id === book);
  if (!isTranslation(tr) || !b || !Number.isInteger(chapter) || chapter < 1 || chapter > b.chapters) {
    throw new Error("Bad reference.");
  }
  const res = await fetch(`${BASE}/get-text/${tr}/${book}/${chapter}/`, {
    next: { revalidate: 60 * 60 * 24 * 7 },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error("Bible source unavailable.");
  const data = (await res.json()) as { verse: number; text: string }[];
  if (!Array.isArray(data) || !data.length) throw new Error("Empty chapter.");
  return data.map((v) => ({ verse: v.verse, text: cleanText(v.text) }));
}

export async function searchBible(
  tr: string,
  q: string,
  page = 1
): Promise<{ total: number; results: SearchHit[] }> {
  if (!isTranslation(tr)) throw new Error("Bad translation.");
  const term = q.trim().slice(0, 80);
  if (term.length < 2) throw new Error("Type at least 2 letters.");
  const url = `${BASE}/v2/find/${tr}?search=${encodeURIComponent(term)}&match_case=false&match_whole=true&limit=25&page=${Math.max(1, page)}`;
  const res = await fetch(url, { next: { revalidate: 60 * 60 * 24 }, signal: AbortSignal.timeout(10000) });
  if (!res.ok) throw new Error("Search is unavailable right now.");
  const data = (await res.json()) as {
    total?: number;
    results?: { book: number; chapter: number; verse: number; text: string }[];
  };
  return {
    total: data.total ?? data.results?.length ?? 0,
    results: (data.results ?? []).map((r) => ({
      book: r.book,
      chapter: r.chapter,
      verse: r.verse,
      text: cleanText(r.text),
    })),
  };
}
