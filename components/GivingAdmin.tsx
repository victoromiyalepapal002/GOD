"use client";
import { useEffect, useState } from "react";

type M = {
  id?: string;
  label: string;
  category: "both" | "tithe" | "donation";
  url: string;
  details: string;
  enabled: boolean;
};

const blank = (): M => ({ label: "", category: "both", url: "", details: "", enabled: true });

export default function GivingAdmin() {
  const [intro, setIntro] = useState("");
  const [list, setList] = useState<M[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/giving");
    const data = await res.json();
    if (!res.ok) {
      setMsg(data.error ?? "Could not load.");
    } else {
      setIntro(data.intro ?? "");
      setList(
        (data.methods as M[]).map((m) => ({ ...m, url: m.url ?? "", details: m.details ?? "" }))
      );
    }
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  const patch = (i: number, c: Partial<M>) => setList((l) => l.map((m, j) => (j === i ? { ...m, ...c } : m)));
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
    const res = await fetch("/api/admin/giving", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ intro, methods: list }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setMsg(data.error ?? "Could not save.");
      return;
    }
    setMsg("Saved. Visitors now see the new details on the Give page.");
    load();
  }

  if (loading) return <p className="text-ivory/60">Loading…</p>;

  return (
    <div className="space-y-4">
      <label className="card block text-sm text-ivory/70">
        Message at the top of the Give page
        <textarea className="input mt-1" rows={2} maxLength={400} value={intro} onChange={(e) => setIntro(e.target.value)} />
      </label>

      {list.map((m, i) => (
        <div key={m.id ?? `new-${i}`} className="card space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <input
              className="input !w-auto min-w-[12rem] flex-1 font-semibold"
              placeholder="Name, for example GTBank transfer"
              value={m.label}
              onChange={(e) => patch(i, { label: e.target.value })}
            />
            <div className="flex items-center gap-2">
              <button type="button" className="btn-ghost !px-3 !py-1" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">↑</button>
              <button type="button" className="btn-ghost !px-3 !py-1" onClick={() => move(i, 1)} disabled={i === list.length - 1} aria-label="Move down">↓</button>
              <label className="ml-2 flex items-center gap-2 text-sm">
                <input type="checkbox" checked={m.enabled} onChange={(e) => patch(i, { enabled: e.target.checked })} />
                Show
              </label>
            </div>
          </div>

          <label className="block text-sm text-ivory/70">
            Use for
            <select className="input mt-1" value={m.category} onChange={(e) => patch(i, { category: e.target.value as M["category"] })}>
              <option value="both">Tithe and donation</option>
              <option value="tithe">Tithe only</option>
              <option value="donation">Donation only</option>
            </select>
          </label>

          <label className="block text-sm text-ivory/70">
            Payment link (optional). Paste a Paystack, Flutterwave, PayPal or Stripe link
            <input className="input mt-1" placeholder="https://paystack.com/pay/your-church" value={m.url} onChange={(e) => patch(i, { url: e.target.value })} />
          </label>

          <label className="block text-sm text-ivory/70">
            Account details (optional). Bank, account name and number, or mobile money
            <textarea
              className="input mt-1"
              rows={3}
              maxLength={600}
              placeholder={"Bank: GTBank\nAccount name: Your Church\nAccount number: 0123456789"}
              value={m.details}
              onChange={(e) => patch(i, { details: e.target.value })}
            />
          </label>

          <button type="button" className="text-sm text-rose-300 underline" onClick={() => remove(i)}>
            Remove this method
          </button>
        </div>
      ))}

      {!list.length && <p className="card text-ivory/70">No giving methods yet. Add your first one below.</p>}

      <div className="flex flex-wrap items-center gap-4">
        <button type="button" className="btn-ghost" onClick={() => setList((l) => [...l, blank()])} disabled={list.length >= 20}>
          Add a giving method
        </button>
        <button type="button" className="btn" onClick={save} disabled={busy}>
          {busy ? "Saving…" : "Save giving details"}
        </button>
        {msg && <p className="text-sm text-gold" role="status">{msg}</p>}
      </div>
      <p className="text-sm text-ivory/50">
        Check every number and link twice. Visitors send real money to what you enter here. Payments go straight to your bank or payment provider; this site never handles the money.
      </p>
    </div>
  );
}
