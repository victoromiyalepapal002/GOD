// The 66 books of the Protestant Bible with chapter counts. Ids 1 to 66 match the Bible API.
export type Book = { id: number; name: string; chapters: number; testament: "Old" | "New" };

const RAW: [string, number][] = [
  ["Genesis", 50], ["Exodus", 40], ["Leviticus", 27], ["Numbers", 36], ["Deuteronomy", 34],
  ["Joshua", 24], ["Judges", 21], ["Ruth", 4], ["1 Samuel", 31], ["2 Samuel", 24],
  ["1 Kings", 22], ["2 Kings", 25], ["1 Chronicles", 29], ["2 Chronicles", 36], ["Ezra", 10],
  ["Nehemiah", 13], ["Esther", 10], ["Job", 42], ["Psalms", 150], ["Proverbs", 31],
  ["Ecclesiastes", 12], ["Song of Solomon", 8], ["Isaiah", 66], ["Jeremiah", 52], ["Lamentations", 5],
  ["Ezekiel", 48], ["Daniel", 12], ["Hosea", 14], ["Joel", 3], ["Amos", 9],
  ["Obadiah", 1], ["Jonah", 4], ["Micah", 7], ["Nahum", 3], ["Habakkuk", 3],
  ["Zephaniah", 3], ["Haggai", 2], ["Zechariah", 14], ["Malachi", 4],
  ["Matthew", 28], ["Mark", 16], ["Luke", 24], ["John", 21], ["Acts", 28],
  ["Romans", 16], ["1 Corinthians", 16], ["2 Corinthians", 13], ["Galatians", 6], ["Ephesians", 6],
  ["Philippians", 4], ["Colossians", 4], ["1 Thessalonians", 5], ["2 Thessalonians", 3], ["1 Timothy", 6],
  ["2 Timothy", 4], ["Titus", 3], ["Philemon", 1], ["Hebrews", 13], ["James", 5],
  ["1 Peter", 5], ["2 Peter", 3], ["1 John", 5], ["2 John", 1], ["3 John", 1],
  ["Jude", 1], ["Revelation", 22],
];

export const BOOKS: Book[] = RAW.map(([name, chapters], i) => ({
  id: i + 1,
  name,
  chapters,
  testament: i < 39 ? "Old" : "New",
}));

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const ALIASES: Record<string, string> = {
  psalm: "Psalms", ps: "Psalms", psa: "Psalms",
  songofsongs: "Song of Solomon", songs: "Song of Solomon", canticles: "Song of Solomon",
  revelations: "Revelation", rev: "Revelation",
};

// "John", "1 cor", "psalm" -> a book, or undefined.
export function findBook(input: string): Book | undefined {
  const n = norm(input);
  if (!n) return undefined;
  const exact = BOOKS.find((b) => norm(b.name) === n);
  if (exact) return exact;
  if (ALIASES[n]) return BOOKS.find((b) => b.name === ALIASES[n]);
  if (n.length >= 3) return BOOKS.find((b) => norm(b.name).startsWith(n));
  return undefined;
}

type Spot = { book: string; chapter: number };

// The chapter before and after, crossing from one book to the next.
export function neighbours(bookName: string, chapter: number): { prev?: Spot; next?: Spot } {
  const i = BOOKS.findIndex((b) => b.name === bookName);
  if (i < 0) return {};
  const b = BOOKS[i];
  const prev: Spot | undefined =
    chapter > 1 ? { book: b.name, chapter: chapter - 1 } : i > 0 ? { book: BOOKS[i - 1].name, chapter: BOOKS[i - 1].chapters } : undefined;
  const next: Spot | undefined =
    chapter < b.chapters ? { book: b.name, chapter: chapter + 1 } : i < BOOKS.length - 1 ? { book: BOOKS[i + 1].name, chapter: 1 } : undefined;
  return { prev, next };
}
