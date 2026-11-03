import { NextResponse } from "next/server";
import { findBook } from "@/lib/bibleBooks";
import { isTranslation } from "@/lib/bible";
import { chapterVerses, passageByRef, searchVerses } from "@/lib/bibleApi";

export const runtime = "nodejs";

const cache = { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" };

// GET /api/bible?book=John&chapter=3&t=KJV   -> a whole chapter
// GET /api/bible?q=John 3:16&t=WEB           -> a passage
// GET /api/bible?q=faith&page=1&t=KJV        -> keyword search
export async function GET(req: Request) {
  const u = new URL(req.url);
  const t = (u.searchParams.get("t") ?? "KJV").toUpperCase();
  if (!isTranslation(t)) return NextResponse.json({ error: "Unknown translation." }, { status: 400 });
  const book = u.searchParams.get("book");
  const chapter = Number(u.searchParams.get("chapter"));
  const q = (u.searchParams.get("q") ?? "").trim().slice(0, 80);

  try {
    if (book && chapter) {
      const b = findBook(book);
      if (!b || !Number.isInteger(chapter) || chapter < 1 || chapter > b.chapters) {
        return NextResponse.json({ error: "That chapter does not exist." }, { status: 400 });
      }
      const verses = await chapterVerses(t, b.name, chapter);
      return NextResponse.json({ kind: "chapter", book: b.name, chapter, verses }, { headers: cache });
    }

    if (q) {
      const p = await passageByRef(t, q);
      if (p) return NextResponse.json({ kind: "passage", ref: p.title, verses: p.verses }, { headers: cache });
      if (q.length < 2) return NextResponse.json({ error: "Type at least 2 letters." }, { status: 400 });
      const page = Math.max(1, Math.min(50, Number(u.searchParams.get("page")) || 1));
      const r = await searchVerses(t, q, page);
      return NextResponse.json({ kind: "search", q, page, ...r }, { headers: cache });
    }

    return NextResponse.json({ error: "Choose a book and chapter, or type a search." }, { status: 400 });
  } catch {
    return NextResponse.json(
      { error: "The Bible text could not be loaded right now. Please try again in a moment." },
      { status: 502 }
    );
  }
}
