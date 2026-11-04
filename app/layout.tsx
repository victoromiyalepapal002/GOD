import "./globals.css";
import type { Metadata } from "next";
import { Cormorant_Garamond, Figtree } from "next/font/google";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";
import Spirits from "@/components/Spirits";
import Nav from "@/components/Nav";
import SiteFooter from "@/components/SiteFooter";
import ViewCounter from "@/components/ViewCounter";

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
  title: { default: "Sons of God: Faith, Vision and Fellowship", template: "%s | Sons of God" },
  description: "Read the Bible, pray, find a daily devotional and verse, worship, and talk with an AI pastor.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const admin = isAdmin(user);

  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="min-h-screen font-sans">
        <div className="aurora" aria-hidden="true"><i /><i /><i /></div>
        <Spirits />

        <a href="#main" className="skip-link">Skip to content</a>
        <header className="sticky top-3 z-30 mx-auto mt-3 max-w-6xl px-3">
          <Nav signedIn={!!user} admin={admin} />
        </header>

        <main id="main" className="mx-auto max-w-6xl px-4 pb-10 pt-6">{children}</main>

        <div className="mx-auto flex max-w-6xl justify-center px-4"><ViewCounter /></div>
        <SiteFooter />
      </body>
    </html>
  );
}
