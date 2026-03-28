"use client";

import Shell from "@/components/Shell";
import Link from "next/link";
import { useState, useEffect } from "react";

function fmt(ts: string) {
  const d = new Date(ts);
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
}

type CaseRow = {
  caseId: string;
  subjectLabel: string;
  centerId: string | null;
  status: string;
  triage: string;
  updatedAt: string;
};

export default function CasesPage() {
  const [cases, setCases] = useState<CaseRow[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetch("/api/cases")
      .then((r) => r.json())
      .then((data) => {
        setCases(data.items ?? []);
        setTotal(data.total ?? 0);
      });
  }, []);

  return (
    <Shell
      title="사례관리(목록)"
      subtitle="케이스 조회 → 상세(상담/지원/모니터링/종결) → ISP 수립"
    >
      <div className="card">
        <div className="card-h">
          <span>케이스 목록</span>
          <span className="pill">{total} cases</span>
        </div>
        <div className="card-b">
          <table className="table">
            <thead>
              <tr>
                <th>케이스</th>
                <th>센터</th>
                <th>상태</th>
                <th>긴급도</th>
                <th>최근 업데이트</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cases.map((c) => (
                <tr key={c.caseId}>
                  <td style={{ fontWeight: 1000 }}>
                    {c.subjectLabel}
                    <div className="muted">ID: {c.caseId}</div>
                  </td>
                  <td>{c.centerId ?? "-"}</td>
                  <td>{c.status}</td>
                  <td>{c.triage}</td>
                  <td>{fmt(c.updatedAt)}</td>
                  <td>
                    <Link className="btn primary" href={`/cases/${c.caseId}`}>
                      상세
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="muted" style={{ marginTop: 8 }}>
            ※ 상세 화면에서 ISP 수립(/isp/[caseId]) 및 연계/통계로 확장합니다.
          </div>
        </div>
      </div>
    </Shell>
  );
}
