"use client";
import Link from "next/link";
import { useState } from "react";
import { REALMS, type Realm } from "@/lib/realms";
import Beings from "@/components/Beings";
import Explore, { type AskRequest } from "@/components/Explore";

export default function RealmContent({ realm }: { realm: Realm }) {
  const other: Realm = realm === "heaven" ? "hell" : "heaven";
  const [request, setRequest] = useState<AskRequest>({ text: "", n: 0 });

  function askAbout(text: string) {
    setRequest((r) => ({ text, n: r.n + 1 }));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById("guide")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }

  return (
    <>
      <div className="mt-12">
        <Beings realm={realm} onAsk={askAbout} />
      </div>

      <section id="guide" className="mt-12 scroll-mt-24">
        <Explore realm={realm} request={request} />
        <p className="mt-4 max-w-2xl text-sm text-ivory/55">
          Answers are written by an AI from the Bible and can contain mistakes. Churches differ on some of these questions, so read the passages yourself and talk with a pastor.{" "}
          <Link className="underline" href={`/${other}`}>
            Explore {REALMS[other].title.toLowerCase()} instead
          </Link>
          .
        </p>
      </section>
    </>
  );
}
