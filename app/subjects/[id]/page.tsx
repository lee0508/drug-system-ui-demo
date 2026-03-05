"use client";

import Shell from "@/components/Shell";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Subject = {
  subjectId: string;
  caseNo: string;
  alias: string;
  gender: string;
  birthYear: number;
  regionCd: string;
  entryRoute: string;
  status: string;
  registeredAt: string;
  drugTypes: { drugCd: string; isPrimary: boolean }[];
};

type DrugUse = {
  drugUseId: string;
  substanceCode: string;
  substanceName?: string;
  routeCode?: string;
  lastUseDate?: string;
  severityCode?: string;
  injectionYn: boolean;
  overdoseHistoryYn: boolean;
  abstinentStartDate?: string;
  createdAt: string;
};

type TestResult = {
  testId: string;
  testTypeCode: string;
  testDate: string;
  testOrgNm?: string;
  resultCode: string;
  memo?: string;
  createdAt: string;
};

type Enroll = {
  enrollId: string;
  programId: string;
  enrollDate: string;
  statusCode: string;
  program?: { programName: string; programType: string };
};

type Referral = {
  referralId: string;
  referralType: string;
  fromOrg?: string;
  toOrg?: string;
  referralDate: string;
  statusCode: string;
  summary?: string;
};

const DRUG_LABELS: Record<string, string> = {
  METH: "필로폰(메스암페타민)", HEROIN: "헤로인", THC: "대마", COCAINE: "코카인",
  FENTANYL: "펜타닐", MDMA: "MDMA", OTHER: "기타",
};
const ROUTE_LABELS: Record<string, string> = {
  ORAL: "경구", INHALE: "흡입", INJECT: "주사", OTHER: "기타",
};
const SEV_LABELS: Record<string, string> = { MILD: "경증", MOD: "중등", SEVERE: "중증" };
const TEST_TYPE_LABELS: Record<string, string> = {
  URINE: "소변", BLOOD: "혈액", HAIR: "모발", SALIVA: "타액",
};
const RESULT_LABELS: Record<string, string> = {
  POSITIVE: "양성", NEGATIVE: "음성", INCONCLUSIVE: "불확정",
};
const REF_TYPE_LABELS: Record<string, string> = { IN: "의뢰접수", OUT: "연계처리", RETURN: "회송" };
const STATUS_LABELS: Record<string, string> = { OPEN: "진행 중", IN_PROGRESS: "처리 중", CLOSED: "종결" };

const ENTRY_ROUTES = ["1342", "LEGAL", "SELF", "AGENCY"];
const STATUSES = ["ACTIVE", "MONITORING", "CLOSED"];

