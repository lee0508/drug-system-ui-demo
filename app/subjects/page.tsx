"use client";

import Shell from "@/components/Shell";
import { mockSubjects } from "@/lib/mockData";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

const TAB_LABELS = [
  { key: "subject", label: "마약류 중독자" },
  { key: "family",  label: "가족/보호자" },
  { key: "supporter", label: "회복지원가" },
];

const ENTRY_LABEL: Record<string, string> = {
  "1342": "1342 전화", LEGAL: "사법 연계", SELF: "자발", AGENCY: "기관 의뢰",
};
const STATUS_LABEL: Record<string, string> = {
  ACTIVE: "활성", MONITORING: "모니터링", CLOSED: "종결",
};

function fmt(ts: string) {
  return new Date(ts).toLocaleDateString();
}

function SubjectsContent() {
  const sp = useSearchParams();
  const [tab, setTab] = useState(sp.get("tab") ?? "subject");
  const [search, setSearch] = useState("");

  const filtered = mockSubjects.filter(
    (s) =>
      s.alias.includes(search) ||
      s.caseNo.toLowerCase().includes(search.toLowerCase()) ||
      s.region.includes(search)
  );

  return (
    <Shell title="대상자 관리" subtitle="마약류 중독자 카드 · 가족/보호자 · 회복지원가">

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
            <span className="pill">{filtered.length}명</span>
          </div>
          <div className="card-b">
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <input
                className="input"
                placeholder="가명 / 관리번호 / 지역 검색"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ flex: 1 }}
              />
              <button className="btn primary">+ 신규 등록</button>
            </div>
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
                {filtered.map((s) => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 1000 }}>{s.caseNo}</td>
                    <td>{s.alias}</td>
                    <td>{s.gender === "M" ? "남" : "여"} / {s.birthYear}</td>
                    <td>{s.region}</td>
                    <td>{s.drugTypes.join(", ")}</td>
                    <td>{ENTRY_LABEL[s.entryRoute]}</td>
                    <td>{fmt(s.registeredAt)}</td>
                    <td><span className="badge">{STATUS_LABEL[s.status]}</span></td>
                    <td><button className="btn">상세</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
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
