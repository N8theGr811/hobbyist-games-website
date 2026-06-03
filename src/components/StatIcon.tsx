import Image from "next/image";

export type StatName =
  | "heart"
  | "cardio"
  | "strength"
  | "submissions"
  | "escapes"
  | "leg-locks"
  | "passing"
  | "wrestling"
  | "guard";

interface StatIconProps {
  name: StatName;
  size?: number;
  /** Alt text (also used as hover tooltip if title is omitted) */
  alt?: string;
}

const LABELS: Record<StatName, string> = {
  heart: "Health",
  cardio: "Cardio",
  strength: "Strength",
  submissions: "Submissions",
  escapes: "Escapes",
  "leg-locks": "Leg Locks",
  passing: "Passing",
  wrestling: "Wrestling",
  guard: "Guard",
};

export default function StatIcon({ name, size = 48, alt }: StatIconProps) {
  const label = LABELS[name];
  return (
    <Image
      src={`/stat-icons/${name}.png`}
      alt={alt ?? label}
      title={label}
      width={size}
      height={size}
      style={{ width: size, height: size, imageRendering: "auto" }}
    />
  );
}
