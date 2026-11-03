// Small line icons (24x24). Decorative: always aria-hidden.
const PATHS = {
  book: ["M5 3h11a3 3 0 0 1 3 3v15H8a3 3 0 0 1-3-3V3z", "M5 18a3 3 0 0 1 3-3h11"],
  sun: ["M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z", "M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"],
  heart: ["M12 21s-7-4.5-9.3-9A5.2 5.2 0 0 1 12 6.6 5.2 5.2 0 0 1 21.3 12C19 16.5 12 21 12 21z"],
  music: ["M9 18V5l11-2v13", "M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0z", "M20 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"],
  cross: ["M12 2v20", "M6 8h12"],
  church: ["M12 2v4M10 4h4", "M5 22V12l7-5 7 5v10", "M10 22v-5h4v5"],
  gift: ["M3 9h18v4H3z", "M5 13v8h14v-8", "M12 9v12", "M12 9c-2.5 0-4-1-4-2.5S9.5 4 12 9c2.5-5 4-3.5 4-2.5S14.5 9 12 9z"],
  users: ["M16 20v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 18.5V20", "M10 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z", "M20 20v-1.5a3.5 3.5 0 0 0-2.5-3.3", "M15.5 5.2a3.5 3.5 0 0 1 0 6.6"],
  chat: ["M21 12a8 8 0 0 1-11.5 7.2L3 21l1.8-5.5A8 8 0 1 1 21 12z"],
  flame: ["M12 22c4 0 7-2.8 7-6.8 0-3-1.8-4.8-3.3-6.6-.9-1.1-1.4-2.4-1.5-4-2.6 1.6-4.2 4.1-4.2 6.5-1 0-1.9-.8-2-2C6.5 11 5 13 5 15.2 5 19.2 8 22 12 22z"],
  sparkle: ["M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z"],
  cloud: ["M7 18a4 4 0 0 1-.5-8A6 6 0 0 1 18 9.5 4.3 4.3 0 0 1 17.5 18H7z"],
  card: ["M3 6h18v12H3z", "M3 10h18", "M7 15h4"],
} as const;

export type IconName = keyof typeof PATHS;

export default function Icon({ name, size = 22 }: { name: IconName; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {PATHS[name].map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}
