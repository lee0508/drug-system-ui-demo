"use client";

import Shell from "@/components/Shell";

const visits = [
  { id: "OT-001", date: "2026-03-05", subjectNo: "SUBJ-000101", location: "서울 종로구 자택", counselor: "홍길동", content: "정기 방문 상담. 재사용 징후 없음.", next: "2026-03-19" },
  { id: "OT-002", date: "2026-03-04", subjectNo: "SUBJ-000104", location: "대구 달서구 센터 외 방문", counselor: "이영희", content: "직업 재활 프로그램 연계 논의.", next: "2026-03-18" },
  { id: "OT-003", date: "2026-03-01", subjectNo: "SUBJ-000102", location: "경기 의정부시 자택", counselor: "김철수", content: "가족 갈등 모니터링. 보호자 면담 병행.", next: "2026-03-15" },
];

export default function EducationOutreachPage() {
  return (
    <Shell title="찾아가는 재활프로그램" subtitle="현장 방문 · 방문 기록 · 다음 일정 관리">
      <div className="card">
        <div className="card-h">
          <span>방문 기록</span>
          <span className="pill">{visits.length}건</span>
        </div>
        <div className="card-b">
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
            <button className="btn primary">+ 방문 기록 추가</button>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>방문일</th>
                <th>대상자</th>
                <th>방문 장소</th>
                <th>담당자</th>
                <th>내용</th>
                <th>다음 방문</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {visits.map((v) => (
                <tr key={v.id}>
                  <td style={{ fontWeight: 1000 }}>{v.date}</td>
                  <td>{v.subjectNo}</td>
                  <td>{v.location}</td>
                  <td>{v.counselor}</td>
                  <td className="muted" style={{ maxWidth: 200 }}>{v.content}</td>
                  <td>{v.next}</td>
                  <td><button className="btn">수정</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="muted" style={{ marginTop: 8 }}>
            ※ 방문 일정은 담당 상담사 배정 후 자동 알림이 발송됩니다(예시).
          </div>
        </div>
      </div>
    </Shell>
  );
}
