"use client";

import Shell from "@/components/Shell";
import { useState } from "react";

const TABS = [
  { key: "forms",   label: "서식 관리" },
  { key: "notices", label: "공지사항" },
  { key: "faq",     label: "FAQ" },
];

const forms = [
  { name: "대상자 초기 사정지", ext: "HWP", updated: "2026-01-15" },
  { name: "ISP 수립 양식",      ext: "HWP", updated: "2026-01-15" },
  { name: "종결 보고서 양식",    ext: "HWP", updated: "2025-12-01" },
  { name: "이수 확인서",         ext: "PDF", updated: "2025-11-20" },
  { name: "연계 의뢰서",         ext: "HWP", updated: "2026-02-01" },
];

const notices = [
  { id: 1, title: "2026년 1분기 마감 일정 안내", important: true, date: "2026-02-28", author: "관리자" },
  { id: 2, title: "국가통계 보고서 제출 방법 변경 안내", important: true, date: "2026-02-20", author: "관리자" },
  { id: 3, title: "3월 정기 교육 일정 공지",       important: false, date: "2026-02-10", author: "서울센터" },
  { id: 4, title: "시스템 정기점검 안내 (3/8 새벽 2~4시)", important: false, date: "2026-03-01", author: "관리자" },
];

const faqs = [
  { q: "대상자 등록 시 실명 입력이 필요한가요?", a: "아니오. 가명(alias)만 입력합니다. 실명은 별도 보안 저장소에서 관리합니다." },
  { q: "케이스 종결 후 재접수가 가능한가요?", a: "네. CLOSED 상태에서도 신규 접수(Intake)를 통해 새 케이스 생성이 가능합니다." },
  { q: "1342 연계 데이터는 어떻게 수신되나요?", a: "연계관리 > 1342 커넥터를 통해 수신되며, 접수 대기열에 자동 등록됩니다." },
];

export default function SupportPage() {
  const [tab, setTab] = useState("forms");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <Shell title="업무지원" subtitle="서식 관리 · 공지사항 · FAQ">

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {TABS.map((t) => (
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

      {tab === "forms" && (
        <div className="card">
          <div className="card-h"><span>서식 목록</span><span className="pill">{forms.length}개</span></div>
          <div className="card-b">
            <table className="table">
              <thead><tr><th>서식명</th><th>형식</th><th>최종수정</th><th></th></tr></thead>
              <tbody>
                {forms.map((f) => (
                  <tr key={f.name}>
                    <td style={{ fontWeight: 1000 }}>{f.name}</td>
                    <td><span className="badge">{f.ext}</span></td>
                    <td>{f.updated}</td>
                    <td><button className="btn">다운로드</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: 12 }}>
              <button className="btn primary">+ 서식 업로드 (관리자)</button>
            </div>
          </div>
        </div>
      )}

      {tab === "notices" && (
        <div className="card">
          <div className="card-h"><span>공지사항</span></div>
          <div className="card-b">
            <table className="table">
              <thead><tr><th></th><th>제목</th><th>작성자</th><th>날짜</th></tr></thead>
              <tbody>
                {notices.map((n) => (
                  <tr key={n.id}>
                    <td>{n.important && <span className="badge" style={{ background: "#dc2626" }}>중요</span>}</td>
                    <td style={{ fontWeight: n.important ? 1000 : 400 }}>{n.title}</td>
                    <td>{n.author}</td>
                    <td>{n.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: 12 }}>
              <button className="btn primary">+ 공지 작성</button>
            </div>
          </div>
        </div>
      )}

      {tab === "faq" && (
        <div className="card">
          <div className="card-h"><span>자주 묻는 질문</span></div>
          <div className="card-b" style={{ display: "grid", gap: 8 }}>
            {faqs.map((f, i) => (
              <div key={i} style={{ border: "1px solid var(--line)", borderRadius: 12, overflow: "hidden" }}>
                <button
                  className="btn ghost"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: "100%", textAlign: "left", padding: "12px 14px", fontWeight: 1000 }}
                >
                  Q. {f.q}
                </button>
                {openFaq === i && (
                  <div style={{ padding: "10px 14px", background: "#f8fafc", color: "var(--muted)" }}>
                    A. {f.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </Shell>
  );
}
