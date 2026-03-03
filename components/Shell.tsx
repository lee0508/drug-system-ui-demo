"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem =
  | { type: "link"; href: string; label: string }
  | { type: "section"; label: string };

const nav: NavItem[] = [
  { type: "section", label: "주요 업무" },
  { type: "link", href: "/",                  label: "개요(모듈)" },
  { type: "link", href: "/subjects",           label: "대상자 관리" },
  { type: "link", href: "/intake",             label: "접수/초기개입" },
  { type: "link", href: "/education/legal",    label: "재활교육" },
  { type: "link", href: "/cases",              label: "사례관리" },
  { type: "link", href: "/resources",          label: "지역자원관리" },
  { type: "link", href: "/integrations",       label: "연계관리" },
  { type: "link", href: "/stats",              label: "통계 대시보드" },
  { type: "section", label: "운영 관리" },
  { type: "link", href: "/centers",            label: "센터관리" },
  { type: "link", href: "/support",            label: "업무지원" },
  { type: "link", href: "/closing",            label: "마감관리" },
  { type: "link", href: "/admin/users",        label: "권한관리" },
];

export default function Shell({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  const path = usePathname();

  return (
    <div className="container">
      <div className="card" style={{ marginBottom: 12 }}>
        <div className="card-h">
          <div>
            <div style={{ fontSize: 14, fontWeight: 1000 }}>{title}</div>
            {subtitle ? <div style={{ fontSize: 12, opacity: 0.9, marginTop: 4 }}>{subtitle}</div> : null}
          </div>
          <span className="pill">업무용 화면(예시)</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 12 }}>
        <aside className="card" style={{ overflow: "hidden", alignSelf: "start" }}>
          <div className="card-h" style={{ fontSize: 13 }}>메뉴</div>
          <div className="card-b" style={{ display: "grid", gap: 4, padding: "8px 10px" }}>
            {nav.map((x, i) => {
              if (x.type === "section") {
                return (
                  <div key={i} style={{
                    fontSize: 10, fontWeight: 900, color: "var(--muted)",
                    letterSpacing: ".08em", textTransform: "uppercase",
                    padding: "8px 4px 2px",
                    borderTop: i > 0 ? "1px solid var(--line)" : "none",
                    marginTop: i > 0 ? 4 : 0,
                  }}>
                    {x.label}
                  </div>
                );
              }
              const active = path === x.href || (x.href !== "/" && path.startsWith(x.href));
              return (
                <Link key={x.href} href={x.href} className="btn" style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: 13,
                  padding: "8px 10px",
                  background: active ? "linear-gradient(180deg,var(--blue),var(--blue2))" : "#fff",
                  color: active ? "#fff" : "var(--ink)",
                  borderColor: active ? "transparent" : "var(--line)",
                }}>
                  <span>{x.label}</span>
                  <span style={{ fontWeight: 900, opacity: 0.9 }}>→</span>
                </Link>
              );
            })}
            <div className="muted" style={{ marginTop: 8, fontSize: 11 }}>
              ※ 역할(RBAC)에 따라 메뉴/기능이 제한될 수 있습니다.
            </div>
          </div>
        </aside>

        <main style={{ minWidth: 0 }}>{children}</main>
      </div>
    </div>
  );
}
