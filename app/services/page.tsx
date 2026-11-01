import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function Services() {
  const supabase = createClient();
  const { data: services } = await supabase
    .from("services").select("*").order("starts_at", { ascending: true });

  return (
    <div className="py-8">
      <h1 className="mb-4 text-3xl font-bold text-gold">Services</h1>
      <div className="space-y-4">
        {(services ?? []).map((s) => (
          <div key={s.id} className="card">
            <h2 className="text-xl font-semibold">{s.title}</h2>
            <p className="text-sm text-gold">{new Date(s.starts_at).toLocaleString()}</p>
            {s.description && <p className="mt-2 text-white/75">{s.description}</p>}
            {s.stream_url && (
              <a href={s.stream_url} target="_blank" rel="noreferrer" className="btn mt-3">Join live</a>
            )}
          </div>
        ))}
        {!services?.length && <p className="text-white/60">No services scheduled yet.</p>}
      </div>
      <p className="mt-6 text-sm text-white/50">
        Add services in Supabase: Table Editor → services. Put a YouTube Live, Zoom or Google Meet link in stream_url.
      </p>
    </div>
  );
}
