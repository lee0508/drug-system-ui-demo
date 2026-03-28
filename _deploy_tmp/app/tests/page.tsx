"use client";

import Shell from "@/components/Shell";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

type Test = {
  testId: string;
  subjectId: string;
  testTypeCode: string;
  testDate: string;
  testOrgNm?: string;
  resultCode: string;
  resultDetail?: Record<string, string>;
  memo?: string;
  createdAt: string;
  subject?: { alias: string; caseNo: string };
};

const TEST_TYPE_LABELS: Record<string, string> = {
  URINE: "소변", BLOOD: "혈액", HAIR: "모발", SALIVA: "타액",
};
const RESULT_LABELS: Record<string, string> = {
  POSITIVE: "양성", NEGATIVE: "음성", INCONCLUSIVE: "불확정",
};
const SUBSTANCE_LABELS: Record<string, string> = {
  METH: "필로폰", HEROIN: "헤로인", THC: "대마", COCAINE: "코카인",
  FENTANYL: "펜타닐", MDMA: "MDMA", OTHER: "기타",
};

const RESULT_BG: Record<string, string> = {
  POSITIVE: "#fce4e4", NEGATIVE: "#e4f5e4", INCONCLUSIVE: "#f5f5e4",
};

const initForm = {
  subjectId: "", testTypeCode: "URINE", testDate: new Date().toISOString().slice(0, 10),
  testOrgNm: "", resultCode: "NEGATIVE", selectedSubstances: [] as string[], memo: "",
};

