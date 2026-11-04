// Which pages get a view counter. A fixed list stops anyone from filling the table with junk paths.
const FIXED = new Set([
  "/", "/bible", "/verse", "/devotional", "/prayer", "/media", "/services", "/give",
  "/man-of-god", "/jesus", "/visions", "/heaven", "/hell", "/about-god", "/sons-of-god",
  "/book-of-life", "/debate", "/login",
]);
const DEBATE = /^\/debate\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

export function countablePath(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const p = raw.length > 1 ? raw.replace(/\/+$/, "") : raw;
  return FIXED.has(p) || DEBATE.test(p) ? p : null;
}
