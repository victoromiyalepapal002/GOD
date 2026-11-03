"use client";
import { useCallback, useEffect, useState } from "react";
import { dateKey, shiftKey } from "@/lib/today";

type Form = { title: string; verse_ref: string; verse_text: string; reflection: string; prayer: string; question: string };
const empty: Form = { title: "", verse_ref: "", verse_text: "", reflection: "", prayer: "", question: "" };

export default function DevotionalAdmin() {
  const [date, setDate] = useState(dateKey());
  const [form, setForm] = useState<Form>(empty);
  const [source, setSource] = useState<"ai" | "admin" | "none">("none");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const load = useCallback(async (d: string) => {
    setMsg("");
    const res = await fetch(`/api/admin/devotional?date=${d}`);
    const data = await res.json();
    if (!res.ok) {
      setMsg(data.error ?? "Could not load.");
      return;
    }
    if (data.devotional) {
      const x = data.devotional;
      setForm({
        title: x.title, verse_ref: x.verse_ref, verse_text: x.verse_text, reflection: x.reflection,
        prayer: x.prayer ?? "", question: x.question ?? "",
      });
      setSource(x.source);
    } else {
      setForm({ ...empty, verse_ref: data.verse.ref, verse_text: data.verse.text });
      setSource("none");
    }
  }, []);

  useEffect(() => {
    load(date);
  }, [date, load]);

  const set = (k: keyof Form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function draft() {
    setBusy(true);
    setMsg("Writing a draft…");
    const res = await fetch("/api/admin/devotional", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setMsg(data.error ?? "No draft.");
      return;
    }
    const d = data.draft;
    setForm({ title: d.title, verse_ref: d.verse_ref, verse_text: d.verse_text, reflection: d.reflection, prayer: d.prayer, question: d.question });
    setMsg("Draft ready. Read it, edit it, then save.");
  }

  async function save() {
    setBusy(true);
    setMsg("");
    const res = await fetch("/api/admin/devotional", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, ...form }),
    });
    const data = await res.json();
    setBusy(false);
    setMsg(res.ok ? "Saved. It shows on the Devotional page for that day." : data.error ?? "Could not save.");
    if (res.ok) setSource("admin");
  }

  async function remove() {
    if (!confirm("Remove this devotional? The AI will write a new one the next time someone opens that day.")) return;
    setBusy(true);
    const res = await fetch(`/api/admin/devotional?date=${date}`, { method: "DELETE" });
    setBusy(false);
    setMsg(res.ok ? "Removed." : "Could not remove.");
    if (res.ok) load(date);
  }

  return (
    <div className="card space-y-3">
      <div className="flex flex-wrap items-end gap-3">
        <label className="text-sm text-ivory/70">
          Date
          <input className="input mt-1" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
        <button type="button" className="btn-ghost !py-1 text-sm" onClick={() => setDate(shiftKey(date, -1))}>Previous day</button>
        <button type="button" className="btn-ghost !py-1 text-sm" onClick={() => setDate(shiftKey(date, 1))}>Next day</button>
        <p className="text-sm text-ivory/60">
          {source === "none" && "Nothing saved for this day yet."}
          {source === "ai" && "Written by the AI. You can edit it."}
          {source === "admin" && "Written by you."}
        </p>
      </div>

      <input className="input" placeholder="Title" value={form.title} onChange={(e) => set("title", e.target.value)} />
      <div className="grid gap-3 md:grid-cols-[1fr_2fr]">
        <input className="input" placeholder="Verse, for example John 3:16" value={form.verse_ref} onChange={(e) => set("verse_ref", e.target.value)} />
        <input className="input" placeholder="Verse text" value={form.verse_text} onChange={(e) => set("verse_text", e.target.value)} />
      </div>
      <textarea className="input" rows={7} placeholder="Devotional message" value={form.reflection} onChange={(e) => set("reflection", e.target.value)} />
      <textarea className="input" rows={3} placeholder="Prayer (optional)" value={form.prayer} onChange={(e) => set("prayer", e.target.value)} />
      <input className="input" placeholder="A question to think about (optional)" value={form.question} onChange={(e) => set("question", e.target.value)} />

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" className="btn" onClick={save} disabled={busy}>Save devotional</button>
        <button type="button" className="btn-ghost" onClick={draft} disabled={busy}>Write a draft with AI</button>
        {source !== "none" && (
          <button type="button" className="text-sm text-rose-300 underline" onClick={remove} disabled={busy}>Remove this day</button>
        )}
        {msg && <p className="text-sm text-gold" role="status">{msg}</p>}
      </div>
      <p className="text-sm text-ivory/50">
        If you do nothing, the AI writes each day's devotional from that day's verse when the first visitor opens the page. Anything you save here replaces it.
      </p>
    </div>
  );
}
