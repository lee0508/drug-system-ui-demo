"use client";

import Shell from "@/components/Shell";
import MiniChart from "@/components/MiniChart";
import { useApp } from "@/components/AppProvider";
import { useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function StatsContent() {
  const { intakes, cases } = useApp();
  const sp = useSearchParams();
  const tab = sp.get("tab") ?? "base";

  const kpi = useMemo(() => {
    const intakeTotal = intakes.length;
    const intake1342 = intakes.filter((i) => i.source === "1342").length;
    const caseTotal = cases.length;
    const inProgress = cases.filter((c) => c.status === "IN_PROGRESS").length;
    const monitoring = cases.filter((c) => c.status === "MONITORING").length;
    const closed = cases.filter((c) => c.status === "CLOSED").length;
    return { intakeTotal, intake1342, caseTotal, inProgress, monitoring, closed };
  }, [intakes, cases]);

  const series = tab === "1342"
    ? [5, 8, 7, 12, 10, 13, 15]
    : tab === "national"
    ? [2, 3, 3, 4, 6, 5, 7]
    : [4, 6, 6, 8, 9, 9, 11];

  return (
    <Shell title="통계 대시보드" subtitle="기초/국가/다차원/1342/보고서(예시 지표)">
      <div className="card">
        <div className="card-h">
          <span>핵심 지표</span>
          <span className="pill">tab={tab}</span>
        </div>
        <div className="card-b">
          <div className="grid3">
            <div className="kpi"><div className="label">접수 총건</div><div className="value">{kpi.intakeTotal}</div></div>
            <div className="kpi"><div className="label">1342 접수</div><div className="value">{kpi.intake1342}</div></div>
            <div className="kpi"><div className="label">케이스 총건</div><div className="value">{kpi.caseTotal}</div></div>
            <div className="kpi"><div className="label">진행(IN_PROGRESS)</div><div className="value">{kpi.inProgress}</div></div>
            <div className="kpi"><div className="label">모니터링</div><div className="value">{kpi.monitoring}</div></div>
            <div className="kpi"><div className="label">종결(CLOSED)</div><div className="value">{kpi.closed}</div></div>
          </div>

          <div className="hr" />

          <div className="grid2">
            <div className="card" style={{ boxShadow: "none" }}>
              <div className="card-b">
                <div style={{ fontWeight: 1000, marginBottom: 8 }}>추이(예시)</div>
                <MiniChart values={series} />
                <div className="muted">※ 실제 구현에서는 지표 정의서 기반으로 확장합니다.</div>
              </div>
            </div>

            <div className="card" style={{ boxShadow: "none" }}>
              <div className="card-b">
                <div style={{ fontWeight: 1000, marginBottom: 8 }}>보고서(예시)</div>
                <table className="table">
                  <thead><tr><th>유형</th><th>설명</th><th>상태</th></tr></thead>
                  <tbody>
                    <tr><td style={{ fontWeight: 1000 }}>기초통계</td><td className="muted">센터 운영 KPI</td><td><span className="badge">READY</span></td></tr>
                    <tr><td style={{ fontWeight: 1000 }}>1342 통계</td><td className="muted">콜 인입/이관 등</td><td><span className="badge">READY</span></td></tr>
                    <tr><td style={{ fontWeight: 1000 }}>국가통계</td><td className="muted">정책 보고</td><td><span className="badge">DRAFT</span></td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Shell>
  );
}

export default function StatsPage() {
  return (
    <Suspense fallback={null}>
      <StatsContent />
    </Suspense>
  );
}
