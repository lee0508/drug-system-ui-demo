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

type MonthlyRow = { yyyymm: string; intakeCount?: number; caseCount?: number };
type Report = { reportId: string; reportType: string; title?: string; status: string; createdAt: string };
type DrugTypeStat = { drugCd: string; count: number };
type TestResultStat = { resultCode: string; count: number };
type TestTypeStat = { testTypeCode: string; count: number };
type ReferralStatusStat = { statusCode: string; count: number };
type ProgramEnrollStat = { programId: string; programName: string; count: number };

type StatsData = {
  kpi: Kpi;
  monthly: MonthlyRow[];
  reports: Report[];
  drugTypes: DrugTypeStat[];
  testResults: TestResultStat[];
  testTypes: TestTypeStat[];
  referralStatus: ReferralStatusStat[];
  programEnrolls: ProgramEnrollStat[];
};

const REPORT_TYPE_LABEL: Record<string, string> = {
  BASE: "기초통계", NATIONAL: "국가통계", LINE_1342: "1342 통계", MULTIDIM: "다차원통계",
};
const DRUG_LABELS: Record<string, string> = {
  METH: "필로폰", HEROIN: "헤로인", THC: "대마", COCAINE: "코카인",
  FENTANYL: "펜타닐", MDMA: "MDMA", OTHER: "기타",
};
const TEST_TYPE_LABELS: Record<string, string> = {
  URINE: "소변", BLOOD: "혈액", HAIR: "모발", SALIVA: "타액",
};
const RESULT_LABELS: Record<string, string> = {
  POSITIVE: "양성", NEGATIVE: "음성", INCONCLUSIVE: "불확정",
};
const RESULT_BG: Record<string, string> = {
  POSITIVE: "#fce4e4", NEGATIVE: "#e4f5e4", INCONCLUSIVE: "#f5f5e4",
};
const REFERRAL_STATUS: Record<string, string> = {
  OPEN: "진행 중", IN_PROGRESS: "처리 중", CLOSED: "종결",
};

function Bar({ value, max, color = "var(--blue)" }: { value: number; max: number; color?: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
      <div style={{ flex: 1, background: "#f0f0f0", borderRadius: 4, height: 14, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 4, transition: "width 0.3s" }} />
      </div>
      <span style={{ minWidth: 28, textAlign: "right", fontWeight: 700 }}>{value}</span>
    </div>
  );
}

