"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const PRIMARY: [string, string][] = [
  ["/bible", "Bible"],
  ["/devotional", "Devotional"],
  ["/prayer", "Prayer"],
  ["/media", "Listen"],
  ["/services", "Services"],
  ["/give", "Give"],
];

const MORE: { title: string; items: [string, string, string][] }[] = [
  { title: "Daily", items: [["/verse", "Verse of the day", "A verse to start your day"]] },
  {
    title: "Ask and explore",
    items: [
      ["/man-of-god", "Man of God", "Talk with an AI pastor"],
      ["/jesus", "Jesus", "An AI inspired by the Gospels"],
      ["/visions", "Visions and horoscope", "A word for your season"],
      ["/heaven", "Heaven and Hell", "Angels, judgment and hope"],
    ],
  },
  { title: "Learn", items: [["/about-god", "About God and salvation", "Know God and grow closer"]] },
  { title: "Community", items: [["/book-of-life", "Book of Life", "Your private prayer and thanks journal"], ["/sons-of-god", "Sons of God card", "Your free membership card"]] },
];

export default function Nav({ signedIn, admin }: { signedIn: boolean; admin: boolean }) {
  const path = usePathname();
  const [menu, setMenu] = useState(false); // phone menu
  const [more, setMore] = useState(false); // desktop dropdown
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMenu(false);
    setMore(false);
  }, [path]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(false);
        setMore(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setMore(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, []);

  const active = (href: string) => path === href || (href !== "/" && path.startsWith(href));
  const link = (href: string) => `nav-link ${active(href) ? "nav-link-on" : ""}`;

  const account = signedIn ? (
    <form action="/auth/signout" method="post">
      <button className="btn-ghost !px-4 !py-1.5 text-sm">Sign out</button>
    </form>
  ) : (
    <Link href="/login" className="btn !px-4 !py-1.5 text-sm">Sign in</Link>
  );

  return (
    <div className="glass nav-bar" ref={box}>
      <Link href="/" className="brand" aria-label="GOD home">
        <span className="brand-cross" aria-hidden="true" />
        GOD
      </Link>

      {/* Desktop */}
      <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
        {PRIMARY.map(([href, label]) => (
          <Link key={href} href={href} className={link(href)} aria-current={active(href) ? "page" : undefined}>
            {label}
          </Link>
        ))}
        <div className="relative">
          <button type="button" className="nav-link" aria-expanded={more} aria-haspopup="true" onClick={() => setMore((v) => !v)}>
            Explore <span aria-hidden="true">▾</span>
          </button>
          {more && (
            <div className="dropdown glass" role="menu">
              {MORE.map((g) => (
                <div key={g.title}>
                  <p className="dropdown-title">{g.title}</p>
                  {g.items.map(([href, label, hint]) => (
                    <Link key={href} href={href} role="menuitem" className="dropdown-item">
                      <span className="font-semibold text-ivory">{label}</span>
                      <span className="text-xs text-ivory/55">{hint}</span>
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
        {admin && <Link href="/admin" className={`${link("/admin")} !text-gold`}>Admin</Link>}
        <span className="ml-2">{account}</span>
      </nav>

      {/* Phone */}
      <button
        type="button"
        className="burger lg:hidden"
        aria-label={menu ? "Close menu" : "Open menu"}
        aria-expanded={menu}
        aria-controls="mobile-menu"
        onClick={() => setMenu((v) => !v)}
      >
        <span /><span /><span />
      </button>

      {menu && (
        <div id="mobile-menu" className="mobile-menu lg:hidden">
          <div className="grid gap-1">
            {PRIMARY.map(([href, label]) => (
              <Link key={href} href={href} className={link(href)}>{label}</Link>
            ))}
          </div>
          {MORE.map((g) => (
            <div key={g.title} className="mt-4">
              <p className="dropdown-title">{g.title}</p>
              <div className="grid gap-1">
                {g.items.map(([href, label]) => (
                  <Link key={href} href={href} className={link(href)}>{label}</Link>
                ))}
              </div>
            </div>
          ))}
          <div className="mt-5 flex items-center gap-3">
            {admin && <Link href="/admin" className="nav-link !text-gold">Admin</Link>}
            {account}
          </div>
        </div>
      )}
    </div>
  );
}
