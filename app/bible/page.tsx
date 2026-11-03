import { Suspense } from "react";
import BibleReader from "@/components/BibleReader";

export const metadata = { title: "Read the Bible: GOD" };

export default function BiblePage() {
  return (
    <div className="py-8">
      <h1 className="page-title">The Bible</h1>
      <p className="page-lead">Read any chapter, or search for a word or a verse.</p>
      <div className="mt-6">
        <Suspense fallback={<div className="card skeleton h-64" />}>
          <BibleReader />
        </Suspense>
      </div>
    </div>
  );
}
