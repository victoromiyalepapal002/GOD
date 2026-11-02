import Link from "next/link";
import { REALMS, type Realm } from "@/lib/realms";
import RealmContent from "@/components/RealmContent";
import RealmArt from "@/components/RealmArt";
import RealmBackdrop from "@/components/RealmBackdrop";

export default function RealmPage({ realm }: { realm: Realm }) {
  const cfg = REALMS[realm];

  return (
    <div className={`realm-${realm} py-8`}>
      <RealmBackdrop realm={realm} />

      <div className="mb-8 inline-flex rounded-full border border-white/15 bg-white/5 p-1" aria-label="Choose a realm">
        {(["heaven", "hell"] as Realm[]).map((r) => (
          <Link
            key={r}
            href={`/${r}`}
            aria-current={r === realm ? "page" : undefined}
            className={`rounded-full px-6 py-2 font-semibold transition ${
              r === realm ? "realm-tab-active" : "text-ivory/80 hover:text-glow"
            }`}
          >
            {REALMS[r].title}
          </Link>
        ))}
      </div>

      <section className="grid items-center gap-4 md:grid-cols-[1.1fr_.9fr]">
        <div>
          <h1 className="realm-title text-6xl font-bold md:text-8xl">{cfg.title}</h1>
          <p className="mt-4 max-w-md text-lg text-ivory/80">{cfg.tagline}</p>
        </div>
        <RealmArt realm={realm} />
      </section>

      <RealmContent realm={realm} />
    </div>
  );
}
