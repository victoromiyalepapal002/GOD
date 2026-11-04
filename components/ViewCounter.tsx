"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Icon from "@/components/Icon";

// Counts one view per page per browser session and shows the page's total.
export default function ViewCounter() {
  const path = usePathname();
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    let inc = true;
    const key = `viewed:${path}`;
    try {
      if (sessionStorage.getItem(key)) inc = false;
      else sessionStorage.setItem(key, "1");
    } catch {
      // storage unavailable: count it anyway
    }
    setViews(null);
    fetch("/api/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path, inc }),
    })
      .then((r) => r.json())
      .then((d: { views: number | null }) => alive && setViews(d.views))
      .catch(() => {});
    return () => { alive = false; };
  }, [path]);

  if (views === null) return null;
  return (
    <p className="view-counter" aria-label={`${views} views of this page`}>
      <Icon name="eye" size={16} />
      <span>{views.toLocaleString()} {views === 1 ? "view" : "views"}</span>
    </p>
  );
}
