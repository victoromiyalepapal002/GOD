import Link from "next/link";
import GlassCross from "@/components/GlassCross";
import TiltCard from "@/components/TiltCard";
import Icon, { type IconName } from "@/components/Icon";
import { verseForDate } from "@/lib/verses";
import { dateKey, prettyDate } from "@/lib/today";

const rise = (i: number) => ({ "--i": i } as React.CSSProperties);

const DAILY: { href: string; icon: IconName; title: string; desc: string }[] = [
  { href: "/devotional", icon: "sun", title: "Daily devotional", desc: "A short teaching, a prayer and a question for today." },
  { href: "/bible", icon: "book", title: "Read the Bible", desc: "Read and search every book, in three free translations." },
  { href: "/book-of-life", icon: "book", title: "Book of Life", desc: "Your private journal of prayers, answers and thanks." },
  { href: "/prayer", icon: "heart", title: "Prayer", desc: "Read prayers, and share a request for others to pray over." },
  { href: "/media", icon: "music", title: "Music and sermons", desc: "Worship songs and teachings to play any time." },
];

export default function Home() {
  const today = dateKey();
  const v = verseForDate(today);

  return (
    <div className="pt-2 md:pt-8">
      <section className="grid items-center gap-6 md:grid-cols-[1.1fr_.9fr]">
        <div>
          <p className="rise text-sm uppercase tracking-[0.3em] text-gold/80" style={rise(0)}>{prettyDate(today)}</p>
          <h1 className="rise mt-3 text-6xl font-bold text-glow md:text-8xl" style={rise(1)}>
            Come as <br className="hidden md:block" />you are.
          </h1>
          <p className="rise mt-6 max-w-md text-lg text-ivory/80" style={rise(2)}>
            Read the Word, pray, find a devotional for today, worship, and talk with an AI companion. All free.
          </p>
          <div className="rise mt-8 flex flex-wrap gap-3" style={rise(3)}>
            <Link href="/devotional" className="btn">Today&apos;s devotional</Link>
            <Link href="/about-god" className="btn-ghost">New here? Start here</Link>
          </div>
        </div>
        <div className="rise" style={rise(2)}>
          <GlassCross />
        </div>
      </section>

      <section className="glass verse-hero mt-12 text-center" aria-labelledby="votd">
        <p id="votd" className="text-sm uppercase tracking-[0.3em] text-gold/80">Verse of the day · {v.theme}</p>
        <blockquote className="mx-auto mt-4 max-w-3xl font-serif text-2xl italic leading-snug text-ivory md:text-4xl">
          {v.text}
        </blockquote>
        <p className="mt-4 text-ivory/65">{v.ref}, King James Version</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/verse" className="btn">Open and share</Link>
          <Link href={`/bible?b=${encodeURIComponent(v.book)}&c=${v.chapter}`} className="btn-ghost">Read the chapter</Link>
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Every day">
        {DAILY.map((d) => (
          <Link key={d.href} href={d.href} className="tile">
            <span className="tile-icon"><Icon name={d.icon} /></span>
            <h3>{d.title}</h3>
            <p>{d.desc}</p>
          </Link>
        ))}
      </section>

      <h2 className="section-title mt-16">Ask and explore</h2>
      <section className="mt-5 grid gap-4 md:grid-cols-6">
        <TiltCard href="/visions" title="Visions and horoscope" desc="Share your name and birth date and receive a personal word of encouragement for the season ahead." accent="#e8c878" className="md:col-span-4" />
        <TiltCard href="/man-of-god" title="Man of God" desc="An AI pastor to pray with you and point you to Scripture." accent="#7a68e6" className="md:col-span-2" />
        <TiltCard href="/jesus" title="Talk to Jesus" desc="A gentle conversation inspired by the Gospels. It is an AI, not the real Jesus." accent="#5db4e8" className="md:col-span-3" />
        <TiltCard href="/services" title="Services" desc="See upcoming services and join live." accent="#e8c878" className="md:col-span-3" />
      </section>

      <section className="mt-4">
        <TiltCard href="/debate" title="The Great Debate" desc="Jesus and the devil debate a topic with Scripture. Watch it live, or read past debates." accent="#ff7a45" />
      </section>

      <section className="mt-4 grid gap-4 md:grid-cols-2">
        <TiltCard href="/heaven" title="Heaven" desc="Walk through what the Bible says about the place God is preparing, and meet its angels." accent="#fff4d1" />
        <TiltCard href="/hell" title="Hell" desc="A sober, honest look at judgment, the fallen powers, and the mercy that meets it." accent="#ff7a45" />
      </section>

      <section className="mt-16 grid items-center gap-6 md:grid-cols-2">
        <div className="card">
          <p className="text-sm uppercase tracking-[0.3em] text-gold/80">Know God</p>
          <h2 className="section-title mt-2">Not sure where to begin?</h2>
          <p className="mt-3 text-ivory/75">Who God is, who Jesus is, what salvation means, how forgiveness works, and simple ways to grow closer to Him.</p>
          <Link href="/about-god" className="btn mt-5 inline-block">About God and salvation</Link>
        </div>
        <div className="card">
          <p className="text-sm uppercase tracking-[0.3em] text-gold/80">Free for everyone</p>
          <h2 className="section-title mt-2">Sons of God card</h2>
          <p className="mt-3 text-ivory/75">Make your own membership card: your name, a title as a son, daughter or child of God, and a verse to carry. Download it and share.</p>
          <Link href="/sons-of-god" className="btn-ghost mt-5 inline-block">Get your card</Link>
        </div>
      </section>

      <section className="card mt-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-glow md:text-3xl">Give</h2>
          <p className="mt-1 max-w-md text-ivory/75">Pay your tithe or make a donation. You decide the amount.</p>
        </div>
        <Link href="/give" className="btn">Give now</Link>
      </section>
    </div>
  );
}
