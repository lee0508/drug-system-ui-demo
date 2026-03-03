"use client";

import Shell from "@/components/Shell";
import { mockCenters } from "@/lib/mockData";

export default function CentersPage() {
  return (
    <Shell title="센터관리" subtitle="센터 · 권역 · 담당자 · 케이스 현황">
      <div className="card">
        <div className="card-h">
          <span>센터 목록</span>
          <span className="pill">{mockCenters.length}개 센터</span>
        </div>
        <div className="card-b">
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
            <button className="btn primary">+ 센터 등록</button>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>센터명</th>
                <th>권역</th>
                <th>담당자</th>
                <th>연락처</th>
                <th>정원</th>
                <th>활성 케이스</th>
                <th>가동률</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {mockCenters.map((c) => {
                const rate = Math.round((c.activeCases / c.capacity) * 100);
                return (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 1000 }}>{c.name}</td>
                    <td>{c.region}</td>
                    <td>{c.manager}</td>
                    <td>{c.phone}</td>
                    <td>{c.capacity}명</td>
                    <td>{c.activeCases}명</td>
                    <td>
                      <span
                        className="badge"
                        style={{ background: rate >= 90 ? "#dc2626" : rate >= 70 ? "#d97706" : "#16a34a" }}
                      >
                        {rate}%
                      </span>
                    </td>
                    <td>
                      <button className="btn">수정</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="hr" />

          <div className="grid3">
            {mockCenters.map((c) => (
              <div key={c.id} className="kpi">
                <div className="label">{c.name}</div>
                <div className="value">{c.activeCases} <span style={{ fontSize: 13, fontWeight: 400 }}>/ {c.capacity}명</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}
