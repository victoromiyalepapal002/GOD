import Link from "next/link";
import { REALMS, type Realm } from "@/lib/realms";
import Explore from "@/components/Explore";
import RealmArt from "@/components/RealmArt";
import RealmBackdrop from "@/components/RealmBackdrop";

export default function RealmPage({ realm }: { realm: Realm }) {
  const cfg = REALMS[realm];
  const other: Realm = realm === "heaven" ? "hell" : "heaven";

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

      <section className="mt-8">
        <Explore realm={realm} />
        <p className="mt-4 max-w-2xl text-sm text-ivory/55">
          Answers are written by an AI from the Bible and can contain mistakes. Churches differ on some of these questions, so read the passages yourself and talk with a pastor.
          {" "}
          <Link className="underline" href={`/${other}`}>
            Explore {REALMS[other].title.toLowerCase()} instead
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
