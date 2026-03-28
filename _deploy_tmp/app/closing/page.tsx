"use client";

import Shell from "@/components/Shell";
import { useEffect, useState, useCallback } from "react";

type TplItem = {
  tplId: string;
  closingType: string;
  checkItem: string;
  sortOrder: number;
};

type HistoryRow = {
  closingId: string;
  closingType: string;
  periodLabel: string;
  status: string;
  closedAt?: string;
  closedBy?: string;
  createdAt: string;
};

const PERIODS = [
  { key: "MONTHLY",   label: "월간 마감" },
  { key: "QUARTERLY", label: "분기 마감" },
  { key: "ANNUAL",    label: "연간 마감" },
];

const TYPE_LABEL: Record<string, string> = {
  MONTHLY: "월간", QUARTERLY: "분기", ANNUAL: "연간",
};

function getPeriodLabel(type: string) {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const q = Math.ceil((now.getMonth() + 1) / 3);
  if (type === "MONTHLY") return `${y}-${m}`;
  if (type === "QUARTERLY") return `${y}-Q${q}`;
  return String(y);
}

export default function ClosingPage() {
  const [tab, setTab] = useState("MONTHLY");
  const [templates, setTemplates] = useState<TplItem[]>([]);
  const [history, setHistory] = useState<HistoryRow[]>([]);
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    fetch(`/api/closing?type=${tab}`)
      .then((r) => r.json())
      .then((data) => {
        const tpls: TplItem[] = data.templates ?? [];
        setTemplates(tpls);
        setHistory(data.history ?? []);
        const init: Record<string, boolean> = {};
        tpls.forEach((t) => { init[t.tplId] = false; });
        setChecks(init);
      })
      .finally(() => setLoading(false));
  }, [tab]);

  useEffect(() => { load(); }, [load]);

  const toggle = (id: string) =>
    setChecks((prev) => ({ ...prev, [id]: !prev[id] }));

  const doneCount = Object.values(checks).filter(Boolean).length;
  const allDone = templates.length > 0 && doneCount === templates.length;

  const handleClose = async () => {
    if (!allDone) return;
    setSubmitting(true);
    try {
      await fetch("/api/closing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          closingType: tab,
          periodLabel: getPeriodLabel(tab),
          closedBy: "관리자",
        }),
      });
      load();
    } finally {
      setSubmitting(false);
    }
  };

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
            <span className="pill">{doneCount} / {templates.length}</span>
          </div>
          <div className="card-b" style={{ display: "grid", gap: 8 }}>
            {loading ? (
              <div className="muted" style={{ textAlign: "center", padding: 24 }}>불러오는 중...</div>
            ) : templates.length === 0 ? (
              <div className="muted" style={{ textAlign: "center", padding: 24 }}>체크리스트 항목이 없습니다.</div>
            ) : (
              templates.map((t) => (
                <label
                  key={t.tplId}
                  style={{
                    display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
                    padding: "10px 12px", borderRadius: 10,
                    border: "1px solid var(--line)",
                    background: checks[t.tplId] ? "#f0fdf4" : "#fff",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={!!checks[t.tplId]}
                    onChange={() => toggle(t.tplId)}
                    style={{ width: 16, height: 16 }}
                  />
                  <span style={{
                    fontWeight: checks[t.tplId] ? 400 : 1000,
                    textDecoration: checks[t.tplId] ? "line-through" : "none",
                    color: checks[t.tplId] ? "var(--muted)" : "var(--ink)",
                  }}>
                    {t.checkItem}
                  </span>
                </label>
              ))
            )}

            <div className="hr" />

            <button
              className="btn primary"
              disabled={!allDone || submitting}
              style={{ opacity: allDone ? 1 : 0.4 }}
              onClick={handleClose}
            >
              {submitting ? "처리 중..." : allDone ? "✅ 마감 처리 실행" : `마감 처리 (${templates.length - doneCount}개 항목 미완료)`}
            </button>
            <div className="muted">※ 모든 항목 완료 후 마감 처리가 가능합니다.</div>
          </div>
        </div>

        <div className="card">
          <div className="card-h">
            <span>마감 이력</span>
            <span className="pill">{history.length}건</span>
          </div>
          <div className="card-b">
            {history.length === 0 ? (
              <div className="muted" style={{ textAlign: "center", padding: 24 }}>마감 이력이 없습니다.</div>
            ) : (
              <table className="table">
                <thead>
                  <tr><th>기간</th><th>유형</th><th>처리일</th><th>처리자</th><th>상태</th></tr>
                </thead>
                <tbody>
                  {history.map((h) => (
                    <tr key={h.closingId}>
                      <td style={{ fontWeight: 1000 }}>{h.periodLabel}</td>
                      <td>{TYPE_LABEL[h.closingType] ?? h.closingType}</td>
                      <td>{h.closedAt ? new Date(h.closedAt).toLocaleDateString() : "-"}</td>
                      <td>{h.closedBy ?? "-"}</td>
                      <td>
                        <span className="badge" style={{ background: h.status === "CLOSED" ? "#16a34a" : undefined }}>
                          {h.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
    </Shell>
  );
}
