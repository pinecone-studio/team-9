const radius = 44;
const circumference = 2 * Math.PI * radius;
const segments = [
  { color: "#3f7ae8", length: 58, offset: 0 },
  { color: "#29c159", length: 52, offset: 70 },
  { color: "#f24949", length: 50, offset: 136 },
  { color: "#e7b106", length: 26, offset: 198 },
] as const;

export default function EligibilityDonut() {
  return (
    <svg
      aria-hidden="true"
      className="h-36 w-36 shrink-0"
      viewBox="0 0 140 140"
    >
      <g transform="rotate(-90 70 70)">
        {segments.map(({ color, length, offset }) => (
          <circle
            key={color}
            cx="70"
            cy="70"
            fill="none"
            r={radius}
            stroke={color}
            strokeDasharray={`${length} ${circumference - length}`}
            strokeDashoffset={-offset}
            strokeLinecap="round"
            strokeWidth="20"
          />
        ))}
      </g>
      <circle cx="70" cy="70" fill="white" r="32" />
    </svg>
  );
}
