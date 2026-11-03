"use client";
import { useState } from "react";
import { PRAYERS } from "@/lib/prayers";

export default function Prayers() {
  const [copied, setCopied] = useState("");

  async function copy(id: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(""), 1800);
    } catch {
      setCopied("");
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {PRAYERS.map((p, i) => (
        <article key={p.id} className={`card accent-edge ${i === 0 ? "md:col-span-2" : ""}`}>
          <h2 className="text-2xl font-semibold text-glow md:text-3xl">{p.title}</h2>
          <p className="mt-1 text-sm italic text-gold">{p.when}</p>
          <p className="mt-3 font-serif text-lg leading-relaxed text-ivory/90 md:text-xl">{p.text}</p>
          <button type="button" className="chip mt-4 !px-4 !py-1 text-sm" onClick={() => copy(p.id, p.text)}>
            {copied === p.id ? "Copied" : "Copy prayer"}
          </button>
        </article>
      ))}
    </div>
  );
}
