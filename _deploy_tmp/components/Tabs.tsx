"use client";

export default function Tabs({
  tabs,
  active,
  onChange,
}: {
  tabs: { key: string; label: string }[];
  active: string;
  onChange: (key: string) => void;
}) {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {tabs.map((t) => {
        const isActive = t.key === active;
        return (
          <button
            key={t.key}
            className={"btn " + (isActive ? "primary" : "")}
            onClick={() => onChange(t.key)}
            style={{ padding: "10px 12px" }}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
