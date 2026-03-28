"use client";

import Shell from "@/components/Shell";
import { useState } from "react";

const mock = [
  { id: "LG-001", ref: "서울중앙지검-2026-001", agency: "서울중앙지검", subjectNo: "SUBJ-000102", ordered: 40, completed: 24, status: "진행중", dueDate: "2026-04-30" },
  { id: "LG-002", ref: "수원지방법원-2025-088", agency: "수원지방법원", subjectNo: "SUBJ-000103", ordered: 80, completed: 80, status: "완료", dueDate: "2025-12-31" },
  { id: "LG-003", ref: "부산지검-2026-015", agency: "부산지검", subjectNo: "SUBJ-000104", ordered: 40, completed: 0, status: "대기", dueDate: "2026-06-30" },
];

export default function EducationLegalPage() {
  const [selected, setSelected] = useState(mock[0].id);
  const item = mock.find((m) => m.id === selected)!;

  return (
    <Shell title="기소유예/수강·이수명령" subtitle="사법 연계 이수 처리 · 출석 관리 · 이수 확인">
      <div className="grid2">

        <div className="card">
          <div className="card-h">
            <span>이수명령 목록</span>
            <span className="pill">{mock.length}건</span>
          </div>
          <div className="card-b">
            <table className="table">
              <thead>
                <tr><th>의뢰기관</th><th>대상자</th><th>이수(명령/완료)</th><th>상태</th></tr>
              </thead>
              <tbody>
                {mock.map((m) => (
                  <tr
                    key={m.id}
                    onClick={() => setSelected(m.id)}
                    style={{ cursor: "pointer", background: m.id === selected ? "#f1f5f9" : "#fff" }}
                  >
                    <td style={{ fontWeight: 1000 }}>{m.agency}</td>
                    <td>{m.subjectNo}</td>
                    <td>{m.ordered}h / {m.completed}h</td>
                    <td><span className="badge">{m.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: 12 }}>
              <button className="btn primary">+ 신규 의뢰 등록</button>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-h">
            <span>상세 처리</span>
            <span className="pill">{item.id}</span>
          </div>
          <div className="card-b" style={{ display: "grid", gap: 12 }}>
            <div className="grid2">
              <div className="kpi"><div className="label">의뢰기관</div><div className="value" style={{ fontSize: 14 }}>{item.agency}</div></div>
              <div className="kpi"><div className="label">이수 기한</div><div className="value" style={{ fontSize: 14 }}>{item.dueDate}</div></div>
              <div className="kpi"><div className="label">명령 시간</div><div className="value">{item.ordered}h</div></div>
              <div className="kpi"><div className="label">완료 시간</div><div className="value">{item.completed}h</div></div>
            </div>
            <div className="hr" />
            <div>
              <div style={{ fontWeight: 1000, marginBottom: 8 }}>출석 기록 (최근)</div>
              <table className="table">
                <thead><tr><th>일자</th><th>시간(h)</th><th>출결</th><th>비고</th></tr></thead>
                <tbody>
                  <tr><td>2026-02-03</td><td>4</td><td><span className="badge">출석</span></td><td>-</td></tr>
                  <tr><td>2026-02-10</td><td>4</td><td><span className="badge">출석</span></td><td>-</td></tr>
                  <tr><td>2026-02-17</td><td>4</td><td><span className="badge">결석</span></td><td>병원</td></tr>
                </tbody>
              </table>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn primary">출석 추가</button>
              <button className="btn">이수 확인서 출력</button>
            </div>
          </div>
        </div>

      </div>
    </Shell>
  );
}
