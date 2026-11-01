import Link from "next/link";

const features = [
  ["/visions", "Visions & Horoscope", "Receive a personal word of encouragement for your season."],
  ["/man-of-god", "Talk to the Man of God", "An AI pastor to pray with you and point you to Scripture."],
  ["/jesus", "Talk to Jesus (AI)", "A gentle conversation inspired by the Gospels."],
  ["/services", "Live Services", "See upcoming services and join the stream."],
  ["/prayer", "Prayer Wall", "Share a request and pray for others."],
];

export default function Home() {
  return (
    <div className="py-10">
      <section className="py-14 text-center">
        <h1 className="text-5xl font-bold text-glow md:text-6xl">Come as you are.</h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-white/75">
          A place to receive a word, pray, worship and be encouraged.
        </p>
        <Link href="/visions" className="btn mt-8">Receive your vision</Link>
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        {features.map(([href, title, desc]) => (
          <Link key={href} href={href} className="card transition hover:border-gold">
            <h2 className="text-xl font-semibold text-gold">{title}</h2>
            <p className="mt-1 text-white/75">{desc}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
