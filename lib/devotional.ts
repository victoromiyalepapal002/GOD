// SERVER ONLY. Gets (or writes) the devotional for a date.
// An admin-written devotional always wins. If none exists for today, the AI writes one
// from the day's verse, and it is saved so every visitor sees the same text.
import { createAdminClient } from "@/lib/supabase/admin";
import { chatComplete } from "@/lib/llm";
import { verseForDate } from "@/lib/verses";

export type Devotional = {
  date: string;
  title: string;
  verse_ref: string;
  verse_text: string;
  reflection: string;
  prayer: string | null;
  question: string | null;
  source: "ai" | "admin";
};

const SYSTEM = `You write short, warm Christian devotionals for a church website.
Use ONLY the verse you are given as Scripture. Do not quote other verses; you may mention another passage by name only if you are sure of it.
Do not promise health, wealth or specific outcomes. Do not claim special revelation or speak as God.
Write in plain, kind, simple English for a general audience, including people new to faith.
Return exactly this format and nothing else:
TITLE: a short title (max 8 words)
REFLECTION: 2 or 3 short paragraphs (about 150 words) explaining the verse in its setting and how to live it today
PRAYER: a short first-person prayer of 2 to 4 sentences
QUESTION: one question for the reader to think about today`;

export function parseDevotional(raw: string): { title: string; reflection: string; prayer: string; question: string } | null {
  const grab = (label: string, next: string[]) => {
    const re = new RegExp(`${label}:\\s*([\\s\\S]*?)(?=\\n\\s*(?:${next.join("|")}):|$)`, "i");
    return raw.match(re)?.[1]?.trim() ?? "";
  };
  const title = grab("TITLE", ["REFLECTION", "PRAYER", "QUESTION"]).replace(/^["“]|["”]$/g, "");
  const reflection = grab("REFLECTION", ["PRAYER", "QUESTION"]);
  const prayer = grab("PRAYER", ["QUESTION"]);
  const question = grab("QUESTION", []);
  if (!title || !reflection) return null;
  return { title: title.slice(0, 120), reflection, prayer, question };
}

export async function draftDevotional(date: string) {
  const v = verseForDate(date);
  const { text } = await chatComplete(
    [
      { role: "system", content: SYSTEM },
      { role: "user", content: `Verse (KJV): ${v.ref}\n"${v.text}"\nTheme: ${v.theme}` },
    ],
    900
  );
  const parsed = parseDevotional(text);
  if (!parsed) throw new Error("The AI answer could not be read.");
  return { date, verse_ref: v.ref, verse_text: v.text, ...parsed };
}

export async function recentDevotionals(limit = 7): Promise<{ date: string; title: string; verse_ref: string }[]> {
  try {
    const { data } = await createAdminClient()
      .from("devotionals")
      .select("date, title, verse_ref")
      .order("date", { ascending: false })
      .limit(limit);
    return data ?? [];
  } catch {
    return [];
  }
}

// Pass generate = true only for today, so visitors cannot trigger AI writing for random dates.
export async function getDevotional(date: string, generate = false): Promise<Devotional | null> {
  let db;
  try {
    db = createAdminClient();
  } catch {
    return null;
  }
  const found = await db.from("devotionals").select("*").eq("date", date).maybeSingle();
  if (found.data) return found.data as Devotional;
  if (found.error || !generate) return null; // table missing, or past day not written

  try {
    const d = await draftDevotional(date);
    await db.from("devotionals").upsert(
      { ...d, source: "ai", prayer: d.prayer || null, question: d.question || null },
      { onConflict: "date", ignoreDuplicates: true }
    );
    const again = await db.from("devotionals").select("*").eq("date", date).maybeSingle();
    return (again.data as Devotional) ?? null;
  } catch {
    return null;
  }
}
