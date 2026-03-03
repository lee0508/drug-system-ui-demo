"use client";

import Shell from "@/components/Shell";
import MiniChart from "@/components/MiniChart";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

type Kpi = {
  intakeTotal: number;
  intake1342: number;
  caseTotal: number;
  caseNew: number;
  caseInProgress: number;
  caseMonitoring: number;
  caseClosed: number;
  subjectActive: number;
};

type MonthlyRow = {
  yyyymm: string;
  intakeCount?: number;
  caseCount?: number;
};

type Report = {
  reportId: string;
  reportType: string;
  title?: string;
  status: string;
  createdAt: string;
};

type StatsData = {
  kpi: Kpi;
  monthly: MonthlyRow[];
  reports: Report[];
};

const REPORT_TYPE_LABEL: Record<string, string> = {
  BASE: "기초통계",
  NATIONAL: "국가통계",
  LINE_1342: "1342 통계",
  MULTIDIM: "다차원통계",
};

function StatsContent() {
  const sp = useSearchParams();
  const tab = sp.get("tab") ?? "base";

  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const kpi = data?.kpi;

  // 월별 추이 차트 (최근 6개월 intakeCount 기준, 없으면 빈 배열)
  const series = data?.monthly
    .slice()
    .reverse()
    .map((m) => m.intakeCount ?? 0) ?? [];

  return (
    <Shell title="통계 대시보드" subtitle="기초/국가/다차원/1342/보고서 지표">
      <div className="card">
        <div className="card-h">
          <span>핵심 지표</span>
          <span className="pill">tab={tab}</span>
        </div>
        <div className="card-b">
          {loading ? (
            <div className="muted" style={{ textAlign: "center", padding: 32 }}>불러오는 중...</div>
          ) : (
            <>
              <div className="grid3">
                <div className="kpi"><div className="label">접수 총건</div><div className="value">{kpi?.intakeTotal ?? 0}</div></div>
                <div className="kpi"><div className="label">1342 접수</div><div className="value">{kpi?.intake1342 ?? 0}</div></div>
                <div className="kpi"><div className="label">케이스 총건</div><div className="value">{kpi?.caseTotal ?? 0}</div></div>
                <div className="kpi"><div className="label">신규(NEW)</div><div className="value">{kpi?.caseNew ?? 0}</div></div>
                <div className="kpi"><div className="label">진행(IN_PROGRESS)</div><div className="value">{kpi?.caseInProgress ?? 0}</div></div>
                <div className="kpi"><div className="label">모니터링</div><div className="value">{kpi?.caseMonitoring ?? 0}</div></div>
                <div className="kpi"><div className="label">종결(CLOSED)</div><div className="value">{kpi?.caseClosed ?? 0}</div></div>
                <div className="kpi"><div className="label">활성 대상자</div><div className="value">{kpi?.subjectActive ?? 0}</div></div>
              </div>

              <div className="hr" />

              <div className="grid2">
                <div className="card" style={{ boxShadow: "none" }}>
                  <div className="card-b">
                    <div style={{ fontWeight: 1000, marginBottom: 8 }}>
                      월별 접수 추이 (최근 {series.length}개월)
                    </div>
                    {series.length > 0 ? (
                      <MiniChart values={series} />
                    ) : (
                      <div className="muted">월별 통계 데이터가 없습니다.</div>
                    )}
                    <div className="muted" style={{ marginTop: 8 }}>
                      ※ 월별 통계는 배치 집계 후 표시됩니다.
                    </div>
                  </div>
                </div>

                <div className="card" style={{ boxShadow: "none" }}>
                  <div className="card-b">
                    <div style={{ fontWeight: 1000, marginBottom: 8 }}>보고서 현황</div>
                    {(data?.reports ?? []).length === 0 ? (
                      <div className="muted">생성된 보고서가 없습니다.</div>
                    ) : (
                      <table className="table">
                        <thead>
                          <tr><th>유형</th><th>제목</th><th>상태</th><th>생성일</th></tr>
                        </thead>
                        <tbody>
                          {data!.reports.map((r) => (
                            <tr key={r.reportId}>
                              <td style={{ fontWeight: 1000 }}>{REPORT_TYPE_LABEL[r.reportType] ?? r.reportType}</td>
                              <td className="muted">{r.title ?? "-"}</td>
                              <td><span className="badge">{r.status}</span></td>
                              <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
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
