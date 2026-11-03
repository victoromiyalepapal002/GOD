import Link from "next/link";

export const metadata = { title: "About God and salvation: GOD" };

type Verse = { ref: string; text: string };
type Section = { id: string; title: string; body: string[]; verses: Verse[] };

// Scripture quotations are from the King James Version (public domain).
const SECTIONS: Section[] = [
  {
    id: "god",
    title: "Who is God?",
    body: [
      "Christians believe in one God, who made everything that exists. He is not distant or angry by nature. The Bible says God is holy, which means perfectly good, and that God is love.",
      "He has shown himself as Father, Son and Holy Spirit: one God in three persons. He knows you, he sees you, and he wants a relationship with you.",
    ],
    verses: [
      { ref: "Genesis 1:1", text: "In the beginning God created the heaven and the earth." },
      { ref: "1 John 4:8", text: "He that loveth not knoweth not God; for God is love." },
    ],
  },
  {
    id: "jesus",
    title: "Who is Jesus Christ?",
    body: [
      "Jesus is the Son of God who became a human being. He lived a perfect life, taught about God's kingdom, healed the sick and welcomed the people others pushed away.",
      "He was crucified under Pontius Pilate, died, and was buried. On the third day God raised him from the dead. Christians trust Jesus not only as a teacher but as Saviour and Lord.",
    ],
    verses: [
      { ref: "John 1:14", text: "And the Word was made flesh, and dwelt among us, (and we beheld his glory, the glory as of the only begotten of the Father,) full of grace and truth." },
      { ref: "1 Corinthians 15:3-4", text: "Christ died for our sins according to the scriptures; And that he was buried, and that he rose again the third day according to the scriptures." },
    ],
  },
  {
    id: "need",
    title: "Why do we need saving?",
    body: [
      "The Bible says everyone has sinned. Sin is more than big crimes. It is every way we fall short of God's goodness, by what we do and by what we leave undone. Sin breaks our relationship with God and with each other.",
      "We cannot fix that by being good enough. That is why we need someone to save us.",
    ],
    verses: [
      { ref: "Romans 3:23", text: "For all have sinned, and come short of the glory of God;" },
      { ref: "Romans 6:23", text: "For the wages of sin is death; but the gift of God is eternal life through Jesus Christ our Lord." },
    ],
  },
  {
    id: "salvation",
    title: "How are we saved?",
    body: [
      "Salvation is a gift. Jesus took our place on the cross, and God offers forgiveness and new life to everyone who trusts in him. You cannot earn it, and you cannot lose your value by failing to deserve it.",
      "To be saved is to turn from sin, believe that Jesus died and rose again for you, and trust him as Lord. It begins with honest faith, not perfect words.",
    ],
    verses: [
      { ref: "Ephesians 2:8-9", text: "For by grace are ye saved through faith; and that not of yourselves: it is the gift of God: Not of works, lest any man should boast." },
      { ref: "Romans 5:8", text: "But God commendeth his love toward us, in that, while we were yet sinners, Christ died for us." },
      { ref: "Romans 10:9", text: "That if thou shalt confess with thy mouth the Lord Jesus, and shalt believe in thine heart that God hath raised him from the dead, thou shalt be saved." },
    ],
  },
  {
    id: "forgiveness",
    title: "Forgiveness",
    body: [
      "When you bring your sin honestly to God, he forgives. Not reluctantly, and not halfway. The Bible says he removes it completely, and that those who belong to Jesus are no longer condemned.",
      "Forgiveness also changes how we treat others. We forgive because we have been forgiven.",
    ],
    verses: [
      { ref: "1 John 1:9", text: "If we confess our sins, he is faithful and just to forgive us our sins, and to cleanse us from all unrighteousness." },
      { ref: "Psalm 103:12", text: "As far as the east is from the west, so far hath he removed our transgressions from us." },
      { ref: "Romans 8:1", text: "There is therefore now no condemnation to them which are in Christ Jesus, who walk not after the flesh, but after the Spirit." },
    ],
  },
  {
    id: "new-life",
    title: "A new life",
    body: [
      "Trusting Jesus is a beginning, not an ending. God gives his Spirit to help you change, a little at a time. You will still struggle, and you will still need grace. But you are no longer alone.",
    ],
    verses: [
      { ref: "2 Corinthians 5:17", text: "Therefore if any man be in Christ, he is a new creature: old things are passed away; behold, all things are become new." },
    ],
  },
];

const STEPS: { title: string; text: string; href: string; link: string; verse: string }[] = [
  { title: "Pray every day", text: "Talk to God like you would talk to a father. It does not need fancy words. Say thank you, say sorry, and ask for help.", href: "/prayer", link: "Pray with us", verse: "Philippians 4:6" },
  { title: "Read the Bible", text: "Start with the Gospel of John, then Psalms and Proverbs. A few verses a day, with a devotional, is enough.", href: "/bible?b=John&c=1", link: "Open the Gospel of John", verse: "Psalm 119:105" },
  { title: "Belong to a church", text: "Faith grows in community. Find a Bible-believing church near you and join a small group, so you have people to pray with.", href: "/services", link: "See our services", verse: "Hebrews 10:25" },
  { title: "Follow Jesus in daily life", text: "Obey what you learn. Forgive, tell the truth, be generous and love people, even when it costs you.", href: "/devotional", link: "Today's devotional", verse: "John 14:15" },
  { title: "Ask your questions", text: "Doubts are normal. Bring your questions to God, to a pastor, and to the AI guide here, then check every answer against the Bible.", href: "/man-of-god", link: "Talk to the Man of God", verse: "James 1:5" },
];

