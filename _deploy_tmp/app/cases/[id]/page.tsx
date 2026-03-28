"use client";

import Shell from "@/components/Shell";
import Tabs from "@/components/Tabs";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";

function fmt(ts?: string) {
  if (!ts) return "-";
  const d = new Date(ts);
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
}

type CaseEvent = {
  eventId: string;
  eventType: string;
  title: string;
  note: string | null;
  eventAt: string;
};

type CaseTask = {
  taskId: string;
  title: string;
  dueAt: string | null;
  status: string;
};

type IspRow = {
  version: number;
  updatedAt: string;
};

type CaseDetail = {
  caseId: string;
  subjectLabel: string;
  centerId: string | null;
  status: string;
  triage: string;
  createdAt: string;
  updatedAt: string;
  events: CaseEvent[];
  tasks: CaseTask[];
  isps: IspRow[];
};

export default function CaseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [c, setC] = useState<CaseDetail | null>(null);
  const [tab, setTab] = useState("summary");
  const [newNote, setNewNote] = useState("");
  const [tasks, setTasks] = useState<CaseTask[]>([]);

  const load = useCallback(() => {
    fetch(`/api/cases/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) return;
        setC(data);
        setTasks(data.tasks ?? []);
      });
  }, [id]);

  useEffect(() => { load(); }, [load]);

  if (!c) {
    return (
      <Shell title="사례관리(케이스 상세)" subtitle="로딩 중...">
        <div className="card"><div className="card-b">Loading...</div></div>
      </Shell>
    );
  }

  const tabs = [
    { key: "summary", label: "요약" },
    { key: "timeline", label: "타임라인" },
    { key: "tasks", label: "업무(할 일)" },
    { key: "monitoring", label: "모니터링/사후관리" },
    { key: "close", label: "종결" },
  ];

  const addEvent = (eventType: string, title: string, note: string) => {
    fetch(`/api/cases/${id}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventType, title, note }),
    }).then(() => load());
  };

  const updateStatus = (status: string) => {
    fetch(`/api/cases/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    }).then(() => load());
  };

  const currentIsp = c.isps?.[0];

  return (
    <Shell
      title="사례관리(케이스 상세)"
      subtitle={`${c.subjectLabel} · ${c.centerId ?? "-"} · ${c.status} · ${c.triage}`}
    >
      <div className="card">
        <div className="card-h">
          <span>케이스 상세</span>
          <span className="pill">ID: {c.caseId}</span>
        </div>

        <div className="card-b" style={{ display: "grid", gap: 12 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <button className="btn primary" onClick={() => router.push(`/isp/${c.caseId}`)}>
              ISP 수립/수정
            </button>
            <button className="btn" onClick={() => router.push("/integrations")}>
              연계관리 보기
            </button>
            <button className="btn" onClick={() => router.push("/stats")}>
              통계 대시보드
            </button>
            <span className="badge">생성 {fmt(c.createdAt)}</span>
            <span className="badge">업데이트 {fmt(c.updatedAt)}</span>
          </div>

          <Tabs tabs={tabs} active={tab} onChange={setTab} />

          {tab === "summary" && (
            <div className="grid2">
              <div className="kpi">
                <div className="label">상태</div>
                <div className="value">{c.status}</div>
              </div>
              <div className="kpi">
                <div className="label">ISP</div>
                <div className="value" style={{ fontSize: 16 }}>
                  {currentIsp
                    ? `v${currentIsp.version} (updated ${fmt(currentIsp.updatedAt)})`
                    : "미수립"}
                </div>
              </div>

              <div className="card" style={{ boxShadow: "none" }}>
                <div className="card-b" style={{ display: "grid", gap: 8 }}>
                  <div style={{ fontWeight: 1000 }}>빠른 기록(사건/조치)</div>
                  <textarea
                    className="textarea"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="상담/조치/연계 내용을 간단히 기록"
                  />
                  <button
                    className="btn primary"
                    onClick={() => {
                      addEvent("INTERVENTION", "업무 기록", newNote || "(내용 없음)");
                      setNewNote("");
                    }}
                  >
                    타임라인에 추가
                  </button>
                </div>
              </div>

              <div className="card" style={{ boxShadow: "none" }}>
                <div className="card-b" style={{ display: "grid", gap: 8 }}>
                  <div style={{ fontWeight: 1000 }}>상태 변경</div>
                  <select
                    className="select"
                    value={c.status}
                    onChange={(e) => updateStatus(e.target.value)}
                  >
                    <option value="NEW">NEW</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="MONITORING">MONITORING</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>
                  <div className="muted">
                    ※ 상태 변경은 실제 업무규칙/권한에 따라 제한될 수 있습니다.
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === "timeline" && (
            <div className="card" style={{ boxShadow: "none" }}>
              <div className="card-b">
                <table className="table">
                  <thead>
                    <tr>
                      <th>시각</th>
                      <th>유형</th>
                      <th>제목</th>
                      <th>메모</th>
                    </tr>
                  </thead>
                  <tbody>
                    {c.events.map((e) => (
                      <tr key={e.eventId}>
                        <td>{fmt(e.eventAt)}</td>
                        <td>{e.eventType}</td>
                        <td style={{ fontWeight: 1000 }}>{e.title}</td>
                        <td className="muted">{e.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === "tasks" && (
            <div className="card" style={{ boxShadow: "none" }}>
              <div className="card-b">
                <table className="table">
                  <thead>
                    <tr>
                      <th>업무</th>
                      <th>기한</th>
                      <th>상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((t) => (
                      <tr key={t.taskId}>
                        <td style={{ fontWeight: 1000 }}>{t.title}</td>
                        <td>{fmt(t.dueAt ?? undefined)}</td>
                        <td>
                          <select
                            className="select"
                            value={t.status}
                            onChange={(e) => {
                              setTasks((prev) =>
                                prev.map((x) =>
                                  x.taskId === t.taskId ? { ...x, status: e.target.value } : x
                                )
                              );
                            }}
                          >
                            <option value="TODO">TODO</option>
                            <option value="DOING">DOING</option>
                            <option value="DONE">DONE</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === "monitoring" && (
            <div className="card" style={{ boxShadow: "none" }}>
              <div className="card-b" style={{ display: "grid", gap: 10 }}>
                <div style={{ fontWeight: 1000 }}>모니터링 체크</div>
                <div className="muted">
                  - 재사용 트리거/무단 결석/연락두절 등 발생 시 이벤트 등록<br />
                  - 필요 시 의료기관/정신건강(MHIS)/사법기관 연계 여부 검토
                </div>
                <button
                  className="btn primary"
                  onClick={() =>
                    addEvent("MONITORING", "정기 모니터링", "정기점검 수행(예시)")
                  }
                >
                  모니터링 이벤트 추가
                </button>
              </div>
            </div>
          )}

          {tab === "close" && (
            <div className="card" style={{ boxShadow: "none" }}>
              <div className="card-b" style={{ display: "grid", gap: 10 }}>
                <div style={{ fontWeight: 1000 }}>종결 처리</div>
                <div className="muted">
                  - 목표 달성/중단/타기관 전원 등 종결 사유를 기록하고 상태를 CLOSED로 변경합니다.
                </div>
                <textarea className="textarea" placeholder="종결 사유/성과/사후관리 계획(요약)" />
                <button
                  className="btn primary"
                  onClick={() => {
                    updateStatus("CLOSED");
                    addEvent("CLOSE", "케이스 종결", "종결 처리(예시)");
                  }}
                >
                  CLOSED로 종결
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Shell>
  );
}
