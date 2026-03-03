"use client";

import Shell from "@/components/Shell";
import { mockUsers } from "@/lib/mockData";
import { useState } from "react";

const ROLE_LABEL: Record<string, string> = {
  ADMIN: "관리자", MANAGER: "팀장", COUNSELOR: "상담사", VIEWER: "열람자",
};

function fmt(ts?: string) {
  if (!ts) return "-";
  return new Date(ts).toLocaleString([], { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState(mockUsers);

  const toggle = (id: string) => {
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, active: !u.active } : u));
  };

  return (
    <Shell title="권한관리" subtitle="사용자 계정 · 역할(RBAC) · 접속 이력">
      <div className="card">
        <div className="card-h">
          <span>사용자 목록</span>
          <span className="pill">{users.length}명</span>
        </div>
        <div className="card-b">
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
            <button className="btn primary">+ 사용자 등록</button>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>이름</th>
                <th>소속 센터</th>
                <th>역할</th>
                <th>이메일</th>
                <th>최근 로그인</th>
                <th>계정 상태</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 1000 }}>{u.name}</td>
                  <td>{u.centerName}</td>
                  <td><span className="badge">{ROLE_LABEL[u.role]}</span></td>
                  <td className="muted">{u.email}</td>
                  <td>{fmt(u.lastLoginAt)}</td>
                  <td>
                    <span className="badge" style={{ background: u.active ? "#16a34a" : "#6b7280" }}>
                      {u.active ? "활성" : "비활성"}
                    </span>
                  </td>
                  <td style={{ display: "flex", gap: 4 }}>
                    <button className="btn" onClick={() => toggle(u.id)}>
                      {u.active ? "비활성화" : "활성화"}
                    </button>
                    <button className="btn">역할변경</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="muted" style={{ marginTop: 8 }}>
            ※ 비밀번호 초기화 및 접속 IP 이력은 개별 사용자 상세 화면에서 확인합니다.
          </div>
        </div>
      </div>
    </Shell>
  );
}
