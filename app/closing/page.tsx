"use client";

import Shell from "@/components/Shell";
import { useState } from "react";

const PERIODS = [
  { key: "monthly",   label: "월간 마감" },
  { key: "quarterly", label: "분기 마감" },
  { key: "annual",    label: "연간 마감" },
];

type CheckItem = { id: string; label: string; done: boolean };

const MONTHLY_CHECKS: CheckItem[] = [
  { id: "m1", label: "이달 접수 건수 확정 및 통계 반영", done: true },
  { id: "m2", label: "케이스 현황 최종 확인 (NEW/IN_PROGRESS/MONITORING/CLOSED)", done: true },
  { id: "m3", label: "국가통계 월간 지표 입력 완료", done: false },
  { id: "m4", label: "연계 로그 이상 여부 확인", done: false },
  { id: "m5", label: "보고서 초안 생성 및 담당자 검토 요청", done: false },
];

const HISTORY = [
  { period: "2026-02", type: "월간", closedAt: "2026-03-02", operator: "관리자", status: "완료" },
  { period: "2025-Q4", type: "분기", closedAt: "2026-01-10", operator: "관리자", status: "완료" },
  { period: "2025-12", type: "월간", closedAt: "2026-01-03", operator: "관리자", status: "완료" },
];

export default function ClosingPage() {
  const [tab, setTab] = useState("monthly");
  const [checks, setChecks] = useState(MONTHLY_CHECKS);

  const toggle = (id: string) => {
    setChecks((prev) => prev.map((c) => c.id === id ? { ...c, done: !c.done } : c));
  };

  const doneCount = checks.filter((c) => c.done).length;
  const allDone = doneCount === checks.length;

  return (
    <Shell title="마감관리" subtitle="월간 · 분기 · 연간 마감 처리 및 이력">

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {PERIODS.map((p) => (
          <button
            key={p.key}
            className="btn"
            onClick={() => setTab(p.key)}
            style={{
              background: tab === p.key ? "linear-gradient(180deg,var(--blue),var(--blue2))" : "#fff",
              color: tab === p.key ? "#fff" : "var(--ink)",
              borderColor: tab === p.key ? "transparent" : "var(--line)",
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid2">

        <div className="card">
          <div className="card-h">
            <span>마감 체크리스트</span>
            <span className="pill">{doneCount} / {checks.length}</span>
          </div>
          <div className="card-b" style={{ display: "grid", gap: 8 }}>
            {checks.map((c) => (
              <label
                key={c.id}
                style={{
                  display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
                  padding: "10px 12px", borderRadius: 10,
                  border: "1px solid var(--line)",
                  background: c.done ? "#f0fdf4" : "#fff",
                }}
              >
                <input type="checkbox" checked={c.done} onChange={() => toggle(c.id)} style={{ width: 16, height: 16 }} />
                <span style={{ fontWeight: c.done ? 400 : 1000, textDecoration: c.done ? "line-through" : "none", color: c.done ? "var(--muted)" : "var(--ink)" }}>
                  {c.label}
                </span>
              </label>
            ))}

            <div className="hr" />

            <button
              className="btn primary"
              disabled={!allDone}
              style={{ opacity: allDone ? 1 : 0.4 }}
            >
              {allDone ? "✅ 마감 처리 실행" : `마감 처리 (${checks.length - doneCount}개 항목 미완료)`}
            </button>
            <div className="muted">※ 모든 항목 완료 후 마감 처리가 가능합니다.</div>
          </div>
        </div>

        <div className="card">
          <div className="card-h"><span>마감 이력</span></div>
          <div className="card-b">
            <table className="table">
              <thead>
                <tr><th>기간</th><th>유형</th><th>처리일</th><th>처리자</th><th>상태</th></tr>
              </thead>
              <tbody>
                {HISTORY.map((h) => (
                  <tr key={h.period}>
                    <td style={{ fontWeight: 1000 }}>{h.period}</td>
                    <td>{h.type}</td>
                    <td>{h.closedAt}</td>
                    <td>{h.operator}</td>
                    <td><span className="badge" style={{ background: "#16a34a" }}>{h.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </Shell>
  );
}
