"use client";

import Shell from "@/components/Shell";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

type Referral = {
  referralId: string;
  subjectId: string;
  referralType: string;
  fromOrg?: string;
  toOrg?: string;
  referralDate: string;
  statusCode: string;
  summary?: string;
  createdAt: string;
  subject?: { alias: string; caseNo: string };
};

const REF_TYPE_LABELS: Record<string, string> = {
  IN: "의뢰접수", OUT: "연계처리", RETURN: "회송",
};
const STATUS_LABELS: Record<string, string> = {
  OPEN: "진행 중", IN_PROGRESS: "처리 중", CLOSED: "종결",
};
const STATUS_BG: Record<string, string> = {
  OPEN: "#e8f4fd", IN_PROGRESS: "#fff8e1", CLOSED: "#f5f5f5",
};

const initForm = {
  subjectId: "", referralType: "OUT", fromOrg: "", toOrg: "",
  referralDate: new Date().toISOString().slice(0, 10), statusCode: "OPEN", summary: "",
};

function ReferralsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const filterSubjectId = searchParams.get("subjectId") ?? "";

  const [items, setItems] = useState<Referral[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...initForm, subjectId: filterSubjectId });
  const [saving, setSaving] = useState(false);

  // 상태 변경
  const [editId, setEditId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState("");

  const limit = 20;

  function buildQuery() {
    const q = new URLSearchParams();
    if (filterSubjectId) q.set("subjectId", filterSubjectId);
    if (typeFilter) q.set("referralType", typeFilter);
    if (statusFilter) q.set("statusCode", statusFilter);
    q.set("page", String(page));
    q.set("limit", String(limit));
    return q.toString();
  }

  async function load() {
    setLoading(true);
    const res = await fetch(`/api/referrals?${buildQuery()}`).then(r => r.json());
    setItems(res.items ?? []);
    setTotal(res.total ?? 0);
    setLoading(false);
  }

  useEffect(() => { load(); }, [page, typeFilter, statusFilter]);

  async function submit() {
    if (!form.subjectId || !form.referralDate) {
      alert("대상자ID와 의뢰일은 필수입니다.");
      return;
    }
    setSaving(true);
    await fetch("/api/referrals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setShowForm(false);
    setForm({ ...initForm, subjectId: filterSubjectId });
    load();
  }

  async function updateStatus(id: string, statusCode: string) {
    await fetch(`/api/referrals/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statusCode }),
    });
    setEditId(null);
    load();
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <Shell title="의뢰/연계" subtitle="의뢰 접수, 외부 연계, 회송 이력 관리">
      {/* 필터 */}
      <div className="card" style={{ marginBottom: 12 }}>
        <div className="card-h"><span>검색 조건</span></div>
        <div className="card-b">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "flex-end" }}>
            <label style={{ fontSize: 13, display: "grid", gap: 2 }}>
              의뢰유형
              <select className="input" value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setPage(1); }}>
                <option value="">전체</option>
                {Object.entries(REF_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </label>
            <label style={{ fontSize: 13, display: "grid", gap: 2 }}>
              상태
              <select className="input" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
                <option value="">전체</option>
                {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </label>
            <button className="btn-primary" onClick={() => { setShowForm(true); setForm(f => ({ ...f, subjectId: filterSubjectId })); }}>
              + 의뢰 등록
            </button>
          </div>
        </div>
      </div>

      {/* 등록 폼 */}
      {showForm && (
        <div className="card" style={{ marginBottom: 12, border: "2px solid var(--blue)" }}>
          <div className="card-h">
            <span>의뢰/연계 등록</span>
            <button className="btn" onClick={() => setShowForm(false)}>닫기</button>
          </div>
          <div className="card-b">
            <div className="grid2" style={{ gap: 12 }}>
              <label style={{ display: "grid", gap: 4, fontSize: 13 }}>
                대상자 ID *
                <input className="input" value={form.subjectId} onChange={e => setForm(f => ({ ...f, subjectId: e.target.value }))} placeholder="SUBJ..." />
              </label>
              <label style={{ display: "grid", gap: 4, fontSize: 13 }}>
                의뢰유형 *
                <select className="input" value={form.referralType} onChange={e => setForm(f => ({ ...f, referralType: e.target.value }))}>
                  {Object.entries(REF_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </label>
              <label style={{ display: "grid", gap: 4, fontSize: 13 }}>
                의뢰기관(From)
                <input className="input" value={form.fromOrg} onChange={e => setForm(f => ({ ...f, fromOrg: e.target.value }))} placeholder="예: 경찰서, 법원" />
              </label>
              <label style={{ display: "grid", gap: 4, fontSize: 13 }}>
                연계기관(To)
                <input className="input" value={form.toOrg} onChange={e => setForm(f => ({ ...f, toOrg: e.target.value }))} placeholder="예: 치료재활센터" />
              </label>
              <label style={{ display: "grid", gap: 4, fontSize: 13 }}>
                의뢰일 *
                <input className="input" type="date" value={form.referralDate} onChange={e => setForm(f => ({ ...f, referralDate: e.target.value }))} />
              </label>
              <label style={{ display: "grid", gap: 4, fontSize: 13 }}>
                상태
                <select className="input" value={form.statusCode} onChange={e => setForm(f => ({ ...f, statusCode: e.target.value }))}>
                  {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </label>
              <label style={{ display: "grid", gap: 4, fontSize: 13, gridColumn: "1 / -1" }}>
                요약/메모
                <textarea className="input" rows={2} value={form.summary} onChange={e => setForm(f => ({ ...f, summary: e.target.value }))} />
              </label>
            </div>
            <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button className="btn" onClick={() => setShowForm(false)}>취소</button>
              <button className="btn-primary" onClick={submit} disabled={saving}>{saving ? "저장 중..." : "저장"}</button>
            </div>
          </div>
        </div>
      )}

      {/* 목록 */}
      <div className="card">
        <div className="card-h">
          <span>의뢰/연계 이력</span>
          <span className="muted" style={{ fontSize: 12 }}>총 {total.toLocaleString()}건</span>
        </div>
        <div className="card-b">
          {loading ? (
            <div className="muted" style={{ padding: 24, textAlign: "center" }}>불러오는 중...</div>
          ) : items.length === 0 ? (
            <div className="muted">이력이 없습니다.</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>관리번호</th>
                  <th>대상자</th>
                  <th>유형</th>
                  <th>의뢰기관</th>
                  <th>연계기관</th>
                  <th>의뢰일</th>
                  <th>상태</th>
                  <th>작업</th>
                </tr>
              </thead>
              <tbody>
                {items.map(r => (
                  <tr key={r.referralId}>
                    <td className="muted" style={{ fontSize: 11 }}>{r.subject?.caseNo ?? "-"}</td>
                    <td style={{ fontWeight: 700 }}>{r.subject?.alias ?? r.subjectId}</td>
                    <td style={{ fontWeight: 700 }}>{REF_TYPE_LABELS[r.referralType] ?? r.referralType}</td>
                    <td className="muted">{r.fromOrg ?? "-"}</td>
                    <td className="muted">{r.toOrg ?? "-"}</td>
                    <td>{new Date(r.referralDate).toLocaleDateString()}</td>
                    <td>
                      {editId === r.referralId ? (
                        <div style={{ display: "flex", gap: 4 }}>
                          <select className="input" style={{ fontSize: 12, padding: "2px 6px" }} value={editStatus} onChange={e => setEditStatus(e.target.value)}>
                            {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                          </select>
                          <button className="btn-primary" style={{ fontSize: 11, padding: "2px 8px" }} onClick={() => updateStatus(r.referralId, editStatus)}>저장</button>
                          <button className="btn" style={{ fontSize: 11, padding: "2px 8px" }} onClick={() => setEditId(null)}>취소</button>
                        </div>
                      ) : (
                        <span
                          className="badge"
                          style={{ background: STATUS_BG[r.statusCode] ?? "#f0f0f0", color: "var(--ink)", cursor: "pointer" }}
                          onClick={() => { setEditId(r.referralId); setEditStatus(r.statusCode); }}
                          title="클릭하여 상태 변경"
                        >
                          {STATUS_LABELS[r.statusCode] ?? r.statusCode}
                        </span>
                      )}
                    </td>
                    <td>
                      <button
                        className="btn"
                        style={{ fontSize: 11, padding: "2px 8px" }}
                        onClick={() => router.push(`/subjects/${r.subjectId}`)}
                      >
                        대상자 →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {totalPages > 1 && (
            <div style={{ display: "flex", gap: 4, marginTop: 12, justifyContent: "center" }}>
              <button className="btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>이전</button>
              <span style={{ padding: "6px 12px", fontSize: 13 }}>{page} / {totalPages}</span>
              <button className="btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>다음</button>
            </div>
          )}
        </div>
      </div>
    </Shell>
  );
}

export default function ReferralsPage() {
  return <Suspense fallback={null}><ReferralsContent /></Suspense>;
}
