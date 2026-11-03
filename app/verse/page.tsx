import Link from "next/link";
import { dateKey, prettyDate, shiftKey } from "@/lib/today";
import { verseForDate } from "@/lib/verses";
import ShareButtons from "@/components/ShareButtons";

export const metadata = { title: "Verse of the day: GOD" };

export default function VersePage() {
  const today = dateKey();
  const v = verseForDate(today);
  const past = [1, 2, 3, 4, 5, 6].map((i) => {
    const d = shiftKey(today, -i);
    return { d, v: verseForDate(d) };
  });

  return (
    <div className="py-8">
      <h1 className="page-title">Verse of the day</h1>
      <p className="page-lead">{prettyDate(today)}</p>

      <section className="verse-hero card mt-8">
        <p className="font-serif text-3xl leading-snug text-glow md:text-5xl md:leading-tight">“{v.text}”</p>
        <p className="mt-6 text-xl font-semibold text-gold">{v.ref}</p>
        <p className="mt-1 text-sm text-ivory/55">King James Version · {v.theme}</p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link className="btn" href={`/bible?b=${encodeURIComponent(v.book)}&c=${v.chapter}`}>Read the whole chapter</Link>
          <Link className="btn-ghost" href="/devotional">Today&apos;s devotional</Link>
        </div>
        <div className="mt-6">
          <ShareButtons text={`“${v.text}” — ${v.ref} (KJV)`} path="/verse" />
        </div>
      </section>

      <section className="mt-12">
        <h2 className="section-title">This past week</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {past.map(({ d, v: pv }) => (
            <Link key={d} href={`/bible?b=${encodeURIComponent(pv.book)}&c=${pv.chapter}`} className="card block transition hover:border-gold/60">
              <p className="text-xs text-ivory/50">{prettyDate(d)}</p>
              <p className="mt-2 font-serif text-lg leading-snug text-ivory/90">“{pv.text}”</p>
              <p className="mt-2 text-sm font-semibold text-gold">{pv.ref}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
