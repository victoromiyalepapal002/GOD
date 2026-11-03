"use client";
import { useCallback, useEffect, useState } from "react";

type Item = { id: string; display_name: string | null; request: string; prayer_count: number; hidden: boolean; created_at: string };

export default function PrayerAdmin() {
  const [items, setItems] = useState<Item[] | null>(null);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/prayers");
    const data = await res.json();
    if (!res.ok) return setMsg(data.error ?? "Could not load.");
    setItems(data.items);
  }, []);
  useEffect(() => { load(); }, [load]);

  async function call(method: "PATCH" | "DELETE", body: object) {
    setMsg("");
    const res = await fetch("/api/admin/prayers", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (!res.ok) return setMsg((await res.json()).error ?? "Something went wrong.");
    load();
  }

  if (msg && !items) return <p className="text-sm text-red-300" role="alert">{msg}</p>;
  if (!items) return <div className="skeleton h-24 w-full" />;
  if (!items.length) return <p className="text-ivory/60">No prayer requests yet.</p>;

  return (
    <div>
      {msg && <p className="mb-3 text-sm text-red-300" role="alert">{msg}</p>}
      <ul className="space-y-3">
        {items.map((p) => (
          <li key={p.id} className={`card ${p.hidden ? "opacity-60" : ""}`}>
            <p className="whitespace-pre-wrap">{p.request}</p>
            <p className="mt-2 text-xs text-ivory/55">
              {p.display_name || "Anonymous"} · {new Date(p.created_at).toLocaleDateString()} · {p.prayer_count} prayed
              {p.hidden && " · hidden"}
            </p>
            <div className="mt-3 flex gap-2">
              <button className="btn-ghost !px-4 !py-1 text-sm" onClick={() => call("PATCH", { id: p.id, hidden: !p.hidden })}>
                {p.hidden ? "Show" : "Hide"}
              </button>
              <button
                className="btn-ghost !px-4 !py-1 text-sm"
                onClick={() => { if (confirm("Delete this request for good?")) call("DELETE", { id: p.id }); }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
