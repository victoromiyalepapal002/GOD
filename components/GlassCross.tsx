"use client";
import { useEffect, useRef } from "react";

// Two glass bars form the cross, wrapped in three glowing orbit rings (an armillary sphere).
// Everything is CSS 3D: no WebGL, no 3D library.
const BARS = [
  { w: 56, h: 250, d: 30, y: 0 },
  { w: 160, h: 54, d: 30, y: -56 },
];
const FACES = ["front", "back", "left", "right", "top", "bottom"];
const RINGS = [
  { cls: "ring-a", size: 330 },
  { cls: "ring-b", size: 280 },
  { cls: "ring-c", size: 230 },
];

export default function GlassCross() {
  const tilt = useRef<HTMLDivElement>(null);

  // Gentle parallax that follows the pointer (skipped on touch and reduced motion).
  useEffect(() => {
    const ok = window.matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)").matches;
    if (!ok) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = tilt.current;
        if (!el) return;
        const x = e.clientX / window.innerWidth - 0.5;
        const y = e.clientY / window.innerHeight - 0.5;
        el.style.setProperty("--px", `${-y * 18}deg`);
        el.style.setProperty("--py", `${x * 26}deg`);
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="scene" aria-hidden="true">
      <div className="tilt-3d" ref={tilt}>
        <div className="float">
          <div className="cross-spin">
            {BARS.map((b, i) => (
              <div
                key={i}
                className="box"
                style={{ "--w": `${b.w}px`, "--h": `${b.h}px`, "--d": `${b.d}px`, "--y": `${b.y}px` } as React.CSSProperties}
              >
                {FACES.map((f) => (
                  <i key={f} className={`f ${f}`} />
                ))}
              </div>
            ))}
          </div>
          {RINGS.map((r) => (
            <div key={r.cls} className={`orbit ${r.cls}`} style={{ "--s": `${r.size}px` } as React.CSSProperties}>
              <span className="orb" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
