export default function MiniChart({ values }: { values: number[] }) {
  const max = Math.max(...values, 1);
  const pts = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * 280;
      const y = 60 - (v / max) * 60;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width="280" height="70" viewBox="0 0 280 70" style={{ display: "block" }}>
      <polyline fill="none" stroke="currentColor" strokeWidth="2.5" points={pts} />
      <line x1="0" y1="62" x2="280" y2="62" stroke="currentColor" opacity="0.15" />
    </svg>
  );
}
