"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Req = { id: string; display_name: string; request: string; prayer_count: number };

export default function Prayer() {
  const supabase = createClient();
  const [items, setItems] = useState<Req[]>([]);
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [signedIn, setSignedIn] = useState(false);

  async function load() {
    const { data } = await supabase.from("prayer_requests").select("*")
      .order("created_at", { ascending: false }).limit(50);
    setItems((data as Req[]) ?? []);
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setSignedIn(!!data.user));
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function post(e: React.FormEvent) {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !text.trim()) return;
    await supabase.from("prayer_requests").insert({
      user_id: user.id,
      display_name: name.trim() || "Anonymous",
      request: text.trim().slice(0, 500),
    });
    setText("");
    load();
  }

  async function pray(id: string) {
    await supabase.rpc("pray_for", { request_id: id });
    load();
  }

  return (
    <div className="py-8">
      <h1 className="mb-4 text-3xl font-bold text-gold">Prayer Wall</h1>
      {signedIn ? (
        <form onSubmit={post} className="card mb-6 space-y-3">
          <input className="input" placeholder="Display name (optional)" value={name} onChange={(e) => setName(e.target.value)} />
          <textarea className="input" rows={3} maxLength={500} placeholder="Share a prayer request…" value={text} onChange={(e) => setText(e.target.value)} />
          <button className="btn">Post request</button>
        </form>
      ) : (
        <p className="card mb-6">Please <a className="text-gold underline" href="/login">sign in</a> to post a request.</p>
      )}
      <div className="space-y-3">
        {items.map((r) => (
          <div key={r.id} className="card">
            <p className="text-sm text-gold">{r.display_name}</p>
            <p className="mt-1 whitespace-pre-wrap">{r.request}</p>
            <button onClick={() => pray(r.id)} className="mt-3 rounded-full border border-white/20 px-3 py-1 text-sm hover:border-gold">
              🙏 I prayed ({r.prayer_count})
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
