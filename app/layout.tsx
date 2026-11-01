import "./globals.css";
import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "GOD – Faith, Vision & Fellowship",
  description: "Receive a word, pray, worship and talk with an AI pastor.",
};

const links = [
  ["/visions", "Visions"],
  ["/man-of-god", "Man of God"],
  ["/jesus", "Jesus"],
  ["/services", "Services"],
  ["/prayer", "Prayer Wall"],
];

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <body className="min-h-screen font-serif">
        <header className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <Link href="/" className="text-2xl font-bold tracking-widest text-gold">✦ GOD</Link>
          <nav className="flex flex-wrap items-center gap-4 text-sm">
            {links.map(([href, label]) => (
              <Link key={href} href={href} className="hover:text-gold">{label}</Link>
            ))}
            {user ? (
              <form action="/auth/signout" method="post">
                <button className="rounded-full border border-white/20 px-3 py-1 hover:border-gold">Sign out</button>
              </form>
            ) : (
              <Link href="/login" className="btn !py-1">Sign in</Link>
            )}
          </nav>
        </header>
        <main className="mx-auto max-w-5xl px-4 pb-16">{children}</main>
        <footer className="mx-auto max-w-5xl px-4 pb-8 text-center text-xs text-white/50">
          AI features are for encouragement and entertainment. They are not real clergy, not Jesus, and not a substitute for professional help.
        </footer>
      </body>
    </html>
  );
}