export default function SubjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [drugUses, setDrugUses] = useState<DrugUse[]>([]);
  const [tests, setTests] = useState<TestResult[]>([]);
  const [enrolls, setEnrolls] = useState<Enroll[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [tab, setTab] = useState<"info" | "drug" | "test" | "program" | "referral">("info");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ alias: "", gender: "M", birthYear: 0, regionCd: "", entryRoute: "1342", status: "ACTIVE" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`/api/subjects/${id}`).then(r => r.json()),
      fetch(`/api/tests?subjectId=${id}&limit=50`).then(r => r.json()),
      fetch(`/api/referrals?subjectId=${id}&limit=50`).then(r => r.json()),
    ]).then(([s, t, ref]) => {
      setSubject(s);
      setForm({ alias: s.alias, gender: s.gender, birthYear: s.birthYear, regionCd: s.regionCd, entryRoute: s.entryRoute, status: s.status });
      setTests(t.items ?? []);
      setReferrals(ref.items ?? []);
    }).finally(() => setLoading(false));
  }, [id]);

  async function save() {
    setSaving(true);
    await fetch(`/api/subjects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    }).then(r => r.json()).then(updated => {
      setSubject(prev => prev ? { ...prev, ...updated } : updated);
      setEditing(false);
    }).finally(() => setSaving(false));
  }

  const tabStyle = (t: string) => ({
    padding: "6px 14px", cursor: "pointer", fontSize: 13,
    fontWeight: tab === t ? 900 : 400, color: tab === t ? "var(--blue)" : "var(--ink)",
    background: "none", border: "none",
    borderBottom: tab === t ? "2px solid var(--blue)" : "2px solid transparent",
  } as React.CSSProperties);

  if (loading) return <Shell title="대상자 상세"><div className="muted" style={{ padding: 32, textAlign: "center" }}>불러오는 중...</div></Shell>;
  if (!subject) return <Shell title="대상자 상세"><div className="muted" style={{ padding: 32 }}>대상자를 찾을 수 없습니다.</div></Shell>;

  return (
    <Shell title={`대상자 상세 — ${subject.alias}`} subtitle={`관리번호: ${subject.caseNo}`}>
      {/* 탭 헤더 */}
      <div className="card" style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", gap: 0, borderBottom: "1px solid var(--line)", padding: "0 16px" }}>
          {(["info", "drug", "test", "program", "referral"] as const).map(t => (
            <button key={t} style={tabStyle(t)} onClick={() => setTab(t)}>
              {{ info: "기본정보", drug: "약물사용이력", test: "검사결과", program: "프로그램", referral: "의뢰/연계" }[t]}
            </button>
          ))}
        </div>
      </div>

      {/* 기본정보 탭 */}
      {tab === "info" && (
        <div className="card">
          <div className="card-h">
            <span>기본정보</span>
            <div style={{ display: "flex", gap: 8 }}>
              {editing ? (
                <>
                  <button className="btn" onClick={() => setEditing(false)}>취소</button>
                  <button className="btn-primary" onClick={save} disabled={saving}>{saving ? "저장 중..." : "저장"}</button>
                </>
              ) : (
                <button className="btn" onClick={() => setEditing(true)}>수정</button>
              )}
            </div>
          </div>
          <div className="card-b">
            {editing ? (
              <div className="grid2" style={{ gap: 12 }}>
                <label style={{ display: "grid", gap: 4, fontSize: 13 }}>
                  가명 <input className="input" value={form.alias} onChange={e => setForm(f => ({ ...f, alias: e.target.value }))} />
                </label>
                <label style={{ display: "grid", gap: 4, fontSize: 13 }}>
                  성별
                  <select className="input" value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}>
                    <option value="M">남성</option><option value="F">여성</option>
                  </select>
                </label>
                <label style={{ display: "grid", gap: 4, fontSize: 13 }}>
                  출생연도 <input className="input" type="number" value={form.birthYear} onChange={e => setForm(f => ({ ...f, birthYear: parseInt(e.target.value) || 0 }))} />
                </label>
                <label style={{ display: "grid", gap: 4, fontSize: 13 }}>
                  지역코드 <input className="input" value={form.regionCd} onChange={e => setForm(f => ({ ...f, regionCd: e.target.value }))} />
                </label>
                <label style={{ display: "grid", gap: 4, fontSize: 13 }}>
                  유입경로
                  <select className="input" value={form.entryRoute} onChange={e => setForm(f => ({ ...f, entryRoute: e.target.value }))}>
                    {ENTRY_ROUTES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </label>
                <label style={{ display: "grid", gap: 4, fontSize: 13 }}>
                  상태
                  <select className="input" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </label>
              </div>
            ) : (
              <div className="grid2" style={{ gap: 8, fontSize: 13 }}>
                <div><span className="muted">관리번호</span> &nbsp;{subject.caseNo}</div>
                <div><span className="muted">가명</span> &nbsp;{subject.alias}</div>
                <div><span className="muted">성별</span> &nbsp;{subject.gender === "M" ? "남성" : "여성"}</div>
                <div><span className="muted">출생연도</span> &nbsp;{subject.birthYear}</div>
                <div><span className="muted">지역코드</span> &nbsp;{subject.regionCd}</div>
                <div><span className="muted">유입경로</span> &nbsp;{subject.entryRoute}</div>
                <div><span className="muted">상태</span> &nbsp;<span className="badge">{subject.status}</span></div>
                <div><span className="muted">마약유형</span> &nbsp;{subject.drugTypes.map(d => d.drugCd + (d.isPrimary ? "(주)" : "")).join(", ") || "-"}</div>
                <div><span className="muted">등록일</span> &nbsp;{new Date(subject.registeredAt).toLocaleDateString()}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 약물사용이력 탭 */}
      {tab === "drug" && (
        <div className="card">
          <div className="card-h"><span>약물사용이력</span></div>
          <div className="card-b">
            {drugUses.length === 0 ? (
              <div className="muted">등록된 약물사용이력이 없습니다.</div>
            ) : (
              <table className="table">
                <thead><tr><th>물질</th><th>투여경로</th><th>최근사용일</th><th>중증도</th><th>주사여부</th><th>과다복용</th><th>단약시작일</th></tr></thead>
                <tbody>
                  {drugUses.map(d => (
                    <tr key={d.drugUseId}>
                      <td style={{ fontWeight: 900 }}>{DRUG_LABELS[d.substanceCode] ?? d.substanceCode}</td>
                      <td>{d.routeCode ? ROUTE_LABELS[d.routeCode] ?? d.routeCode : "-"}</td>
                      <td>{d.lastUseDate ? new Date(d.lastUseDate).toLocaleDateString() : "-"}</td>
                      <td>{d.severityCode ? SEV_LABELS[d.severityCode] ?? d.severityCode : "-"}</td>
                      <td>{d.injectionYn ? "예" : "아니오"}</td>
                      <td>{d.overdoseHistoryYn ? "있음" : "없음"}</td>
                      <td>{d.abstinentStartDate ? new Date(d.abstinentStartDate).toLocaleDateString() : "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* 검사결과 탭 */}
      {tab === "test" && (
        <div className="card">
          <div className="card-h">
            <span>검사결과</span>
            <button className="btn" onClick={() => router.push(`/tests?subjectId=${id}`)}>검사 등록 →</button>
          </div>
          <div className="card-b">
            {tests.length === 0 ? (
              <div className="muted">등록된 검사결과가 없습니다.</div>
            ) : (
              <table className="table">
                <thead><tr><th>검사유형</th><th>검사일</th><th>검사기관</th><th>결과</th></tr></thead>
                <tbody>
                  {tests.map(t => (
                    <tr key={t.testId}>
                      <td>{TEST_TYPE_LABELS[t.testTypeCode] ?? t.testTypeCode}</td>
                      <td>{new Date(t.testDate).toLocaleDateString()}</td>
                      <td className="muted">{t.testOrgNm ?? "-"}</td>
                      <td>
                        <span className="badge" style={{ background: t.resultCode === "POSITIVE" ? "#fce4e4" : t.resultCode === "NEGATIVE" ? "#e4f5e4" : "#f5f5e4", color: "var(--ink)" }}>
                          {RESULT_LABELS[t.resultCode] ?? t.resultCode}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* 프로그램 탭 */}
      {tab === "program" && (
        <div className="card">
          <div className="card-h">
            <span>프로그램 등록 현황</span>
            <button className="btn" onClick={() => router.push("/programs")}>프로그램 관리 →</button>
          </div>
          <div className="card-b">
            {enrolls.length === 0 ? (
              <div className="muted">등록된 프로그램이 없습니다.</div>
            ) : (
              <table className="table">
                <thead><tr><th>프로그램명</th><th>유형</th><th>등록일</th><th>상태</th></tr></thead>
                <tbody>
                  {enrolls.map(e => (
                    <tr key={e.enrollId}>
                      <td style={{ fontWeight: 900 }}>{e.program?.programName ?? "-"}</td>
                      <td>{e.program?.programType ?? "-"}</td>
                      <td>{new Date(e.enrollDate).toLocaleDateString()}</td>
                      <td><span className="badge">{e.statusCode}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* 의뢰/연계 탭 */}
      {tab === "referral" && (
        <div className="card">
          <div className="card-h">
            <span>의뢰/연계 이력</span>
            <button className="btn" onClick={() => router.push(`/referrals?subjectId=${id}`)}>의뢰 등록 →</button>
          </div>
          <div className="card-b">
            {referrals.length === 0 ? (
              <div className="muted">등록된 의뢰/연계 이력이 없습니다.</div>
            ) : (
              <table className="table">
                <thead><tr><th>유형</th><th>의뢰기관</th><th>연계기관</th><th>의뢰일</th><th>상태</th></tr></thead>
                <tbody>
                  {referrals.map(r => (
                    <tr key={r.referralId}>
                      <td style={{ fontWeight: 900 }}>{REF_TYPE_LABELS[r.referralType] ?? r.referralType}</td>
                      <td>{r.fromOrg ?? "-"}</td>
                      <td>{r.toOrg ?? "-"}</td>
                      <td>{new Date(r.referralDate).toLocaleDateString()}</td>
                      <td><span className="badge">{STATUS_LABELS[r.statusCode] ?? r.statusCode}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </Shell>
  );
}
