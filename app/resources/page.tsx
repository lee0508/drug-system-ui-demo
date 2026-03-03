"use client";

import Shell from "@/components/Shell";
import { mockResources } from "@/lib/mockData";
import { useState } from "react";

const TYPE_LABEL: Record<string, string> = {
  MEDICAL: "의료기관", WELFARE: "복지관", LEGAL: "법률지원",
  EMPLOYMENT: "취업지원", SELF_HELP: "자조모임",
};

export default function ResourcesPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const filtered = mockResources.filter((r) => {
    const matchSearch = r.name.includes(search) || r.region.includes(search);
    const matchType = typeFilter ? r.type === typeFilter : true;
    return matchSearch && matchType;
  });

  return (
    <Shell title="지역자원관리" subtitle="연계 기관 · 프로그램 · 자조모임 관리">
      <div className="card">
        <div className="card-h">
          <span>지역자원 목록</span>
          <span className="pill">{filtered.length}개 기관</span>
        </div>
        <div className="card-b">
          <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
            <input
              className="input"
              placeholder="기관명 / 지역 검색"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ flex: 1, minWidth: 160 }}
            />
            <select className="select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="">전체 유형</option>
              {Object.entries(TYPE_LABEL).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
            <button className="btn primary">+ 기관 등록</button>
          </div>

          <table className="table">
            <thead>
              <tr><th>유형</th><th>기관명</th><th>지역</th><th>연락처</th><th>주소</th><th>비고</th><th></th></tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id}>
                  <td><span className="badge">{TYPE_LABEL[r.type]}</span></td>
                  <td style={{ fontWeight: 1000 }}>{r.name}</td>
                  <td>{r.region}</td>
                  <td>{r.phone}</td>
                  <td className="muted">{r.address}</td>
                  <td className="muted">{r.note ?? "-"}</td>
                  <td>
                    <button className="btn">연계 이력</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Shell>
  );
}
