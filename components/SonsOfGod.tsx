"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import MemberCard, { TITLE_TEXT, memberNumber, type MemberTitle } from "@/components/MemberCard";
import ShareButtons from "@/components/ShareButtons";

type Member = { display_name: string; title: MemberTitle; motto: string | null; member_no: number; created_at: string };

const joinedLabel = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { month: "short", year: "numeric" }).format(new Date(iso));

// Draws the card as a PNG so people can save it or post it.
function downloadCard(m: Member) {
  const W = 1012, H = 638;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const g = c.getContext("2d");
  if (!g) return;

  const round = (x: number, y: number, w: number, h: number, r: number) => {
    g.beginPath();
    g.moveTo(x + r, y);
    g.arcTo(x + w, y, x + w, y + h, r);
    g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r);
    g.arcTo(x, y, x + w, y, r);
    g.closePath();
  };

  const bg = g.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#1b2268");
  bg.addColorStop(0.55, "#0d1030");
  bg.addColorStop(1, "#2c1b63");
  round(0, 0, W, H, 40);
  g.fillStyle = bg;
  g.fill();

  const glow = g.createRadialGradient(W * 0.85, H * 0.1, 10, W * 0.85, H * 0.1, 420);
  glow.addColorStop(0, "rgba(232,200,120,0.35)");
  glow.addColorStop(1, "rgba(232,200,120,0)");
  g.fillStyle = glow;
  g.fillRect(0, 0, W, H);

  g.lineWidth = 3;
  g.strokeStyle = "rgba(232,200,120,0.75)";
  round(14, 14, W - 28, H - 28, 30);
  g.stroke();
  g.lineWidth = 1;
  g.strokeStyle = "rgba(255,244,209,0.25)";
  round(26, 26, W - 52, H - 52, 22);
  g.stroke();

  // cross
  g.fillStyle = "#e8c878";
  g.fillRect(78, 66, 10, 54);
  g.fillRect(62, 80, 42, 10);

  g.textBaseline = "alphabetic";
  g.fillStyle = "#e8c878";
  g.font = "600 34px Georgia, serif";
  g.fillText("Sons of God", 124, 106);

  g.fillStyle = "#fff4d1";
  let size = 82;
  g.font = `700 ${size}px Georgia, serif`;
  while (g.measureText(m.display_name).width > W - 160 && size > 36) {
    size -= 4;
    g.font = `700 ${size}px Georgia, serif`;
  }
  g.fillText(m.display_name, 80, 330);

  g.fillStyle = "#e8c878";
  g.font = "italic 600 44px Georgia, serif";
  g.fillText(TITLE_TEXT[m.title], 80, 400);

  if (m.motto) {
    g.fillStyle = "rgba(246,240,224,0.8)";
    g.font = "italic 30px Georgia, serif";
    g.fillText(`“${m.motto}”`, 80, 460, W - 160);
  }

  g.fillStyle = "rgba(246,240,224,0.7)";
  g.font = "26px system-ui, sans-serif";
  g.fillText(memberNumber(m.member_no), 80, H - 70);
  g.textAlign = "center";
  g.fillText("John 1:12", W / 2, H - 70);
  g.textAlign = "right";
  g.fillText(`Since ${joinedLabel(m.created_at)}`, W - 80, H - 70);

  c.toBlob((blob) => {
    if (!blob) return;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "sons-of-god-card.png";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }, "image/png");
}

