"use client";
import { useState } from "react";

// Copy, WhatsApp and phone share for a short text, plus the page link.
export default function ShareButtons({ text, path = "" }: { text: string; path?: string }) {
  const [done, setDone] = useState("");

  const full = () => `${text}\n${window.location.origin}${path}`;
  const flash = (m: string) => {
    setDone(m);
    setTimeout(() => setDone(""), 1800);
  };

  async function copy() {
    try {
      await navigator.clipboard.writeText(full());
      flash("Copied");
    } catch {
      flash("Could not copy");
    }
  }
  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({ text, url: `${window.location.origin}${path}` });
      } catch {
        // person closed the share sheet
      }
    } else {
      copy();
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button type="button" className="btn-ghost !px-4 !py-1.5 text-sm" onClick={copy}>
        {done || "Copy"}
      </button>
      <a
        className="btn-ghost !px-4 !py-1.5 text-sm"
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => {
          e.currentTarget.href = `https://wa.me/?text=${encodeURIComponent(full())}`;
        }}
        href="https://wa.me/"
      >
        WhatsApp
      </a>
      <button type="button" className="btn-ghost !px-4 !py-1.5 text-sm" onClick={share}>
        Share
      </button>
    </div>
  );
}
