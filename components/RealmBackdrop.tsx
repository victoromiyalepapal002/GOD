import type { Realm } from "@/lib/realms";

// Fixed colored glow behind the page, plus rising embers for hell.
// Fixed values (not random) so server and browser render the same markup.
const EMBERS = Array.from({ length: 16 }, (_, i) => ({
  left: (i * 29 + 7) % 100,
  size: 2 + ((i * 3) % 4),
  delay: -((i * 2.3) % 14),
  dur: 9 + ((i * 5) % 9),
  drift: ((i * 11) % 24) - 12,
}));

export default function RealmBackdrop({ realm }: { realm: Realm }) {
  return (
    <>
      <div className={`realm-glow ${realm}`} aria-hidden="true" />
      {realm === "hell" && (
        <div className="embers" aria-hidden="true">
          {EMBERS.map((m, i) => (
            <b
              key={i}
              style={
                {
                  left: `${m.left}%`,
                  width: m.size,
                  height: m.size,
                  animationDelay: `${m.delay}s`,
                  animationDuration: `${m.dur}s`,
                  "--dx": `${m.drift}vw`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      )}
    </>
  );
}
