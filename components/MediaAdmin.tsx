"use client";
import { useEffect, useState } from "react";

type Item = {
  id?: string;
  kind: "music" | "sermon";
  title: string;
  artist: string;
  url: string;
  description: string;
  enabled: boolean;
};
const blank = (kind: Item["kind"]): Item => ({ kind, title: "", artist: "", url: "", description: "", enabled: true });

export default function MediaAdmin() {
  const [list, setList] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/media");
    const data = await res.json();
    if (!res.ok) setMsg(data.error ?? "Could not load.");
    else
      setList(
        (data.items as Item[]).map((m) => ({ ...m, artist: m.artist ?? "", description: m.description ?? "" }))
      );
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  const patch = (i: number, c: Partial<Item>) => setList((l) => l.map((m, j) => (j === i ? { ...m, ...c } : m)));
  const remove = (i: number) => setList((l) => l.filter((_, j) => j !== i));
  function move(i: number, d: -1 | 1) {
    const j = i + d;
    if (j < 0 || j >= list.length) return;
    const n = [...list];
    [n[i], n[j]] = [n[j], n[i]];
    setList(n);
  }

  async function save() {
    setBusy(true);
    setMsg("");
    const res = await fetch("/api/admin/media", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: list }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setMsg(data.error ?? "Could not save.");
      return;
    }
    setMsg("Saved. The Listen page is updated.");
    load();
  }

  if (loading) return <p className="text-ivory/60">Loading…</p>;

  return (
    <div className="space-y-4">
      {list.map((m, i) => (
        <div key={m.id ?? `new-${i}`} className="card space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <select className="input !w-auto" value={m.kind} onChange={(e) => patch(i, { kind: e.target.value as Item["kind"] })}>
              <option value="music">Music</option>
              <option value="sermon">Sermon</option>
            </select>
            <div className="flex items-center gap-2">
              <button type="button" className="btn-ghost !px-3 !py-1" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">↑</button>
              <button type="button" className="btn-ghost !px-3 !py-1" onClick={() => move(i, 1)} disabled={i === list.length - 1} aria-label="Move down">↓</button>
              <label className="ml-2 flex items-center gap-2 text-sm">
                <input type="checkbox" checked={m.enabled} onChange={(e) => patch(i, { enabled: e.target.checked })} />
                Show
              </label>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <input className="input" placeholder="Title" value={m.title} onChange={(e) => patch(i, { title: e.target.value })} />
            <input className="input" placeholder={m.kind === "music" ? "Artist or choir" : "Preacher"} value={m.artist} onChange={(e) => patch(i, { artist: e.target.value })} />
          </div>
          <input className="input" placeholder="Link: a YouTube, Spotify or direct .mp3 link (https://…)" value={m.url} onChange={(e) => patch(i, { url: e.target.value })} />
          <input className="input" placeholder="Short description (optional)" value={m.description} onChange={(e) => patch(i, { description: e.target.value })} />
          <button type="button" className="text-sm text-rose-300 underline" onClick={() => remove(i)}>Remove</button>
        </div>
      ))}

      {!list.length && <p className="card text-ivory/70">Nothing here yet. Add your first song or sermon.</p>}

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" className="btn-ghost" onClick={() => setList((l) => [...l, blank("music")])}>Add music</button>
        <button type="button" className="btn-ghost" onClick={() => setList((l) => [...l, blank("sermon")])}>Add sermon</button>
        <button type="button" className="btn" onClick={save} disabled={busy}>{busy ? "Saving…" : "Save library"}</button>
        {msg && <p className="text-sm text-gold" role="status">{msg}</p>}
      </div>
      <p className="text-sm text-ivory/50">
        Only add songs and sermons you own or that the owner lets people embed, such as an official YouTube or Spotify link. The site plays them from there; it does not store or copy the audio.
      </p>
    </div>
  );
}