export default function SonsOfGod() {
  const [sb] = useState(() => createClient());
  const [ready, setReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [member, setMember] = useState<Member | null>(null);
  const [editing, setEditing] = useState(false);
  const [count, setCount] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [title, setTitle] = useState<MemberTitle>("son");
  const [motto, setMotto] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      const { data: { user } } = await sb.auth.getUser();
      setSignedIn(!!user);
      if (user) {
        const { data, error } = await sb.from("members").select("*").eq("user_id", user.id).maybeSingle();
        if (error) setMsg("Membership cards are being set up. Please check back soon.");
        else if (data) setMember(data as Member);
      }
      const { data: n } = await sb.rpc("member_count");
      if (typeof n === "number" || typeof n === "string") setCount(Number(n));
      setReady(true);
    })();
  }, [sb]);

  function startEdit() {
    if (member) {
      setName(member.display_name);
      setTitle(member.title);
      setMotto(member.motto ?? "");
    }
    setEditing(true);
    setMsg("");
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return;
    const clean = { display_name: name.trim().slice(0, 30), title, motto: motto.trim().slice(0, 60) || null };
    if (!clean.display_name) return;
    setBusy(true);
    setMsg("");
    const q = member
      ? sb.from("members").update(clean).eq("user_id", user.id).select().single()
      : sb.from("members").insert({ user_id: user.id, ...clean }).select().single();
    const { data, error } = await q;
    setBusy(false);
    if (error || !data) {
      setMsg("Could not save your card. Please try again.");
      return;
    }
    setMember(data as Member);
    setEditing(false);
    if (!member) setCount((c) => (c ?? 0) + 1);
  }

  async function remove() {
    if (!confirm("Delete your card? You can make a new one, but you will get a new number.")) return;
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return;
    await sb.from("members").delete().eq("user_id", user.id);
    setMember(null);
    setCount((c) => Math.max(0, (c ?? 1) - 1));
  }

  const showForm = signedIn && (editing || !member);

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[1.1fr_1fr]">
      <div>
        {member && !editing ? (
          <MemberCard name={member.display_name} title={member.title} motto={member.motto} no={member.member_no} joined={joinedLabel(member.created_at)} />
        ) : (
          <MemberCard
            name={name.trim() || "Your name"}
            title={title}
            motto={motto.trim() || "Loved. Forgiven. Free."}
            no={member?.member_no ?? 1001}
            joined={member ? joinedLabel(member.created_at) : joinedLabel(new Date().toISOString())}
          />
        )}
        {member && !editing && (
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button type="button" className="btn" onClick={() => downloadCard(member)}>Save card as picture</button>
            <button type="button" className="btn-ghost" onClick={startEdit}>Edit card</button>
            <ShareButtons text="I just got my Sons of God card. Get yours:" path="/sons-of-god" />
          </div>
        )}
      </div>

      <div className="card">
        {!ready ? (
          <div className="space-y-3" aria-busy="true">
            <div className="skeleton h-6 w-2/3" />
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-5/6" />
          </div>
        ) : !signedIn ? (
          <>
            <h2 className="section-title">Get your free card</h2>
            <p className="mt-2 text-ivory/75">
              Sign in to make your card. It takes a minute, and you get your own member number.
            </p>
            <Link href="/login" className="btn mt-4">Sign in or create an account</Link>
          </>
        ) : showForm ? (
          <form onSubmit={save} className="space-y-4">
            <h2 className="section-title">{member ? "Edit your card" : "Make your card"}</h2>
            <label className="block text-sm text-ivory/70">
              Name on the card
              <input className="input mt-1" required maxLength={30} value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
            </label>
            <fieldset>
              <legend className="text-sm text-ivory/70">I am a…</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {(Object.keys(TITLE_TEXT) as MemberTitle[]).map((k) => (
                  <label key={k} className={`chip cursor-pointer ${title === k ? "chip-on" : ""}`}>
                    <input type="radio" name="title" className="sr-only" checked={title === k} onChange={() => setTitle(k)} />
                    {TITLE_TEXT[k]}
                  </label>
                ))}
              </div>
            </fieldset>
            <label className="block text-sm text-ivory/70">
              A short saying (optional)
              <input className="input mt-1" maxLength={60} value={motto} onChange={(e) => setMotto(e.target.value)} placeholder="Loved. Forgiven. Free." />
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <button className="btn" disabled={busy}>{busy ? "Saving…" : member ? "Save changes" : "Get my card"}</button>
              {member && <button type="button" className="btn-ghost" onClick={() => setEditing(false)}>Cancel</button>}
            </div>
          </form>
        ) : (
          <>
            <h2 className="section-title">Welcome, {member?.display_name}</h2>
            <p className="mt-2 text-ivory/75">Your card is ready. Save it as a picture and share it with a friend.</p>
            <button type="button" className="mt-4 text-sm text-rose-300 underline" onClick={remove}>Delete my card</button>
          </>
        )}
        {msg && <p className="mt-3 text-sm text-gold" role="status">{msg}</p>}
        {count !== null && count > 0 && <p className="mt-4 text-sm text-ivory/55">{count.toLocaleString()} {count === 1 ? "person has" : "people have"} made a card so far.</p>}
      </div>
    </div>
  );
}
