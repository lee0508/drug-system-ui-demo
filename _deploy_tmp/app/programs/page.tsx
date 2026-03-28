"use client";

import Shell from "@/components/Shell";
import { useEffect, useState } from "react";

type Program = {
  programId: string;
  programName: string;
  programType: string;
  durationWeeks?: number;
  memo?: string;
  createdAt: string;
  _count?: { sessions: number; enrolls: number };
};

type Session = {
  sessionId: string;
  sessionNo: number;
  sessionDate: string;
  location?: string;
  facilitator?: string;
  memo?: string;
};

type Enroll = {
  enrollId: string;
  subjectId: string;
  enrollDate: string;
  statusCode: string;
  subject?: { alias: string; caseNo: string };
};

const PROGRAM_TYPES: Record<string, string> = {
  CBT: "인지행동치료(CBT)", GROUP: "집단상담", REHAB: "재활교육",
  FAMILY: "가족교육", OTHER: "기타",
};
const ENROLL_STATUS: Record<string, string> = {
  ENROLLED: "등록", COMPLETED: "수료", DROPPED: "중도탈락",
};

const initProgramForm = { programName: "", programType: "REHAB", durationWeeks: "", memo: "" };

export default function ProgramsPage() {
  const [tab, setTab] = useState<"info" | "sessions" | "enrolls">("info");
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selected, setSelected] = useState<Program | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [enrolls, setEnrolls] = useState<Enroll[]>([]);
  const [loading, setLoading] = useState(true);

  const [showProgramForm, setShowProgramForm] = useState(false);
  const [programForm, setProgramForm] = useState(initProgramForm);
  const [saving, setSaving] = useState(false);

  const [showSessionForm, setShowSessionForm] = useState(false);
  const [sessionForm, setSessionForm] = useState({
    sessionNo: 1, sessionDate: new Date().toISOString().slice(0, 10),
    location: "", facilitator: "", memo: "",
  });

  const [showEnrollForm, setShowEnrollForm] = useState(false);
  const [enrollSubjectId, setEnrollSubjectId] = useState("");
  const [enrollDate, setEnrollDate] = useState(new Date().toISOString().slice(0, 10));

  async function loadPrograms() {
    setLoading(true);
    const res = await fetch("/api/programs?limit=100").then(r => r.json());
    setPrograms(res.items ?? []);
    setLoading(false);
  }

  async function loadDetail(p: Program) {
    setSelected(p);
    setTab("info");
    const [sess, enr] = await Promise.all([
      fetch(`/api/programs/${p.programId}/sessions`).then(r => r.json()),
      fetch(`/api/programs/${p.programId}/enrolls`).then(r => r.json()),
    ]);
    setSessions(sess);
    setEnrolls(enr);
  }

  useEffect(() => { loadPrograms(); }, []);

  async function saveProgram() {
    if (!programForm.programName) { alert("프로그램명은 필수입니다."); return; }
    setSaving(true);
    await fetch("/api/programs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...programForm,
        durationWeeks: programForm.durationWeeks ? parseInt(programForm.durationWeeks) : undefined,
      }),
    });
    setSaving(false);
    setShowProgramForm(false);
    setProgramForm(initProgramForm);
    loadPrograms();
  }

  async function addSession() {
    if (!selected) return;
    setSaving(true);
    await fetch(`/api/programs/${selected.programId}/sessions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sessionForm),
    });
    setSaving(false);
    setShowSessionForm(false);
    const sess = await fetch(`/api/programs/${selected.programId}/sessions`).then(r => r.json());
    setSessions(sess);
  }

  async function addEnroll() {
    if (!selected || !enrollSubjectId) { alert("대상자 ID를 입력하세요."); return; }
    setSaving(true);
    await fetch(`/api/programs/${selected.programId}/enrolls`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subjectId: enrollSubjectId, enrollDate }),
    });
    setSaving(false);
    setShowEnrollForm(false);
    setEnrollSubjectId("");
    const enr = await fetch(`/api/programs/${selected.programId}/enrolls`).then(r => r.json());
    setEnrolls(enr);
  }

  const tabStyle = (t: string) => ({
    padding: "6px 14px", cursor: "pointer", fontSize: 13, background: "none", border: "none",
    borderBottom: tab === t ? "2px solid var(--blue)" : "2px solid transparent",
    fontWeight: tab === t ? 900 : 400, color: tab === t ? "var(--blue)" : "var(--ink)",
  } as React.CSSProperties);

  return (
    <Shell title="프로그램/출석" subtitle="프로그램 관리, 회기 등록, 참가자 등록">
      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 12 }}>
        {/* 프로그램 목록 */}
        <div>
          <div className="card">
            <div className="card-h">
              <span>프로그램 목록</span>
              <button className="btn" onClick={() => setShowProgramForm(v => !v)}>+ 등록</button>
            </div>

            {showProgramForm && (
              <div className="card-b" style={{ borderBottom: "1px solid var(--line)" }}>
                <div style={{ display: "grid", gap: 8 }}>
                  <label style={{ fontSize: 12, display: "grid", gap: 2 }}>
                    프로그램명 *
                    <input className="input" value={programForm.programName}
                      onChange={e => setProgramForm(f => ({ ...f, programName: e.target.value }))} />
                  </label>
                  <label style={{ fontSize: 12, display: "grid", gap: 2 }}>
                    유형
                    <select className="input" value={programForm.programType}
                      onChange={e => setProgramForm(f => ({ ...f, programType: e.target.value }))}>
                      {Object.entries(PROGRAM_TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                  </label>
                  <label style={{ fontSize: 12, display: "grid", gap: 2 }}>
                    기간(주) <input className="input" type="number" min={1} value={programForm.durationWeeks}
                      onChange={e => setProgramForm(f => ({ ...f, durationWeeks: e.target.value }))} />
                  </label>
                  <label style={{ fontSize: 12, display: "grid", gap: 2 }}>
                    메모 <textarea className="input" rows={2} value={programForm.memo}
                      onChange={e => setProgramForm(f => ({ ...f, memo: e.target.value }))} />
                  </label>
                  <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                    <button className="btn" onClick={() => setShowProgramForm(false)}>취소</button>
                    <button className="btn-primary" onClick={saveProgram} disabled={saving}>{saving ? "저장..." : "저장"}</button>
                  </div>
                </div>
              </div>
            )}

            <div className="card-b" style={{ padding: "8px 10px", display: "grid", gap: 4 }}>
              {loading ? (
                <div className="muted" style={{ fontSize: 12 }}>불러오는 중...</div>
              ) : programs.length === 0 ? (
                <div className="muted" style={{ fontSize: 12 }}>등록된 프로그램이 없습니다.</div>
              ) : (
                programs.map(p => (
                  <button
                    key={p.programId}
                    className="btn"
                    style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "8px 10px", fontSize: 12, textAlign: "left",
                      background: selected?.programId === p.programId ? "linear-gradient(180deg,var(--blue),var(--blue2))" : "#fff",
                      color: selected?.programId === p.programId ? "#fff" : "var(--ink)",
                    }}
                    onClick={() => loadDetail(p)}
                  >
                    <div>
                      <div style={{ fontWeight: 700 }}>{p.programName}</div>
                      <div style={{ fontSize: 11, opacity: 0.8 }}>{PROGRAM_TYPES[p.programType] ?? p.programType}</div>
                    </div>
                    <div style={{ fontSize: 11, opacity: 0.8, textAlign: "right" }}>
                      <div>회기 {p._count?.sessions ?? 0}</div>
                      <div>참가 {p._count?.enrolls ?? 0}</div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* 상세 */}
        <div>
          {!selected ? (
            <div className="card">
              <div className="card-b muted" style={{ textAlign: "center", padding: 48 }}>
                좌측 목록에서 프로그램을 선택하세요.
              </div>
            </div>
          ) : (
            <>
              <div className="card" style={{ marginBottom: 12 }}>
                <div className="card-h">
                  <span style={{ fontWeight: 900 }}>{selected.programName}</span>
                  <span className="badge">{PROGRAM_TYPES[selected.programType] ?? selected.programType}</span>
                </div>
                <div style={{ display: "flex", borderBottom: "1px solid var(--line)", padding: "0 16px" }}>
                  <button style={tabStyle("info")} onClick={() => setTab("info")}>기본정보</button>
                  <button style={tabStyle("sessions")} onClick={() => setTab("sessions")}>회기관리 ({sessions.length})</button>
                  <button style={tabStyle("enrolls")} onClick={() => setTab("enrolls")}>참가자 ({enrolls.length})</button>
                </div>
              </div>

              {tab === "info" && (
                <div className="card">
                  <div className="card-b">
                    <div className="grid2" style={{ gap: 8, fontSize: 13 }}>
                      <div><span className="muted">프로그램명</span> &nbsp;{selected.programName}</div>
                      <div><span className="muted">유형</span> &nbsp;{PROGRAM_TYPES[selected.programType] ?? selected.programType}</div>
                      <div><span className="muted">기간</span> &nbsp;{selected.durationWeeks ? `${selected.durationWeeks}주` : "-"}</div>
                      <div><span className="muted">등록일</span> &nbsp;{new Date(selected.createdAt).toLocaleDateString()}</div>
                      {selected.memo && (
                        <div style={{ gridColumn: "1 / -1" }}><span className="muted">메모</span> &nbsp;{selected.memo}</div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {tab === "sessions" && (
                <div className="card">
                  <div className="card-h">
                    <span>회기 목록</span>
                    <button className="btn" onClick={() => setShowSessionForm(v => !v)}>+ 회기 추가</button>
                  </div>
                  {showSessionForm && (
                    <div className="card-b" style={{ borderBottom: "1px solid var(--line)" }}>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "flex-end" }}>
                        <label style={{ fontSize: 12, display: "grid", gap: 2 }}>
                          회기 <input className="input" type="number" min={1} value={sessionForm.sessionNo}
                            onChange={e => setSessionForm(f => ({ ...f, sessionNo: parseInt(e.target.value) || 1 }))} style={{ width: 60 }} />
                        </label>
                        <label style={{ fontSize: 12, display: "grid", gap: 2 }}>
                          일자 <input className="input" type="date" value={sessionForm.sessionDate}
                            onChange={e => setSessionForm(f => ({ ...f, sessionDate: e.target.value }))} />
                        </label>
                        <label style={{ fontSize: 12, display: "grid", gap: 2 }}>
                          장소 <input className="input" value={sessionForm.location}
                            onChange={e => setSessionForm(f => ({ ...f, location: e.target.value }))} style={{ width: 110 }} />
                        </label>
                        <label style={{ fontSize: 12, display: "grid", gap: 2 }}>
                          진행자 <input className="input" value={sessionForm.facilitator}
                            onChange={e => setSessionForm(f => ({ ...f, facilitator: e.target.value }))} style={{ width: 90 }} />
                        </label>
                        <button className="btn-primary" onClick={addSession} disabled={saving}>{saving ? "저장..." : "추가"}</button>
                        <button className="btn" onClick={() => setShowSessionForm(false)}>취소</button>
                      </div>
                    </div>
                  )}
                  <div className="card-b">
                    {sessions.length === 0 ? (
                      <div className="muted">등록된 회기가 없습니다.</div>
                    ) : (
                      <table className="table">
                        <thead><tr><th>회기</th><th>일자</th><th>장소</th><th>진행자</th><th>메모</th></tr></thead>
                        <tbody>
                          {sessions.map(s => (
                            <tr key={s.sessionId}>
                              <td style={{ fontWeight: 900 }}>{s.sessionNo}회기</td>
                              <td>{new Date(s.sessionDate).toLocaleDateString()}</td>
                              <td className="muted">{s.location ?? "-"}</td>
                              <td className="muted">{s.facilitator ?? "-"}</td>
                              <td className="muted">{s.memo ?? "-"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}

              {tab === "enrolls" && (
                <div className="card">
                  <div className="card-h">
                    <span>참가자 목록</span>
                    <button className="btn" onClick={() => setShowEnrollForm(v => !v)}>+ 참가자 등록</button>
                  </div>
                  {showEnrollForm && (
                    <div className="card-b" style={{ borderBottom: "1px solid var(--line)" }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "flex-end", flexWrap: "wrap" }}>
                        <label style={{ fontSize: 12, display: "grid", gap: 2 }}>
                          대상자 ID *
                          <input className="input" value={enrollSubjectId}
                            onChange={e => setEnrollSubjectId(e.target.value)} placeholder="SUBJ..." style={{ width: 160 }} />
                        </label>
                        <label style={{ fontSize: 12, display: "grid", gap: 2 }}>
                          등록일 <input className="input" type="date" value={enrollDate}
                            onChange={e => setEnrollDate(e.target.value)} />
                        </label>
                        <button className="btn-primary" onClick={addEnroll} disabled={saving}>{saving ? "저장..." : "추가"}</button>
                        <button className="btn" onClick={() => setShowEnrollForm(false)}>취소</button>
                      </div>
                    </div>
                  )}
                  <div className="card-b">
                    {enrolls.length === 0 ? (
                      <div className="muted">등록된 참가자가 없습니다.</div>
                    ) : (
                      <table className="table">
                        <thead><tr><th>관리번호</th><th>대상자</th><th>등록일</th><th>상태</th></tr></thead>
                        <tbody>
                          {enrolls.map(e => (
                            <tr key={e.enrollId}>
                              <td className="muted" style={{ fontSize: 11 }}>{e.subject?.caseNo ?? "-"}</td>
                              <td style={{ fontWeight: 700 }}>{e.subject?.alias ?? e.subjectId}</td>
                              <td>{new Date(e.enrollDate).toLocaleDateString()}</td>
                              <td><span className="badge">{ENROLL_STATUS[e.statusCode] ?? e.statusCode}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Shell>
  );
}
