"use client";

import Shell from "@/components/Shell";
import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";

type DrugType = { drugCd: string; isPrimary: boolean };
type Subject = {
  subjectId: string;
  caseNo: string;
  alias: string;
  gender: string;
  birthYear: number;
  regionCd: string;
  entryRoute: string;
  registeredAt: string;
  status: string;
  drugTypes: DrugType[];
};

const TAB_LABELS = [
  { key: "subject",   label: "마약류 중독자" },
  { key: "family",    label: "가족/보호자" },
  { key: "supporter", label: "회복지원가" },
];

const ENTRY_LABEL: Record<string, string> = {
  "1342": "1342 전화", LEGAL: "사법 연계", SELF: "자발", AGENCY: "기관 의뢰",
};
const STATUS_LABEL: Record<string, string> = {
  ACTIVE: "활성", MONITORING: "모니터링", CLOSED: "종결",
};
const DRUG_LABEL: Record<string, string> = {
  PHILOPON: "필로폰", CANNABIS: "대마", COCAINE: "코카인",
  HEROIN: "헤로인", ECSTASY: "엑스터시", KETAMINE: "케타민",
  PSILOCYBIN: "실로시빈", OTHER: "기타",
};
const REGION_OPTIONS = [
  "서울", "부산", "대구", "인천", "광주", "대전", "울산", "세종",
  "경기", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주",
];

/* ─── 신규 등록 모달 ─────────────────────────────────────── */
type FormData = {
  alias: string;
  gender: string;
  birthYear: string;
  regionCd: string;
  entryRoute: string;
  drugTypes: string[];
};

const EMPTY_FORM: FormData = {
  alias: "",
  gender: "M",
  birthYear: "",
  regionCd: "서울",
  entryRoute: "SELF",
  drugTypes: [],
};

