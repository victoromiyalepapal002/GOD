// Works out how to show a pasted music or sermon link. Client and server safe.
export type Playable =
  | { type: "youtube"; id: string }
  | { type: "spotify"; embed: string }
  | { type: "audio"; url: string }
  | { type: "link"; url: string };

export function parseMedia(raw: string): Playable | null {
  let u: URL;
  try {
    u = new URL(raw.trim());
  } catch {
    return null;
  }
  if (u.protocol !== "https:") return null;
  const host = u.hostname.replace(/^www\./, "").replace(/^m\./, "");

  if (host === "youtu.be") {
    const id = u.pathname.slice(1).split("/")[0];
    if (/^[\w-]{11}$/.test(id)) return { type: "youtube", id };
  }
  if (host === "youtube.com" || host === "music.youtube.com") {
    const id = u.searchParams.get("v") ?? u.pathname.match(/^\/(?:embed|shorts|live)\/([\w-]{11})/)?.[1];
    if (id && /^[\w-]{11}$/.test(id)) return { type: "youtube", id };
  }
  if (host === "open.spotify.com") {
    const m = u.pathname.match(/^\/(?:intl-[a-z]+\/)?(track|album|playlist|episode|show|artist)\/([A-Za-z0-9]+)/);
    if (m) return { type: "spotify", embed: `https://open.spotify.com/embed/${m[1]}/${m[2]}` };
  }
  if (/\.(mp3|m4a|ogg|wav|aac)$/i.test(u.pathname)) return { type: "audio", url: u.toString() };
  return { type: "link", url: u.toString() };
}
