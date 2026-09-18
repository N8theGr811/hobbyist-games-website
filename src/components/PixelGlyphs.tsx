import type { Store } from "@/lib/stores";

/**
 * Small pixel-art icons, drawn as SVG on a grid so every art pixel lands on a
 * whole number of screen pixels. Each row is a string: "#" is solid, "+" is a
 * faint fill, anything else is empty.
 *
 * The arrow exists because Press Start 2P has no "→". The text arrow falls
 * back to a thin system glyph, which looked spindly beside the device icons.
 */
type Art = readonly string[];

const DEVICES: Record<Store["device"], Art> = {
  desktop: [
    "............",
    "############",
    "#++++++++++#",
    "#++++++++++#",
    "#++++++++++#",
    "#++++++++++#",
    "#++++++++++#",
    "############",
    ".....##.....",
    ".....##.....",
    "...######...",
    "............",
  ],
  phone: [
    "...######...",
    "...#+##+#...",
    "...#++++#...",
    "...#++++#...",
    "...#++++#...",
    "...#++++#...",
    "...#++++#...",
    "...#++++#...",
    "...#++++#...",
    "...#++++#...",
    "...#++++#...",
    "...######...",
  ],
};

/** For a platform that is coming but not here: sand still falling. */
const HOURGLASS: Art = [
  "############",
  ".#........#.",
  "..#++++++#..",
  "...#++++#...",
  "....#++#....",
  ".....##.....",
  ".....##.....",
  "....#..#....",
  "...#....#...",
  "..#..++..#..",
  ".#.++++++.#.",
  "############",
];

const ARROW: Art = [
  "....#...",
  "....##..",
  "....###.",
  "########",
  "....###.",
  "....##..",
  "....#...",
];

/** 24px: two screen pixels per art pixel. */
export function DeviceGlyph({ device }: { device: Store["device"] }) {
  return <Glyph art={DEVICES[device]} scale={2} className="shrink-0" />;
}

/** 24px, to sit in the same slot as a DeviceGlyph. */
export function HourglassGlyph() {
  return <Glyph art={HOURGLASS} scale={2} className="shrink-0" />;
}

export function PixelArrow({ scale = 1, className = "" }: { scale?: 1 | 2; className?: string }) {
  return <Glyph art={ARROW} scale={scale} className={`shrink-0 ${className}`} />;
}

function Glyph({ art, scale, className }: { art: Art; scale: number; className: string }) {
  const faint = runsPath(art, "+");
  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${art[0].length} ${art.length}`}
      width={art[0].length * scale}
      height={art.length * scale}
      shapeRendering="crispEdges"
      className={className}
    >
      {faint && <path d={faint} fill="currentColor" opacity={0.22} />}
      <path d={runsPath(art, "#")} fill="currentColor" />
    </svg>
  );
}

/** One rectangle per horizontal run of `cell`, so a row is one shape, not twelve. */
function runsPath(art: Art, cell: string): string {
  let d = "";
  art.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      if (row[x] !== cell) continue;
      const start = x;
      while (row[x + 1] === cell) x++;
      const width = x - start + 1;
      d += `M${start} ${y}h${width}v1h-${width}z`;
    }
  });
  return d;
}
