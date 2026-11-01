import Link from "next/link";
import GlassCross from "@/components/GlassCross";
import TiltCard from "@/components/TiltCard";

const rise = (i: number) => ({ "--i": i } as React.CSSProperties);

export default function Home() {
  return (
    <div className="pt-6 md:pt-12">
      <section className="grid items-center gap-6 md:grid-cols-[1.1fr_.9fr]">
        <div>
          <h1 className="rise text-6xl font-bold text-glow md:text-8xl" style={rise(0)}>
            Come as <br className="hidden md:block" />you are.
          </h1>
          <p className="rise mt-6 max-w-md text-lg text-ivory/80" style={rise(1)}>
            Ask for a word over your season, talk and pray with an AI companion, join a service, or leave a prayer request for others.
          </p>
          <div className="rise mt-8 flex flex-wrap gap-3" style={rise(2)}>
            <Link href="/visions" className="btn">Receive your word</Link>
            <Link href="/man-of-god" className="btn-ghost">Talk to the Man of God</Link>
          </div>
        </div>
        <div className="rise" style={rise(1)}>
          <GlassCross />
        </div>
      </section>

      <figure className="mx-auto my-14 max-w-xl text-center">
        <blockquote className="font-serif text-2xl italic leading-snug text-ivory/90 md:text-3xl">
          Come unto me, all ye that labour and are heavy laden, and I will give you rest.
        </blockquote>
        <figcaption className="mt-3 text-sm text-ivory/55">Matthew 11:28, King James Version</figcaption>
      </figure>

      <section className="grid gap-4 md:grid-cols-6">
        <TiltCard
          href="/visions"
          title="Visions and horoscope"
          desc="Share your name and birth date and receive a personal word of encouragement for the season ahead."
          accent="#e8c878"
          className="md:col-span-4"
        />
        <TiltCard
          href="/man-of-god"
          title="Man of God"
          desc="An AI pastor to pray with you and point you to Scripture."
          accent="#7a68e6"
          className="md:col-span-2"
        />
        <TiltCard
          href="/jesus"
          title="Talk to Jesus"
          desc="A gentle conversation inspired by the Gospels. It is an AI, not the real Jesus."
          accent="#5db4e8"
          className="md:col-span-2"
        />
        <TiltCard
          href="/services"
          title="Services"
          desc="See upcoming services and join live."
          accent="#e8c878"
          className="md:col-span-2"
        />
        <TiltCard
          href="/prayer"
          title="Prayer wall"
          desc="Post a request and pray for someone else."
          accent="#7a68e6"
          className="md:col-span-2"
        />
      </section>

      <section className="mt-4 grid gap-4 md:grid-cols-2">
        <TiltCard
          href="/heaven"
          title="Heaven"
          desc="Walk through what the Bible says about the place God is preparing."
          accent="#fff4d1"
        />
        <TiltCard
          href="/hell"
          title="Hell"
          desc="A sober, honest look at judgment, and the mercy that meets it."
          accent="#ff7a45"
        />
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
