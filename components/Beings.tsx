"use client";
import { useEffect, useRef } from "react";
import { BEINGS, SECTION } from "@/lib/beings";
import type { Realm } from "@/lib/realms";
import Avatar from "@/components/Avatar";

export default function Beings({ realm, onAsk }: { realm: Realm; onAsk: (text: string) => void }) {
  const grid = useRef<HTMLDivElement>(null);
  const copy = SECTION[realm];
  const list = BEINGS.filter((b) => b.realm === realm);

  // Animate only while the avatars are on screen, so the page stays light.
  useEffect(() => {
    const el = grid.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.classList.add("live");
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => el.classList.toggle("live", e.isIntersecting),
      { rootMargin: "80px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section aria-labelledby="beings-title">
      <h2 id="beings-title" className="realm-title text-4xl font-bold md:text-5xl">{copy.title}</h2>
      <p className="mt-2 max-w-xl text-ivory/70">{copy.blurb}</p>

      <div ref={grid} className="beings mt-6">
        {list.map((b) => (
          <article
            key={b.id}
            className="card accent-edge being"
            style={{ "--tone": b.tone, "--accent": `rgb(${b.tone})` } as React.CSSProperties}
          >
            <Avatar id={b.id} />
            <h3 className="being-name">{b.name}</h3>
            <p className="being-meaning">{b.meaning}</p>
            <p className="mt-3 text-sm font-semibold text-ivory/90">{b.role}</p>
            <p className="mt-2 text-sm leading-relaxed text-ivory/75">{b.summary}</p>
            <p className="being-refs">{b.refs}</p>
            {b.note && <p className="mt-2 text-xs italic text-ivory/55">{b.note}</p>}
            {b.victory && <p className="being-victory">{b.victory}</p>}
            <button type="button" className="chip mt-4" onClick={() => onAsk(b.question)}>
              Ask about {b.name}
            </button>
          </article>
        ))}
      </div>

      <p className="mt-4 max-w-2xl text-sm text-ivory/55">{copy.footnote}</p>
    </section>
  );
}