const FAQ: { q: string; a: string }[] = [
  { q: "Can I be forgiven for anything?", a: "The Bible says that everyone who comes to Jesus will be received. In John 6:37 he says, “him that cometh to me I will in no wise cast out.” No sin is too big for his mercy, if you come honestly." },
  { q: "Do I have to be good first?", a: "No. Jesus welcomed people before they changed. You come as you are, and God does the changing. Ephesians 2:8-9 says salvation is a gift, not a reward." },
  { q: "Is it okay to have doubts?", a: "Yes. Many people in the Bible asked hard questions. Honest doubt that keeps seeking God often leads to deeper faith. Keep reading, keep asking, and talk with a pastor or a mature believer." },
  { q: "Is Jesus the only way?", a: "This is what Christians believe, based on Jesus' own words in John 14:6: “I am the way, the truth, and the life: no man cometh unto the Father, but by me.” Christians also believe God is generous and just, and that he will judge fairly." },
  { q: "Do I have to join a church?", a: "Salvation does not depend on a church. But the Bible shows that believers grow together, so joining a local church is one of the best things you can do after you decide to follow Jesus." },
];

export default function AboutGod() {
  return (
    <div className="py-8">
      <h1 className="page-title">About God and salvation</h1>
      <p className="page-lead max-w-2xl">
        Whatever brought you here, you are welcome. This page explains the heart of the Christian faith in plain words, with the Bible verses behind it.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[14rem_1fr]">
        <nav aria-label="On this page" className="hidden lg:block">
          <ul className="sticky top-24 space-y-1 text-sm">
            {[...SECTIONS.map((s) => [s.id, s.title]), ["grow", "Growing closer to God"], ["pray", "A prayer to begin"], ["faq", "Common questions"]].map(([id, label]) => (
              <li key={id}>
                <a className="block rounded-lg px-3 py-1.5 text-ivory/70 transition hover:bg-white/5 hover:text-gold" href={`#${id}`}>{label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-6">
          {SECTIONS.map((s) => (
            <section key={s.id} id={s.id} className="card scroll-mt-24">
              <h2 className="section-title">{s.title}</h2>
              <div className="prose-faith mt-3">
                {s.body.map((p, i) => <p key={i}>{p}</p>)}
              </div>
              <div className="mt-5 space-y-4">
                {s.verses.map((v) => (
                  <blockquote key={v.ref} className="border-l-2 border-gold/60 pl-4">
                    <p className="font-serif text-lg italic leading-relaxed text-ivory/90 md:text-xl">“{v.text}”</p>
                    <footer className="mt-1 text-sm font-semibold text-gold">{v.ref}</footer>
                  </blockquote>
                ))}
              </div>
            </section>
          ))}

          <section id="grow" className="scroll-mt-24">
            <h2 className="section-title">Growing closer to God</h2>
            <p className="mt-2 max-w-2xl text-ivory/70">Five simple habits that help your faith grow.</p>
            <ol className="mt-4 grid gap-4 md:grid-cols-2">
              {STEPS.map((s, i) => (
                <li key={s.title} className="card">
                  <p className="font-serif text-4xl font-bold text-gold/80">{i + 1}</p>
                  <h3 className="mt-1 text-2xl font-semibold text-glow">{s.title}</h3>
                  <p className="mt-2 text-ivory/75">{s.text}</p>
                  <p className="mt-2 text-xs text-ivory/45">{s.verse}</p>
                  <Link href={s.href} className="btn-ghost mt-3 !px-4 !py-1.5 text-sm">{s.link}</Link>
                </li>
              ))}
            </ol>
          </section>

          <section id="pray" className="card verse-hero scroll-mt-24">
            <h2 className="section-title">A prayer to begin</h2>
            <p className="mt-2 text-ivory/70">
              Words alone do not save you. What matters is turning to Jesus sincerely. If this is the desire of your heart, you can pray something like this, in your own words:
            </p>
            <p className="mt-4 font-serif text-xl italic leading-relaxed text-glow md:text-2xl">
              “Lord Jesus, I know I am not perfect and I need you. I am sorry for my sins. I believe that you died for me and that God raised you from the dead. Forgive me, come into my life, and help me follow you from today. Thank you for loving me. Amen.”
            </p>
            <p className="mt-4 text-ivory/70">
              If you prayed this, tell someone you trust, find a church, and start reading the Gospel of John. We would love to pray with you.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/prayer" className="btn">Share a prayer request</Link>
              <Link href="/man-of-god" className="btn-ghost">Talk to the Man of God</Link>
            </div>
          </section>

          <section id="faq" className="scroll-mt-24">
            <h2 className="section-title">Common questions</h2>
            <div className="mt-4 space-y-3">
              {FAQ.map((f) => (
                <details key={f.q} className="card faq">
                  <summary>{f.q}</summary>
                  <p className="mt-3 text-ivory/80">{f.a}</p>
                </details>
              ))}
            </div>
            <p className="mt-6 text-sm text-ivory/50">
              Scripture quotations are from the King James Version. Churches express some of these teachings in different ways, so test everything against the Bible and talk with a pastor.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
