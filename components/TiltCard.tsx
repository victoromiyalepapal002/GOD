"use client";
import Link from "next/link";
import { useRef } from "react";

type Props = {
  href: string;
  title: string;
  desc: string;
  accent: string;
  className?: string;
};

export default function TiltCard({ href, title, desc, accent, className = "" }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);

  function move(e: React.PointerEvent<HTMLAnchorElement>) {
    if (e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--ry", `${(x - 0.5) * 10}deg`);
    el.style.setProperty("--rx", `${(0.5 - y) * 8}deg`);
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
    <Link
      ref={ref}
      href={href}
      onPointerMove={move}
      onPointerLeave={leave}
      className={`card tilt accent-edge ${className}`}
      style={{ "--accent": accent } as React.CSSProperties}
    >
      <h2 className="text-2xl font-semibold text-glow md:text-3xl">{title}</h2>
      <p className="mt-2 max-w-md text-ivory/75">{desc}</p>
    </Link>
  );
}
