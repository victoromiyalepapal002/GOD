import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Debate: Jesus and the Devil" };
export const dynamic = "force-dynamic";

type Row = { id: string; topic: string; status: "upcoming" | "live" | "finished"; scheduled_for: string | null; finished_at: string | null; rounds: number };

function List({ rows, empty, label }: { rows: Row[]; empty: string; label: (r: Row) => string }) {
  if (!rows.length) return <p className="mt-3 text-ivory/55">{empty}</p>;
  return (
    <ul className="mt-4 grid gap-3 md:grid-cols-2">
      {rows.map((r) => (
        <li key={r.id}>
          <Link href={`/debate/${r.id}`} className="tile h-full">
            <span className="text-xs uppercase tracking-widest text-gold/80">{label(r)}</span>
            <h3 className="!text-xl">{r.topic}</h3>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default async function DebatePage() {
  const { data, error } = await createClient()
    .from("debates")
    .select("id, topic, status, scheduled_for, finished_at, rounds")
    .order("created_at", { ascending: false })
    .limit(100);
  const rows = (data ?? []) as Row[];
  const live = rows.filter((r) => r.status === "live");
  const upcoming = rows.filter((r) => r.status === "upcoming").sort((a, b) => (a.scheduled_for ?? "9").localeCompare(b.scheduled_for ?? "9"));
  const past = rows.filter((r) => r.status === "finished");
  const day = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : "");

  return (
    <div className="py-8">
      <h1 className="page-title">The Great Debate</h1>
      <p className="page-lead">
        Jesus and the devil debate a topic, each answering with Scripture, the way they met in the wilderness. Watch it unfold, and test every verse against your own Bible.
      </p>
      <p className="mt-3 max-w-2xl text-sm text-ivory/55">
        This is a teaching drama written by AI. It is not the real voice of Jesus or of the devil, and verses can be misquoted, so please check them in the <Link className="text-gold underline" href="/bible">Bible</Link>.
      </p>

      {error && <p className="card mt-8">Debates are not ready yet. The owner needs to run <code>supabase/content.sql</code> in Supabase.</p>}

      <h2 className="section-title mt-12"><span className="live-dot" aria-hidden="true" /> Happening now</h2>
      <List rows={live} empty="No debate is live right now." label={() => "Live now"} />

      <h2 className="section-title mt-12">Up next</h2>
      <List rows={upcoming} empty="No topics are planned yet." label={(r) => (r.scheduled_for ? `Planned ${day(r.scheduled_for)}` : "Coming soon")} />

      <h2 className="section-title mt-12">Past debates</h2>
      <List rows={past} empty="No finished debates yet." label={(r) => `Ended ${day(r.finished_at)}`} />
    </div>
  );
}
