"use client";
import { useRef } from "react";

export const TITLE_TEXT = { son: "Son of God", daughter: "Daughter of God", child: "Child of God" } as const;
export type MemberTitle = keyof typeof TITLE_TEXT;

export const memberNumber = (n: number) => `No. ${String(n).padStart(5, "0")}`;

type Props = { name: string; title: MemberTitle; motto?: string | null; no: number; joined: string };

// A glass membership card that tilts toward the pointer and catches a moving light.
export default function MemberCard({ name, title, motto, no, joined }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  function move(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--ry", `${(x - 0.5) * 16}deg`);
    el.style.setProperty("--rx", `${(0.5 - y) * 12}deg`);
    el.style.setProperty("--mx", `${x * 100}%`);
    el.style.setProperty("--my", `${y * 100}%`);
  }
  function leave() {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  }

  return (
    <div className="mcard-stage">
      <div ref={ref} className="mcard" onPointerMove={move} onPointerLeave={leave} role="img" aria-label={`${name}, ${TITLE_TEXT[title]}, ${memberNumber(no)}`}>
        <div className="mcard-top">
          <span className="mcard-cross" aria-hidden="true" />
          <span className="mcard-brand">Sons of God</span>
        </div>
        <div className="mcard-mid">
          <p className="mcard-name">{name}</p>
          <p className="mcard-title">{TITLE_TEXT[title]}</p>
          {motto && <p className="mcard-motto">“{motto}”</p>}
        </div>
        <div className="mcard-bottom">
          <span>{memberNumber(no)}</span>
          <span>John 1:12</span>
          <span>Since {joined}</span>
        </div>
      </div>
    </div>
  );
}
