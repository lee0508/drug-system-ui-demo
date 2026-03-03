"use client";

import Shell from "@/components/Shell";
import { useEffect, useState } from "react";

type Center = {
  centerId: string;
  centerNm: string;
  regionCd: string;
  region?: { regionNm: string };
  manager?: string;
  phone?: string;
  capacity: number;
  _count: { cases: number };
};

export default function CentersPage() {
  const [centers, setCenters] = useState<Center[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/centers")
      .then((r) => r.json())
      .then((data) => setCenters(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Shell title="센터관리" subtitle="센터 · 권역 · 담당자 · 케이스 현황">
      <div className="card">
        <div className="card-h">
          <span>센터 목록</span>
          <span className="pill">{centers.length}개 센터</span>
        </div>
        <div className="card-b">
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
            <button className="btn primary">+ 센터 등록</button>
          </div>

          {loading ? (
            <div className="muted" style={{ textAlign: "center", padding: 32 }}>불러오는 중...</div>
          ) : centers.length === 0 ? (
            <div className="muted" style={{ textAlign: "center", padding: 32 }}>등록된 센터가 없습니다.</div>
          ) : (
            <>
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
                  {centers.map((c) => {
                    const activeCases = c._count.cases;
                    const rate = c.capacity > 0 ? Math.round((activeCases / c.capacity) * 100) : 0;
                    return (
                      <tr key={c.centerId}>
                        <td style={{ fontWeight: 1000 }}>{c.centerNm}</td>
                        <td>{c.region?.regionNm ?? c.regionCd}</td>
                        <td>{c.manager ?? "-"}</td>
                        <td>{c.phone ?? "-"}</td>
                        <td>{c.capacity}명</td>
                        <td>{activeCases}명</td>
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
                {centers.map((c) => (
                  <div key={c.centerId} className="kpi">
                    <div className="label">{c.centerNm}</div>
                    <div className="value">
                      {c._count.cases}{" "}
                      <span style={{ fontSize: 13, fontWeight: 400 }}>/ {c.capacity}명</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </Shell>
  );
}