function SubjectFormModal({
  onClose,
  onSaved,
}: {
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof FormData, v: string) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const toggleDrug = (code: string) =>
    setForm((prev) => ({
      ...prev,
      drugTypes: prev.drugTypes.includes(code)
        ? prev.drugTypes.filter((d) => d !== code)
        : [...prev.drugTypes, code],
    }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.alias.trim()) { setError("가명을 입력해 주세요."); return; }
    const yr = parseInt(form.birthYear);
    if (!form.birthYear || isNaN(yr) || yr < 1900 || yr > new Date().getFullYear()) {
      setError("출생연도를 올바르게 입력해 주세요."); return;
    }
    if (form.drugTypes.length === 0) { setError("마약유형을 1개 이상 선택해 주세요."); return; }

    setSubmitting(true);
    try {
      const res = await fetch("/api/subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          alias: form.alias.trim(),
          gender: form.gender,
          birthYear: yr,
          regionCd: form.regionCd,
          entryRoute: form.entryRoute,
          drugTypes: form.drugTypes,
          status: "ACTIVE",
        }),
      });
      if (!res.ok) {
        const msg = await res.text();
        setError(`저장 실패: ${msg}`);
        return;
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(`오류 발생: ${String(err)}`);
    } finally {
      setSubmitting(false);
    }
  };

  /* 모달 바깥 클릭 닫기 */
  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      onClick={handleBackdrop}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#fff", borderRadius: 10, padding: 28,
          width: 520, maxHeight: "90vh", overflowY: "auto",
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
        }}
      >
        {/* 헤더 */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>신규 대상자 등록</h3>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#666" }}
          >✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* 에러 */}
          {error && (
            <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 6, padding: "8px 12px", marginBottom: 16, color: "#dc2626", fontSize: 13 }}>
              {error}
            </div>
          )}

          {/* 가명 */}
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>가명 <span style={{ color: "#dc2626" }}>*</span></label>
            <input
              className="input"
              value={form.alias}
              onChange={(e) => set("alias", e.target.value)}
              placeholder="예: 홍**"
              maxLength={20}
              style={{ width: "100%" }}
            />
            <div style={hintStyle}>실명 대신 가명으로 입력합니다 (개인정보보호).</div>
          </div>

          {/* 성별 / 출생연도 */}
          <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>성별 <span style={{ color: "#dc2626" }}>*</span></label>
              <select className="input" value={form.gender} onChange={(e) => set("gender", e.target.value)} style={{ width: "100%" }}>
                <option value="M">남</option>
                <option value="F">여</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>출생연도 <span style={{ color: "#dc2626" }}>*</span></label>
              <input
                className="input"
                type="number"
                value={form.birthYear}
                onChange={(e) => set("birthYear", e.target.value)}
                placeholder="예: 1990"
                min={1900}
                max={new Date().getFullYear()}
                style={{ width: "100%" }}
              />
            </div>
          </div>

          {/* 지역 / 유입경로 */}
          <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>지역 <span style={{ color: "#dc2626" }}>*</span></label>
              <select className="input" value={form.regionCd} onChange={(e) => set("regionCd", e.target.value)} style={{ width: "100%" }}>
                {REGION_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>유입경로 <span style={{ color: "#dc2626" }}>*</span></label>
              <select className="input" value={form.entryRoute} onChange={(e) => set("entryRoute", e.target.value)} style={{ width: "100%" }}>
                {Object.entries(ENTRY_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
          </div>

          {/* 마약유형 */}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>
              마약유형 <span style={{ color: "#dc2626" }}>*</span>
              <span style={{ fontWeight: 400, color: "#6b7280", marginLeft: 6 }}>(첫 번째 선택이 주 유형)</span>
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 16px", marginTop: 6 }}>
              {Object.entries(DRUG_LABEL).map(([code, label]) => (
                <label key={code} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13 }}>
                  <input
                    type="checkbox"
                    checked={form.drugTypes.includes(code)}
                    onChange={() => toggleDrug(code)}
                    style={{ width: 15, height: 15 }}
                  />
                  {label}
                  {form.drugTypes[0] === code && (
                    <span style={{ fontSize: 10, background: "#3b82f6", color: "#fff", borderRadius: 4, padding: "1px 5px" }}>주</span>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* 버튼 */}
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button type="button" className="btn" onClick={onClose} disabled={submitting}>취소</button>
            <button type="submit" className="btn primary" disabled={submitting}>
              {submitting ? "저장 중..." : "등록"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4, color: "#374151" };
const hintStyle: React.CSSProperties = { fontSize: 11, color: "#9ca3af", marginTop: 3 };

/* ─── 대상자 목록 ────────────────────────────────────────── */
function SubjectsContent() {
  const sp = useSearchParams();
  const [tab, setTab] = useState(sp.get("tab") ?? "subject");

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const LIMIT = 20;

  const load = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: String(LIMIT) });
    if (search) params.set("search", search);
    fetch(`/api/subjects?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setSubjects(data.items ?? []);
        setTotal(data.total ?? 0);
      })
      .finally(() => setLoading(false));
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  const handleSearch = () => {
    setPage(1);
    setSearch(searchInput);
  };

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  return (
    <Shell title="대상자 관리" subtitle="마약류 중독자 카드 · 가족/보호자 · 회복지원가">

      {/* 신규 등록 모달 */}
      {showForm && (
        <SubjectFormModal
          onClose={() => setShowForm(false)}
          onSaved={() => { setPage(1); setSearch(""); setSearchInput(""); load(); }}
        />
      )}

      {/* 탭 */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {TAB_LABELS.map((t) => (
          <button
            key={t.key}
            className="btn"
            onClick={() => setTab(t.key)}
            style={{
              background: tab === t.key ? "linear-gradient(180deg,var(--blue),var(--blue2))" : "#fff",
              color: tab === t.key ? "#fff" : "var(--ink)",
              borderColor: tab === t.key ? "transparent" : "var(--line)",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "subject" && (
        <div className="card">
          <div className="card-h">
            <span>대상자 목록</span>
            <span className="pill">총 {total}명</span>
          </div>
          <div className="card-b">
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <input
                className="input"
                placeholder="가명 / 관리번호 / 지역 검색 (Enter)"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                style={{ flex: 1 }}
              />
              <button className="btn" onClick={handleSearch}>검색</button>
              <button className="btn primary" onClick={() => setShowForm(true)}>+ 신규 등록</button>
            </div>

            {loading ? (
              <div className="muted" style={{ textAlign: "center", padding: 32 }}>불러오는 중...</div>
            ) : subjects.length === 0 ? (
              <div className="muted" style={{ textAlign: "center", padding: 32 }}>대상자가 없습니다.</div>
            ) : (
              <>
                <table className="table">
                  <thead>
                    <tr>
                      <th>관리번호</th>
                      <th>가명</th>
                      <th>성별/출생</th>
                      <th>지역</th>
                      <th>마약유형</th>
                      <th>유입경로</th>
                      <th>등록일</th>
                      <th>상태</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjects.map((s) => (
                      <tr key={s.subjectId}>
                        <td style={{ fontWeight: 1000 }}>{s.caseNo}</td>
                        <td>{s.alias}</td>
                        <td>{s.gender === "M" ? "남" : "여"} / {s.birthYear}</td>
                        <td>{s.regionCd}</td>
                        <td>{s.drugTypes.map((d) => DRUG_LABEL[d.drugCd] ?? d.drugCd).join(", ")}</td>
                        <td>{ENTRY_LABEL[s.entryRoute] ?? s.entryRoute}</td>
                        <td>{new Date(s.registeredAt).toLocaleDateString()}</td>
                        <td><span className="badge">{STATUS_LABEL[s.status] ?? s.status}</span></td>
                        <td><button className="btn">상세</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* 페이지네이션 */}
                <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 12 }}>
                  <button className="btn" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>◀</button>
                  <span style={{ lineHeight: "32px", fontSize: 13 }}>{page} / {totalPages}</span>
                  <button className="btn" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>▶</button>
                </div>
              </>
            )}

            <div className="muted" style={{ marginTop: 8 }}>
              ※ 실명 대신 가명으로 표시됩니다 (개인정보보호법 준수).
            </div>
          </div>
        </div>
      )}

      {tab === "family" && (
        <div className="card">
          <div className="card-h"><span>가족 및 보호자</span></div>
          <div className="card-b">
            <table className="table">
              <thead>
                <tr><th>대상자</th><th>관계</th><th>연락처</th><th>동거여부</th><th>동의서</th></tr>
              </thead>
              <tbody>
                <tr><td>SUBJ-000101</td><td>배우자</td><td>010-****-1234</td><td>동거</td><td><span className="badge">Y</span></td></tr>
                <tr><td>SUBJ-000102</td><td>부모</td><td>010-****-5678</td><td>별거</td><td><span className="badge">N</span></td></tr>
              </tbody>
            </table>
            <div style={{ marginTop: 12 }}>
              <button className="btn primary">+ 가족/보호자 추가</button>
            </div>
          </div>
        </div>
      )}

      {tab === "supporter" && (
        <div className="card">
          <div className="card-h"><span>회복지원가</span></div>
          <div className="card-b">
            <table className="table">
              <thead>
                <tr><th>이름</th><th>담당 대상자</th><th>연락처</th><th>최근 활동일</th><th></th></tr>
              </thead>
              <tbody>
                <tr><td>장*민</td><td>SUBJ-000101, SUBJ-000104</td><td>010-****-9999</td><td>2026-03-01</td><td><button className="btn">활동일지</button></td></tr>
                <tr><td>윤*서</td><td>SUBJ-000102</td><td>010-****-8888</td><td>2026-02-28</td><td><button className="btn">활동일지</button></td></tr>
              </tbody>
            </table>
            <div style={{ marginTop: 12 }}>
              <button className="btn primary">+ 회복지원가 추가</button>
            </div>
          </div>
        </div>
      )}
    </Shell>
  );
}

export default function SubjectsPage() {
  return (
    <Suspense fallback={null}>
      <SubjectsContent />
    </Suspense>
  );
}
