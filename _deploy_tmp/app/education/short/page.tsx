"use client";

import Shell from "@/components/Shell";
import { useState } from "react";

const programs = [
  { id: "PG-01", name: "마약 예방 집중교육 A반", period: "2026-03-03 ~ 2026-03-14", capacity: 10, enrolled: 7, status: "진행중" },
  { id: "PG-02", name: "재활동기강화 프로그램", period: "2026-03-17 ~ 2026-03-28", capacity: 8, enrolled: 3, status: "모집중" },
  { id: "PG-03", name: "단기집중 재활 B반", period: "2026-02-03 ~ 2026-02-14", capacity: 10, enrolled: 10, status: "완료" },
];

const sessions = [
  { date: "2026-03-03", content: "오리엔테이션 · 자기소개", attendees: 7 },
  { date: "2026-03-05", content: "마약의 뇌신경 영향 이해", attendees: 6 },
  { date: "2026-03-07", content: "동기강화상담(MI) 실습", attendees: 7 },
];

export default function EducationShortPage() {
  const [selected, setSelected] = useState(programs[0].id);
  const prog = programs.find((p) => p.id === selected)!;

  return (
    <Shell title="단기교육 프로그램" subtitle="집중 개입 · 프로그램 등록 · 회차별 출석">
      <div className="grid2">

        <div className="card">
          <div className="card-h">
            <span>프로그램 목록</span>
            <span className="pill">{programs.length}개</span>
          </div>
          <div className="card-b">
            <table className="table">
              <thead>
                <tr><th>프로그램명</th><th>기간</th><th>정원/현원</th><th>상태</th></tr>
              </thead>
              <tbody>
                {programs.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => setSelected(p.id)}
                    style={{ cursor: "pointer", background: p.id === selected ? "#f1f5f9" : "#fff" }}
                  >
                    <td style={{ fontWeight: 1000 }}>{p.name}</td>
                    <td className="muted" style={{ fontSize: 12 }}>{p.period}</td>
                    <td>{p.capacity}/{p.enrolled}</td>
                    <td><span className="badge">{p.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: 12 }}>
              <button className="btn primary">+ 프로그램 개설</button>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-h">
            <span>{prog.name}</span>
            <span className="pill">{prog.enrolled}/{prog.capacity}명</span>
          </div>
          <div className="card-b" style={{ display: "grid", gap: 12 }}>
            <div className="muted">{prog.period}</div>
            <div>
              <div style={{ fontWeight: 1000, marginBottom: 8 }}>회차별 기록</div>
              <table className="table">
                <thead><tr><th>일자</th><th>내용</th><th>출석</th></tr></thead>
                <tbody>
                  {sessions.map((s) => (
                    <tr key={s.date}>
                      <td>{s.date}</td>
                      <td>{s.content}</td>
                      <td>{s.attendees}명</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn primary">회차 추가</button>
              <button className="btn">참여자 관리</button>
            </div>
          </div>
        </div>

      </div>
    </Shell>
  );
}
