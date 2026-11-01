"use client";
import { useState } from "react";

type Method = {
  id: string;
  label: string;
  category: "both" | "tithe" | "donation";
  url: string | null;
  details: string | null;
};

type Kind = "tithe" | "donation";

const COPY: Record<Kind, { title: string; blurb: string; note: string }> = {
  tithe: {
    title: "Tithe",
    blurb: "Return a tenth of your income, as an act of worship.",
    note: "Tithe",
  },
  donation: {
    title: "Donation",
    blurb: "Give any amount you decide, for the work and the people we serve.",
    note: "Donation",
  },
};

export default function GiveClient({ intro, methods }: { intro: string; methods: Method[] }) {
  const [kind, setKind] = useState<Kind>("tithe");
  const [income, setIncome] = useState("");
  const [copied, setCopied] = useState("");

  const shown = methods.filter((m) => m.category === "both" || m.category === kind);
  const amount = Number(income.replace(/,/g, ""));
  const tenth = Number.isFinite(amount) && amount > 0 ? amount / 10 : null;

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
    <div>
      {intro && <p className="mb-6 max-w-xl text-lg text-ivory/80">{intro}</p>}

      <div className="mb-6 inline-flex rounded-full border border-white/15 bg-white/5 p-1" role="tablist" aria-label="What would you like to give?">
        {(["tithe", "donation"] as Kind[]).map((k) => (
          <button
            key={k}
            role="tab"
            aria-selected={kind === k}
            onClick={() => setKind(k)}
            className={`rounded-full px-6 py-2 font-semibold transition ${
              kind === k ? "bg-gold text-night" : "text-ivory/80 hover:text-gold"
            }`}
          >
            {COPY[k].title}
          </button>
        ))}
      </div>

      <p className="mb-6 text-ivory/70">{COPY[kind].blurb}</p>

      {kind === "tithe" && (
        <div className="card mb-6 max-w-md">
          <label className="block text-sm text-ivory/70">
            Your income, to work out a tenth (optional)
            <input
              className="input mt-1"
              inputMode="decimal"
              placeholder="For example 150000"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
            />
          </label>
          {tenth !== null && (
            <p className="mt-3 text-lg text-glow">
              A tenth is <strong>{tenth.toLocaleString(undefined, { maximumFractionDigits: 2 })}</strong>
            </p>
          )}
          <p className="mt-2 text-xs text-ivory/50">This is only a helper. You decide what to give.</p>
        </div>
      )}

      {!shown.length ? (
        <div className="card">
          {methods.length
            ? `No giving method is set up for ${COPY[kind].title.toLowerCase()} yet.`
            : "Giving details have not been added yet. Please check back soon."}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {shown.map((m) => (
            <div key={m.id} className="card accent-edge space-y-3">
              <h2 className="text-2xl font-semibold text-glow">{m.label}</h2>
              {m.details && (
                <div>
                  <pre className="whitespace-pre-wrap break-words font-sans text-ivory/85">{m.details}</pre>
                  <button type="button" className="btn-ghost mt-2 !px-4 !py-1 text-sm" onClick={() => copy(m.id, m.details!)}>
                    {copied === m.id ? "Copied" : "Copy details"}
                  </button>
                </div>
              )}
              {m.url && /^https:\/\//i.test(m.url) && (
                <a className="btn" href={m.url} target="_blank" rel="noopener noreferrer">
                  Give with this link
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      <p className="mt-6 max-w-xl text-sm text-ivory/55">
        If you pay by bank transfer, write “{COPY[kind].note}” in the narration so it is recorded correctly. Only give using the details on this page.
      </p>
    </div>
  );
}
