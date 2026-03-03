"use client";

import Shell from "@/components/Shell";
import { useEffect, useState, useCallback } from "react";

type Resource = {
  resourceId: string;
  resourceNm: string;
  resourceType: string;
  regionCd: string;
  phone?: string;
  address?: string;
  note?: string;
};

const TYPE_LABEL: Record<string, string> = {
  MEDICAL: "의료기관", WELFARE: "복지관", LEGAL: "법률지원",
  EMPLOYMENT: "취업지원", SELF_HELP: "자조모임",
};

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (typeFilter) params.set("type", typeFilter);
    if (search) params.set("search", search);
    fetch(`/api/resources?${params}`)
      .then((r) => r.json())
      .then((data) => setResources(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, [search, typeFilter]);

  // 타입 필터 변경 시 즉시 검색
  useEffect(() => { load(); }, [typeFilter]);

  // 검색은 Enter 또는 버튼 클릭 시
  const handleSearch = () => load();

  return (
    <Shell title="지역자원관리" subtitle="연계 기관 · 프로그램 · 자조모임 관리">
      <div className="card">
        <div className="card-h">
          <span>지역자원 목록</span>
          <span className="pill">{resources.length}개 기관</span>
        </div>
        <div className="card-b">
          <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
            <input
              className="input"
              placeholder="기관명 검색 (Enter)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              style={{ flex: 1, minWidth: 160 }}
            />
            <select className="select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="">전체 유형</option>
              {Object.entries(TYPE_LABEL).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
            <button className="btn" onClick={handleSearch}>검색</button>
            <button className="btn primary">+ 기관 등록</button>
          </div>

          {loading ? (
            <div className="muted" style={{ textAlign: "center", padding: 32 }}>불러오는 중...</div>
          ) : resources.length === 0 ? (
            <div className="muted" style={{ textAlign: "center", padding: 32 }}>등록된 지역자원이 없습니다.</div>
          ) : (
            <table className="table">
              <thead>
                <tr><th>유형</th><th>기관명</th><th>지역</th><th>연락처</th><th>주소</th><th>비고</th><th></th></tr>
              </thead>
              <tbody>
                {resources.map((r) => (
                  <tr key={r.resourceId}>
                    <td><span className="badge">{TYPE_LABEL[r.resourceType] ?? r.resourceType}</span></td>
                    <td style={{ fontWeight: 1000 }}>{r.resourceNm}</td>
                    <td>{r.regionCd}</td>
                    <td>{r.phone ?? "-"}</td>
                    <td className="muted">{r.address ?? "-"}</td>
                    <td className="muted">{r.note ?? "-"}</td>
                    <td>
                      <button className="btn">연계 이력</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Shell>
  );
}
