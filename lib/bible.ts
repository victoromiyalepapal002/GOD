// Shared Bible types and the translations we offer (all public domain, so they are free to show).
export { BOOKS } from "@/lib/bibleBooks";

export const TRANSLATIONS = [
  { id: "KJV", name: "King James Version" },
  { id: "WEB", name: "World English Bible" },
  { id: "YLT", name: "Young's Literal Translation" },
] as const;

export type TranslationId = (typeof TRANSLATIONS)[number]["id"];

export function isTranslation(t: string): t is TranslationId {
  return TRANSLATIONS.some((x) => x.id === t);
}

export type Verse = { verse: number; text: string };
export type SearchHit = { book: number; chapter: number; verse: number; text: string };
