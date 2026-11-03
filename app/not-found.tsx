import Link from "next/link";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl py-24 text-center">
      <p className="text-sm uppercase tracking-[0.3em] text-gold/80">404</p>
      <h1 className="page-title mt-3">Lost sheep</h1>
      <p className="page-lead mx-auto">We could not find that page, but you are not lost. Let us take you home.</p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/" className="btn">Go home</Link>
        <Link href="/bible" className="btn-ghost">Read the Bible</Link>
      </div>
    </div>
  );
}
