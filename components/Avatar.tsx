import type { BeingId } from "@/lib/beings";

// Eight small CSS 3D figures. Only divs and transforms: no images, no canvas, no 3D library.
// Each is a different silhouette: sword and shield, horn, six wings, wheels of eyes,
// serpent coil, falling star, key above an abyss, and a swarm of flies.

const FEATHERS = [0, 1, 2, 3, 4, 5];

function Wing({ side, y = 0, base = 0, scale = 1 }: { side: "l" | "r"; y?: number; base?: number; scale?: number }) {
  return (
    <div
      className={`wing ${side}`}
      style={{ "--y": `${y}px`, "--base": `${base}deg`, "--sc": scale } as React.CSSProperties}
    >
      {FEATHERS.map((f) => (
        <i key={f} style={{ "--f": f } as React.CSSProperties} />
      ))}
    </div>
  );
}

function Wings(props: { y?: number; base?: number; scale?: number; small?: boolean }) {
  const { small, ...rest } = props;
  return (
    <div className={`wings ${small ? "sm" : ""}`}>
      <Wing side="l" {...rest} />
      <Wing side="r" {...rest} />
    </div>
  );
}

export default function Avatar({ id }: { id: BeingId }) {
  return (
    <div className="av" aria-hidden="true">
      <div className="av-stage">
        {id === "michael" && (
          <>
            <Wings y={-6} />
            <div className="shield" />
            <div className="halo" />
            <div className="sword" />
            <div className="guard" />
            <div className="hilt" />
            <div className="pommel" />
          </>
        )}

        {id === "gabriel" && (
          <>
            <Wings y={-4} />
            <div className="halo" />
            <div className="orb" />
            <div className="horn" />
            <div className="wave" style={{ "--d": "0s" } as React.CSSProperties} />
            <div className="wave" style={{ "--d": "1.1s" } as React.CSSProperties} />
            <div className="wave" style={{ "--d": "2.2s" } as React.CSSProperties} />
          </>
        )}

        {id === "seraphim" && (
          <>
            <Wings y={-30} base={84} scale={0.78} small />
            <Wings y={-6} base={0} scale={1} small />
            <Wings y={22} base={-84} scale={0.78} small />
            <div className="flame" />
          </>
        )}

        {id === "cherubim" && (
          <>
            <Wings y={-6} scale={0.85} small />
            <div className="gimbal">
              <div className="ring r1" />
              <div className="ring r2" />
              <div className="ring r3" />
            </div>
            <div className="orb" />
          </>
        )}

        {id === "satan" && (
          <>
            <div className="coil">
              {[0, 1, 2, 3, 4, 5].map((k) => (
                <i key={k} style={{ "--k": k } as React.CSSProperties} />
              ))}
            </div>
            <div className="neck" />
            <div className="hood" />
            <div className="snake-head" />
            <div className="eye a" />
            <div className="eye b" />
          </>
        )}

        {id === "lucifer" && (
          <>
            <div className="broken-halo" />
            <div className="trail" />
            <div className="star" />
          </>
        )}

        {id === "abaddon" && (
          <>
            <div className="well">
              {[0, 1, 2, 3, 4, 5].map((k) => (
                <i key={k} style={{ "--k": k } as React.CSSProperties} />
              ))}
            </div>
            <div className="key">
              <div className="key-bow" />
              <div className="key-shaft" />
              <div className="key-tooth t1" />
              <div className="key-tooth t2" />
            </div>
          </>
        )}

        {id === "beelzebub" && (
          <>
            <div className="core" />
            <div className="crown" />
            <div className="swarm">
              {Array.from({ length: 12 }, (_, i) => (
                <b
                  key={i}
                  style={
                    {
                      "--a": `${i * 30}deg`,
                      "--r": `${54 + (i % 3) * 14}px`,
                      "--y": `${((i * 17) % 80) - 40}px`,
                    } as React.CSSProperties
                  }
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
