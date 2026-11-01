// Soft glowing motes that rise slowly, like embers or spirits. Pure CSS, server rendered.
// Values are fixed (not random) so server and browser render the same markup.
const MOTES = Array.from({ length: 14 }, (_, i) => ({
  left: (i * 37 + 11) % 100,
  size: 3 + ((i * 5) % 5),
  delay: -((i * 3.7) % 24),
  dur: 20 + ((i * 7) % 16),
  drift: ((i * 13) % 40) - 20,
}));

export default function Spirits() {
  return (
    <div className="spirits" aria-hidden="true">
      {MOTES.map((m, i) => (
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
  );
}
