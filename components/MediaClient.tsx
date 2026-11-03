"use client";
import { useState } from "react";
import { parseMedia } from "@/lib/media";

type Item = { id: string; kind: "music" | "sermon"; title: string; artist: string | null; url: string; description: string | null };

function Player({ item }: { item: Item }) {
  const [on, setOn] = useState(false);
  const m = parseMedia(item.url);
  if (!m) return null;

  if (m.type === "youtube") {
    return on ? (
      <iframe
        className="aspect-video w-full rounded-xl"
        src={`https://www.youtube-nocookie.com/embed/${m.id}?autoplay=1&rel=0`}
        title={item.title}
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
      />
    ) : (
      <button type="button" className="yt-facade group" onClick={() => setOn(true)} aria-label={`Play ${item.title}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`https://i.ytimg.com/vi/${m.id}/hqdefault.jpg`} alt="" loading="lazy" />
        <span className="play" aria-hidden="true" />
      </button>
    );
  }
  if (m.type === "spotify") {
    return on ? (
      <iframe className="w-full rounded-xl" height={152} src={m.embed} title={item.title} allow="encrypted-media" loading="lazy" />
    ) : (
      <button type="button" className="chip w-full !rounded-xl py-3 text-center" onClick={() => setOn(true)}>
        Play on Spotify
      </button>
    );
  }
  if (m.type === "audio") {
    return <audio controls preload="none" className="w-full" src={m.url} />;
  }
  return (
    <a className="btn-ghost" href={m.url} target="_blank" rel="noopener noreferrer">
      Open link
    </a>
  );
}

export default function MediaClient({ items }: { items: Item[] }) {
  const [tab, setTab] = useState<"music" | "sermon">("music");
  const shown = items.filter((i) => i.kind === tab);

  return (
    <div>
      <div className="mb-6 inline-flex rounded-full border border-white/15 bg-white/5 p-1" role="tablist" aria-label="Listen">
        {(["music", "sermon"] as const).map((k) => (
          <button
            key={k}
            role="tab"
            aria-selected={tab === k}
            onClick={() => setTab(k)}
            className={`rounded-full px-6 py-2 font-semibold transition ${tab === k ? "bg-gold text-night" : "text-ivory/80 hover:text-gold"}`}
          >
            {k === "music" ? "Worship music" : "Sermons"}
          </button>
        ))}
      </div>

      {!shown.length ? (
        <div className="card">
          {tab === "music" ? "Worship songs will appear here soon." : "Sermons will appear here soon."}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {shown.map((i) => (
            <article key={i.id} className="card space-y-3">
              <Player item={i} />
              <div>
                <h2 className="text-2xl font-semibold text-glow">{i.title}</h2>
                {i.artist && <p className="text-sm text-gold">{i.artist}</p>}
                {i.description && <p className="mt-2 text-sm text-ivory/70">{i.description}</p>}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
