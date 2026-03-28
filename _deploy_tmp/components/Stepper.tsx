"use client";

export default function Stepper({
  steps,
  active,
}: {
  steps: { key: string; label: string }[];
  active: string;
}) {
  return (
    <div style={{ display: "grid", gap: 8 }}>
      {steps.map((s, idx) => {
        const isActive = s.key === active;
        return (
          <div key={s.key} style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            padding: "10px 12px",
            borderRadius: 14,
            border: `1px solid ${isActive ? "transparent" : "var(--line)"}`,
            background: isActive ? "linear-gradient(180deg,var(--blue),var(--blue2))" : "#fff",
            color: isActive ? "#fff" : "var(--ink)",
          }}>
            <div style={{
              width: 24, height: 24, borderRadius: 999,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: isActive ? "rgba(255,255,255,.2)" : "var(--soft)",
              fontWeight: 1000,
            }}>
              {idx + 1}
            </div>
            <div style={{ fontWeight: 1000 }}>{s.label}</div>
          </div>
        );
      })}
    </div>
  );
}
