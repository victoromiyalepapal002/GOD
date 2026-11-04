import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DebateView, { type Turn } from "@/components/DebateView";

export const dynamic = "force-dynamic";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

export async function generateMetadata({ params }: { params: { id: string } }) {
  if (!UUID.test(params.id)) return { title: "Debate" };
  const { data } = await createClient().from("debates").select("topic").eq("id", params.id).maybeSingle();
  return { title: data ? `Debate: ${data.topic}` : "Debate" };
}

export default async function DebateRoom({ params }: { params: { id: string } }) {
  if (!UUID.test(params.id)) notFound();
  const db = createClient();
  const { data: d } = await db.from("debates").select("id, topic, status, rounds").eq("id", params.id).maybeSingle();
  if (!d) notFound();
  const { data: turns } = await db.from("debate_turns").select("seq, speaker, body").eq("debate_id", params.id).order("seq", { ascending: true });

  return (
    <div className="py-8">
      <Link href="/debate" className="text-sm text-gold underline">All debates</Link>
      <p className="mt-4 text-sm uppercase tracking-[0.3em] text-gold/80">
        {d.status === "live" ? <><span className="live-dot" aria-hidden="true" /> Live now</> : d.status === "finished" ? "Past debate" : "Up next"}
      </p>
      <h1 className="page-title !text-4xl md:!text-5xl">{d.topic}</h1>
      <p className="mt-3 max-w-2xl text-sm text-ivory/55">
        An AI teaching drama, not the real words of Jesus or the devil. Check every verse in your own <Link className="text-gold underline" href="/bible">Bible</Link>.
      </p>
      <div className="mt-10 max-w-3xl">
        <DebateView id={d.id} initialStatus={d.status} rounds={d.rounds} initialTurns={(turns ?? []) as Turn[]} />
      </div>
    </div>
  );
}
