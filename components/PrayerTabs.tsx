"use client";
import { useState } from "react";
import Prayers from "@/components/Prayers";
import PrayerWall from "@/components/PrayerWall";

const TABS = [
  ["pray", "Pray these prayers"],
  ["wall", "Prayer wall"],
] as const;

export default function PrayerTabs() {
  const [tab, setTab] = useState<"pray" | "wall">("pray");
  return (
    <div>
      <div className="mb-6 inline-flex rounded-full border border-white/15 bg-white/5 p-1" role="tablist" aria-label="Prayer">
        {TABS.map(([id, label]) => (
          <button
            key={id}
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={`rounded-full px-5 py-2 font-semibold transition ${tab === id ? "bg-gold text-night" : "text-ivory/80 hover:text-gold"}`}
          >
            {label}
          </button>
        ))}
      </div>
      {tab === "pray" ? <Prayers /> : <PrayerWall />}
    </div>
  );
}