function StatsContent() {
  const sp = useSearchParams();
  const tab = sp.get("tab") ?? "base";

  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const kpi = data?.kpi;
  const series = data?.monthly.slice().reverse().map(m => m.intakeCount ?? 0) ?? [];

  const drugMax = Math.max(...(data?.drugTypes ?? []).map(d => d.count), 1);
  const testMax = Math.max(...(data?.testTypes ?? []).map(t => t.count), 1);
  const refMax = Math.max(...(data?.referralStatus ?? []).map(r => r.count), 1);
  const pgMax = Math.max(...(data?.programEnrolls ?? []).map(p => p.count), 1);

  return (
    <Shell title="통계 대시보드" subtitle="기초/국가/다차원/1342/보고서 지표">
      {/* 핵심 KPI */}
      <div className="card" style={{ marginBottom: 12 }}>
        <div className="card-h">
          <span>핵심 지표</span>
          <span className="pill">tab={tab}</span>
        </div>
        <div className="card-b">
          {loading ? (
            <div className="muted" style={{ textAlign: "center", padding: 32 }}>불러오는 중...</div>
          ) : (
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
          )}
        </div>
      </div>

      {/* 약물/검사 통계 */}
      {!loading && (
        <div className="grid2" style={{ gap: 12, marginBottom: 12 }}>
          {/* 마약 유형별 */}
          <div className="card">
            <div className="card-h"><span>마약 유형별 대상자</span></div>
            <div className="card-b" style={{ display: "grid", gap: 8 }}>
              {(data?.drugTypes ?? []).length === 0 ? (
                <div className="muted">데이터 없음</div>
              ) : (
                data!.drugTypes.map(d => (
                  <div key={d.drugCd}>
                    <div style={{ fontSize: 12, marginBottom: 2 }}>{DRUG_LABELS[d.drugCd] ?? d.drugCd}</div>
                    <Bar value={d.count} max={drugMax} color="var(--blue)" />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 검사 결과별 */}
          <div className="card">
            <div className="card-h"><span>검사 결과 분포</span></div>
            <div className="card-b" style={{ display: "grid", gap: 12 }}>
              {(data?.testResults ?? []).length === 0 ? (
                <div className="muted">데이터 없음</div>
              ) : (
                <>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {data!.testResults.map(r => (
                      <div key={r.resultCode} className="kpi" style={{ flex: "1 1 80px", minWidth: 80, padding: "8px 12px" }}>
                        <div className="label">{RESULT_LABELS[r.resultCode] ?? r.resultCode}</div>
                        <div className="value" style={{ fontSize: 22 }}>{r.count}</div>
                        <span className="badge" style={{ background: RESULT_BG[r.resultCode], color: "var(--ink)", marginTop: 4 }}>
                          {r.resultCode}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div style={{ borderTop: "1px solid var(--line)", paddingTop: 8 }}>
                    <div style={{ fontWeight: 700, fontSize: 12, marginBottom: 6 }}>검사 유형별</div>
                    {data!.testTypes.map(t => (
                      <div key={t.testTypeCode} style={{ marginBottom: 6 }}>
                        <div style={{ fontSize: 12, marginBottom: 2 }}>{TEST_TYPE_LABELS[t.testTypeCode] ?? t.testTypeCode}</div>
                        <Bar value={t.count} max={testMax} color="#6c757d" />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 의뢰/연계 현황 */}
          <div className="card">
            <div className="card-h"><span>의뢰/연계 상태별</span></div>
            <div className="card-b" style={{ display: "grid", gap: 8 }}>
              {(data?.referralStatus ?? []).length === 0 ? (
                <div className="muted">데이터 없음</div>
              ) : (
                data!.referralStatus.map(r => (
                  <div key={r.statusCode}>
                    <div style={{ fontSize: 12, marginBottom: 2 }}>{REFERRAL_STATUS[r.statusCode] ?? r.statusCode}</div>
                    <Bar value={r.count} max={refMax} color="#198754" />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 프로그램 참가자 현황 */}
          <div className="card">
            <div className="card-h"><span>프로그램 참가자 (상위 5)</span></div>
            <div className="card-b" style={{ display: "grid", gap: 8 }}>
              {(data?.programEnrolls ?? []).length === 0 ? (
                <div className="muted">데이터 없음</div>
              ) : (
                data!.programEnrolls.map(p => (
                  <div key={p.programId}>
                    <div style={{ fontSize: 12, marginBottom: 2 }}>{p.programName}</div>
                    <Bar value={p.count} max={pgMax} color="#dc3545" />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 월별 추이 + 보고서 */}
      {!loading && (
        <div className="grid2" style={{ gap: 12 }}>
          <div className="card">
            <div className="card-b">
              <div style={{ fontWeight: 1000, marginBottom: 8 }}>월별 접수 추이 (최근 {series.length}개월)</div>
              {series.length > 0 ? <MiniChart values={series} /> : <div className="muted">월별 통계 데이터가 없습니다.</div>}
              <div className="muted" style={{ marginTop: 8 }}>※ 월별 통계는 배치 집계 후 표시됩니다.</div>
            </div>
          </div>

          <div className="card">
            <div className="card-b">
              <div style={{ fontWeight: 1000, marginBottom: 8 }}>보고서 현황</div>
              {(data?.reports ?? []).length === 0 ? (
                <div className="muted">생성된 보고서가 없습니다.</div>
              ) : (
                <table className="table">
                  <thead><tr><th>유형</th><th>제목</th><th>상태</th><th>생성일</th></tr></thead>
                  <tbody>
                    {data!.reports.map(r => (
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
      )}
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