function TestsContent() {
  const searchParams = useSearchParams();
  const filterSubjectId = searchParams.get("subjectId") ?? "";

  const [items, setItems] = useState<Test[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  // 필터
  const [typeFilter, setTypeFilter] = useState("");
  const [resultFilter, setResultFilter] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  // 등록 폼
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...initForm, subjectId: filterSubjectId });
  const [saving, setSaving] = useState(false);

  const limit = 20;

  function buildQuery() {
    const q = new URLSearchParams();
    if (filterSubjectId) q.set("subjectId", filterSubjectId);
    if (typeFilter) q.set("testTypeCode", typeFilter);
    if (resultFilter) q.set("resultCode", resultFilter);
    if (from) q.set("from", from);
    if (to) q.set("to", to);
    q.set("page", String(page));
    q.set("limit", String(limit));
    return q.toString();
  }

  async function load() {
    setLoading(true);
    const res = await fetch(`/api/tests?${buildQuery()}`).then(r => r.json());
    setItems(res.items ?? []);
    setTotal(res.total ?? 0);
    setLoading(false);
  }

  useEffect(() => { load(); }, [page, typeFilter, resultFilter, from, to]);

  async function submit() {
    if (!form.subjectId || !form.testDate || !form.resultCode) {
      alert("대상자ID, 검사일, 결과는 필수입니다.");
      return;
    }
    setSaving(true);
    await fetch("/api/tests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        resultDetail: form.selectedSubstances.length > 0
          ? Object.fromEntries(form.selectedSubstances.map(c => [c, form.resultCode]))
          : undefined,
      }),
    });
    setSaving(false);
    setShowForm(false);
    setForm({ ...initForm, subjectId: filterSubjectId });
    load();
  }

  function toggleSubstance(code: string) {
    setForm(f => ({
      ...f,
      selectedSubstances: f.selectedSubstances.includes(code)
        ? f.selectedSubstances.filter(c => c !== code)
        : [...f.selectedSubstances, code],
    }));
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <Shell title="검사관리" subtitle="소변·혈액·모발 검사 등록 및 결과 조회">
      {/* 필터 */}
      <div className="card" style={{ marginBottom: 12 }}>
        <div className="card-h"><span>검색 조건</span></div>
        <div className="card-b">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "flex-end" }}>
            <label style={{ fontSize: 13, display: "grid", gap: 2 }}>
              검사유형
              <select className="input" value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setPage(1); }}>
                <option value="">전체</option>
                {Object.entries(TEST_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </label>
            <label style={{ fontSize: 13, display: "grid", gap: 2 }}>
              결과
              <select className="input" value={resultFilter} onChange={e => { setResultFilter(e.target.value); setPage(1); }}>
                <option value="">전체</option>
                {Object.entries(RESULT_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </label>
            <label style={{ fontSize: 13, display: "grid", gap: 2 }}>
              검사일(시작) <input className="input" type="date" value={from} onChange={e => { setFrom(e.target.value); setPage(1); }} />
            </label>
            <label style={{ fontSize: 13, display: "grid", gap: 2 }}>
              검사일(종료) <input className="input" type="date" value={to} onChange={e => { setTo(e.target.value); setPage(1); }} />
            </label>
            <button className="btn-primary" onClick={() => setShowForm(true)}>+ 검사 등록</button>
          </div>
        </div>
      </div>

      {/* 등록 폼 */}
      {showForm && (
        <div className="card" style={{ marginBottom: 12, border: "2px solid var(--blue)" }}>
          <div className="card-h">
            <span>검사결과 등록</span>
            <button className="btn" onClick={() => setShowForm(false)}>닫기</button>
          </div>
          <div className="card-b">
            <div className="grid2" style={{ gap: 12 }}>
              <label style={{ display: "grid", gap: 4, fontSize: 13 }}>
                대상자 ID (subjectId) *
                <input className="input" value={form.subjectId} onChange={e => setForm(f => ({ ...f, subjectId: e.target.value }))} placeholder="SUBJ..." />
              </label>
              <label style={{ display: "grid", gap: 4, fontSize: 13 }}>
                검사유형 *
                <select className="input" value={form.testTypeCode} onChange={e => setForm(f => ({ ...f, testTypeCode: e.target.value }))}>
                  {Object.entries(TEST_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </label>
              <label style={{ display: "grid", gap: 4, fontSize: 13 }}>
                검사일 *
                <input className="input" type="date" value={form.testDate} onChange={e => setForm(f => ({ ...f, testDate: e.target.value }))} />
              </label>
              <label style={{ display: "grid", gap: 4, fontSize: 13 }}>
                검사기관
                <input className="input" value={form.testOrgNm} onChange={e => setForm(f => ({ ...f, testOrgNm: e.target.value }))} placeholder="예: 국립과학수사연구원" />
              </label>
              <label style={{ display: "grid", gap: 4, fontSize: 13 }}>
                결과 *
                <select className="input" value={form.resultCode} onChange={e => setForm(f => ({ ...f, resultCode: e.target.value }))}>
                  {Object.entries(RESULT_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </label>
              <div style={{ fontSize: 13, display: "grid", gap: 4 }}>
                검출 물질 (복수 선택)
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {Object.entries(SUBSTANCE_LABELS).map(([k, v]) => (
                    <label key={k} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12 }}>
                      <input type="checkbox" checked={form.selectedSubstances.includes(k)} onChange={() => toggleSubstance(k)} />
                      {v}
                    </label>
                  ))}
                </div>
              </div>
              <label style={{ display: "grid", gap: 4, fontSize: 13, gridColumn: "1 / -1" }}>
                메모
                <textarea className="input" rows={2} value={form.memo} onChange={e => setForm(f => ({ ...f, memo: e.target.value }))} />
              </label>
            </div>
            <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button className="btn" onClick={() => setShowForm(false)}>취소</button>
              <button className="btn-primary" onClick={submit} disabled={saving}>{saving ? "저장 중..." : "저장"}</button>
            </div>
          </div>
        </div>
      )}

      {/* 목록 */}
      <div className="card">
        <div className="card-h">
          <span>검사결과 목록</span>
          <span className="muted" style={{ fontSize: 12 }}>총 {total.toLocaleString()}건</span>
        </div>
        <div className="card-b">
          {loading ? (
            <div className="muted" style={{ padding: 24, textAlign: "center" }}>불러오는 중...</div>
          ) : items.length === 0 ? (
            <div className="muted">검사결과가 없습니다.</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>관리번호</th>
                  <th>대상자</th>
                  <th>검사유형</th>
                  <th>검사일</th>
                  <th>검사기관</th>
                  <th>결과</th>
                  <th>검출물질</th>
                </tr>
              </thead>
              <tbody>
                {items.map(t => (
                  <tr key={t.testId}>
                    <td className="muted" style={{ fontSize: 11 }}>{t.subject?.caseNo ?? "-"}</td>
                    <td style={{ fontWeight: 700 }}>{t.subject?.alias ?? t.subjectId}</td>
                    <td>{TEST_TYPE_LABELS[t.testTypeCode] ?? t.testTypeCode}</td>
                    <td>{new Date(t.testDate).toLocaleDateString()}</td>
                    <td className="muted">{t.testOrgNm ?? "-"}</td>
                    <td>
                      <span className="badge" style={{ background: RESULT_BG[t.resultCode] ?? "#f0f0f0", color: "var(--ink)" }}>
                        {RESULT_LABELS[t.resultCode] ?? t.resultCode}
                      </span>
                    </td>
                    <td style={{ fontSize: 12 }}>
                      {t.resultDetail ? Object.keys(t.resultDetail).map(c => SUBSTANCE_LABELS[c] ?? c).join(", ") : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div style={{ display: "flex", gap: 4, marginTop: 12, justifyContent: "center" }}>
              <button className="btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>이전</button>
              <span style={{ padding: "6px 12px", fontSize: 13 }}>{page} / {totalPages}</span>
              <button className="btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>다음</button>
            </div>
          )}
        </div>
      </div>
    </Shell>
  );
}

export default function TestsPage() {
  return <Suspense fallback={null}><TestsContent /></Suspense>;
}
