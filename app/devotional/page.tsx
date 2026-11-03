import Link from "next/link";
import { dateKey, prettyDate } from "@/lib/today";
import { verseForDate } from "@/lib/verses";
import { getDevotional, recentDevotionals } from "@/lib/devotional";
import ShareButtons from "@/components/ShareButtons";

export const dynamic = "force-dynamic";
export const metadata = { title: "Daily devotional: GOD" };

export default async function DevotionalPage({ searchParams }: { searchParams: { date?: string } }) {
  const today = dateKey();
  const asked = searchParams.date && /^\d{4}-\d{2}-\d{2}$/.test(searchParams.date) ? searchParams.date : today;
  const date = asked > today ? today : asked;
  const [d, recent] = await Promise.all([getDevotional(date, date === today), recentDevotionals(8)]);
  const v = verseForDate(date);
  const paragraphs = d?.reflection.split(/\n{2,}|\n/).map((p) => p.trim()).filter(Boolean) ?? [];

  return (
    <div className="py-8">
      <h1 className="page-title">Daily devotional</h1>
      <p className="page-lead">{prettyDate(date)}</p>

      {d ? (
        <article className="mx-auto mt-8 max-w-3xl">
          <div className="card">
            <h2 className="font-serif text-4xl font-bold leading-tight text-glow md:text-5xl">{d.title}</h2>
            <blockquote className="mt-6 border-l-2 border-gold/60 pl-4">
              <p className="font-serif text-xl italic leading-relaxed text-ivory/90 md:text-2xl">“{d.verse_text}”</p>
              <footer className="mt-2 text-sm font-semibold text-gold">{d.verse_ref} (KJV)</footer>
            </blockquote>
            <div className="prose-faith mt-6">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            {d.prayer && (
              <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-5">
                <h3 className="font-serif text-2xl font-semibold text-gold">Prayer</h3>
                <p className="mt-2 font-serif text-lg italic leading-relaxed text-ivory/90">{d.prayer}</p>
              </div>
            )}
            {d.question && (
              <div className="mt-6">
                <h3 className="font-serif text-2xl font-semibold text-gold">Think about it</h3>
                <p className="mt-2 text-ivory/85">{d.question}</p>
              </div>
            )}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <ShareButtons text={`${d.title}: “${d.verse_text}” — ${d.verse_ref} (KJV)`} path="/devotional" />
              <Link className="btn-ghost" href="/man-of-god">Talk about it with the Man of God</Link>
            </div>
            {d.source === "ai" && (
              <p className="mt-6 text-xs text-ivory/45">
                Written with AI from today&apos;s verse. Test every teaching against the Bible, and talk with your pastor.
              </p>
            )}
          </div>
        </article>
      ) : (
        <div className="card mx-auto mt-8 max-w-3xl">
          <p className="font-serif text-2xl text-glow">“{v.text}”</p>
          <p className="mt-2 font-semibold text-gold">{v.ref}</p>
          <p className="mt-4 text-ivory/70">
            {date === today
              ? "Today's devotional is not ready yet. Read the verse above, pray over it, and come back soon."
              : "There is no devotional saved for this day."}
          </p>
          <Link className="btn mt-4" href={`/bible?b=${encodeURIComponent(v.book)}&c=${v.chapter}`}>Read the chapter</Link>
        </div>
      )}

      {recent.length > 1 && (
        <section className="mx-auto mt-12 max-w-3xl">
          <h2 className="section-title">Earlier devotionals</h2>
          <ul className="mt-4 divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/5">
            {recent.filter((r) => r.date !== date).map((r) => (
              <li key={r.date}>
                <Link href={`/devotional?date=${r.date}`} className="flex flex-wrap items-baseline justify-between gap-2 px-5 py-3 transition hover:bg-white/5">
                  <span className="font-semibold text-ivory/90">{r.title}</span>
                  <span className="text-sm text-ivory/50">{r.verse_ref} · {prettyDate(r.date)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
