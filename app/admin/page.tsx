import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";
import AdminPanel from "@/components/AdminPanel";
import GivingAdmin from "@/components/GivingAdmin";
import DevotionalAdmin from "@/components/DevotionalAdmin";
import MediaAdmin from "@/components/MediaAdmin";
import PrayerAdmin from "@/components/PrayerAdmin";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin" };

const SECTIONS = [
  ["ai", "AI", "Add keys, set each model, and choose which AI answers first. If one fails, the next one takes over."],
  ["giving", "Giving", "Add your bank account and payment links for tithes and donations. They appear on the Give page."],
  ["devotionals", "Devotionals", "Read, write or fix the daily devotional. Anything you save replaces the AI's version for that day."],
  ["media", "Music and sermons", "Add worship songs and sermons from YouTube, Spotify or direct audio links. They appear on the Listen page."],
  ["prayers", "Prayer wall", "Review requests. Hide anything unkind or private, or delete it."],
] as const;

export default async function AdminPage() {
  const { data: { user } } = await createClient().auth.getUser();

  if (!user) {
    return (
      <div className="card mt-8">
        Please <Link className="text-gold underline" href="/login">sign in</Link> to open the admin page.
      </div>
    );
  }
  if (!isAdmin(user)) {
    return (
      <div className="card mt-8">
        This account is not an admin. Add its email to <code>ADMIN_EMAILS</code> in your Vercel environment variables, then redeploy.
      </div>
    );
  }

  return (
    <div className="py-8">
      <h1 className="page-title">Admin</h1>
      <nav aria-label="Admin sections" className="mt-4 flex flex-wrap gap-2">
        {SECTIONS.map(([id, label]) => (
          <a key={id} href={`#${id}`} className="chip">{label}</a>
        ))}
      </nav>

      {SECTIONS.map(([id, label, blurb]) => (
        <section key={id} id={id} className="mt-12 scroll-mt-24">
          <h2 className="section-title">{label}</h2>
          <p className="mb-6 mt-1 max-w-xl text-ivory/70">{blurb}</p>
          {id === "ai" && <AdminPanel />}
          {id === "giving" && <GivingAdmin />}
          {id === "devotionals" && <DevotionalAdmin />}
          {id === "media" && <MediaAdmin />}
          {id === "prayers" && <PrayerAdmin />}
        </section>
      ))}
    </div>
  );
}
