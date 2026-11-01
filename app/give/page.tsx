import { createClient } from "@/lib/supabase/server";
import GiveClient from "@/components/GiveClient";

export const dynamic = "force-dynamic";

export const metadata = { title: "Give: GOD" };

export default async function Give() {
  const supabase = createClient();
  const [m, s] = await Promise.all([
    supabase
      .from("giving_methods")
      .select("id, label, category, url, details")
      .order("sort_order", { ascending: true }),
    supabase.from("giving_settings").select("intro").eq("id", 1).maybeSingle(),
  ]);

  return (
    <div className="py-8">
      <h1 className="mb-4 text-4xl font-bold text-gold md:text-5xl">Give</h1>
      {m.error ? (
        <div className="card">Giving is not available yet. Please check back soon.</div>
      ) : (
        <GiveClient intro={s.data?.intro ?? ""} methods={m.data ?? []} />
      )}
    </div>
  );
}
