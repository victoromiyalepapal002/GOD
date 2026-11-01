import type { Realm } from "@/lib/realms";

// Light 3D scenes made only of CSS. Heaven: a glass gate opening onto light.
// Hell: glowing rings sinking into a pit. No images, no 3D library.
export default function RealmArt({ realm }: { realm: Realm }) {
  if (realm === "heaven") {
    return (
      <div className="realm-art" aria-hidden="true">
        <div className="gate">
          <div className="gate-light" />
          <div className="door l" />
          <div className="door r" />
          <div className="gate-floor" />
        </div>
      </div>
    );
  }
  return (
    <div className="realm-art" aria-hidden="true">
      <div className="pit-core" />
      <div className="pit">
        {[0, 1, 2, 3, 4, 5].map((k) => (
          <i key={k} style={{ "--k": k } as React.CSSProperties} />
        ))}
      </div>
    </div>
  );
}
