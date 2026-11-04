import Link from "next/link";

const COLUMNS: { title: string; links: [string, string][] }[] = [
  { title: "Read", links: [["/bible", "The Bible"], ["/verse", "Verse of the day"], ["/devotional", "Daily devotional"], ["/about-god", "About God and salvation"]] },
  { title: "Pray and worship", links: [["/prayer", "Prayer"], ["/media", "Music and sermons"], ["/services", "Services"], ["/give", "Give"]] },
  { title: "Ask and explore", links: [["/man-of-god", "Man of God (AI)"], ["/jesus", "Jesus (AI)"], ["/visions", "Visions and horoscope"], ["/debate", "The Great Debate"], ["/heaven", "Heaven"], ["/hell", "Hell"]] },
  { title: "Community", links: [["/book-of-life", "Book of Life"], ["/sons-of-god", "Sons of God card"], ["/login", "Sign in"]] },
];

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.3fr_repeat(4,1fr)]">
          <div>
            <p className="brand !text-2xl"><span className="brand-cross" aria-hidden="true" />Sons of God</p>
            <p className="mt-3 max-w-xs text-sm text-ivory/60">Come as you are. Read, pray, worship and grow in faith.</p>
          </div>
          {COLUMNS.map((c) => (
            <nav key={c.title} aria-label={c.title}>
              <p className="footer-title">{c.title}</p>
              <ul className="mt-3 space-y-2">
                {c.links.map(([href, label]) => (
                  <li key={href}><Link href={href} className="footer-link">{label}</Link></li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <p className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-ivory/45">
          Scripture is from the King James Version unless another translation is shown. AI features are for encouragement and are not real clergy, not Jesus, and not a substitute for professional help.
        </p>
      </div>
    </footer>
  );
}
