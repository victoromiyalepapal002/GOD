import { createClient } from "@/lib/supabase/server";
import MediaClient from "@/components/MediaClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "Listen: worship music and sermons: GOD" };

export default async function Media() {
  const { data, error } = await createClient()
    .from("media_items")
    .select("id, kind, title, artist, url, description")
    .order("sort_order", { ascending: true });

  return (
    <div className="py-8">
      <h1 className="page-title">Listen</h1>
      <p className="page-lead">Worship music to lift your heart, and sermons to build your faith.</p>
      <div className="mt-8">
        {error ? <div className="card">The library is not available yet. Please check back soon.</div> : <MediaClient items={data ?? []} />}
      </div>
    </div>
  );
}
