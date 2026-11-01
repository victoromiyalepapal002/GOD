import "./globals.css";
import Link from "next/link";
import type { Metadata } from "next";
import { Cormorant_Garamond, Figtree } from "next/font/google";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";
import Spirits from "@/components/Spirits";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});
const body = Figtree({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GOD: Faith, Vision and Fellowship",
  description: "Receive a word, pray, worship and talk with an AI pastor.",
};

const links = [
  ["/visions", "Visions"],
  ["/man-of-god", "Man of God"],
  ["/jesus", "Jesus"],
  ["/services", "Services"],
  ["/prayer", "Prayer wall"],
];

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const admin = isAdmin(user);

  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="min-h-screen font-sans">
        <div className="aurora" aria-hidden="true"><i /><i /><i /></div>
        <Spirits />

        <header className="sticky top-3 z-20 mx-auto mt-3 max-w-5xl px-3">
          <div className="glass flex flex-wrap items-center justify-between gap-x-6 gap-y-2 rounded-3xl px-5 py-3 md:rounded-full">
            <Link href="/" className="font-serif text-3xl font-bold tracking-[0.2em] text-gold">GOD</Link>
            <nav className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
              {links.map(([href, label]) => (
                <Link key={href} href={href} className="text-ivory/80 transition hover:text-gold">{label}</Link>
              ))}
              {admin && (
                <Link href="/admin" className="text-gold transition hover:text-glow">Admin</Link>
              )}
              {user ? (
                <form action="/auth/signout" method="post">
                  <button className="btn-ghost !px-4 !py-1 text-sm">Sign out</button>
                </form>
              ) : (
                <Link href="/login" className="btn !px-4 !py-1 text-sm">Sign in</Link>
              )}
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-4 pb-20 pt-4">{children}</main>

        <footer className="mx-auto max-w-5xl px-4 pb-8 text-center text-xs text-ivory/50">
          AI features are for encouragement and entertainment. They are not real clergy, not Jesus, and not a substitute for professional help.
        </footer>
      </body>
    </html>
  );
}
