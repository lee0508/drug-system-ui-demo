"use client";

import Shell from "@/components/Shell";
import { useApp } from "@/components/AppProvider";
import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ISPGoal, ISPIntervention, ISPPlan } from "@/lib/types";

function newId(prefix: string) {
  return `${prefix}-${Math.random().toString(16).slice(2, 9)}`;
}

export default function ISPPage() {
  const { caseId } = useParams<{ caseId: string }>();
  const router = useRouter();
  const { cases, saveISP } = useApp();

  const c = useMemo(() => cases.find((x) => x.id === caseId), [cases, caseId]);

  const [problems, setProblems] = useState<string[]>(c?.isp?.problems ?? [""]);
  const [goals, setGoals] = useState<ISPGoal[]>(c?.isp?.goals ?? []);
  const [interventions, setInterventions] = useState<ISPIntervention[]>(c?.isp?.interventions ?? []);
  const [reviewCycle, setReviewCycle] = useState<ISPPlan["reviewCycle"]>(c?.isp?.reviewCycle ?? "MONTHLY");
  const [crisisPlan, setCrisisPlan] = useState<string>(c?.isp?.crisisPlan ?? "");

  if (!c) {
    return (
      <Shell title="ISP 수립" subtitle="케이스를 찾을 수 없습니다.">
        <div className="card"><div className="card-b">Invalid case.</div></div>
      </Shell>
    );
  }

  const nextVersion = (c.isp?.version ?? 0) + 1;

  const onSave = () => {
    const isp: ISPPlan = {
      caseId: c.id,
      version: nextVersion,
      problems: problems.map((p) => p.trim()).filter(Boolean),
      goals,
      interventions,
      reviewCycle,
      crisisPlan: crisisPlan.trim(),
      updatedAt: new Date().toISOString(),
    };
    saveISP(c.id, isp);
    router.push(`/cases/${c.id}`);
  };

  return (
    <Shell title="ISP 수립/수정" subtitle={`${c.subjectLabel} · ${c.id} · v${nextVersion}`}>
      <div className="card">
        <div className="card-h">
          <span>ISP Builder</span>
          <span className="pill">문제목록 · 목표 · 개입 · 점검주기</span>
        </div>
        <div className="card-b" style={{ display: "grid", gap: 12 }}>
          <div className="grid2">
            <div className="card" style={{ boxShadow: "none" }}>
              <div className="card-b" style={{ display: "grid", gap: 10 }}>
                <div style={{ fontWeight: 1000 }}>1) 문제목록(Problem List)</div>
                {problems.map((p, idx) => (
                  <div key={idx} style={{ display: "flex", gap: 8 }}>
                    <input
                      className="input"
                      value={p}
                      onChange={(e) => setProblems((prev) => prev.map((x, i) => (i === idx ? e.target.value : x)))}
                      placeholder="예: 재사용 위험 / 가족갈등 / 불안·수면 문제"
                    />
                    <button className="btn" onClick={() => setProblems((prev) => prev.filter((_, i) => i !== idx))} disabled={problems.length <= 1}>
                      삭제
                    </button>
                  </div>
                ))}
                <button className="btn" onClick={() => setProblems((prev) => [...prev, ""])}>문제 추가</button>
              </div>
            </div>

            <div className="card" style={{ boxShadow: "none" }}>
              <div className="card-b" style={{ display: "grid", gap: 10 }}>
                <div style={{ fontWeight: 1000 }}>2) 점검주기 & 위기대응계획</div>
                <div>
                  <div style={{ fontWeight: 1000, marginBottom: 6 }}>점검주기(Review Cycle)</div>
                  <select className="select" value={reviewCycle} onChange={(e) => setReviewCycle(e.target.value as any)}>
                    <option value="WEEKLY">WEEKLY</option>
                    <option value="MONTHLY">MONTHLY</option>
                    <option value="QUARTERLY">QUARTERLY</option>
                  </select>
                </div>
                <div>
                  <div style={{ fontWeight: 1000, marginBottom: 6 }}>위기대응계획(Crisis Plan)</div>
                  <textarea className="textarea" value={crisisPlan} onChange={(e) => setCrisisPlan(e.target.value)} placeholder="재사용 의심/연락두절/응급상황 시 절차(예: 콜백→대면→의료기관 연계)" />
                </div>
              </div>
            </div>
          </div>

          <div className="card" style={{ boxShadow: "none" }}>
            <div className="card-b" style={{ display: "grid", gap: 10 }}>
              <div style={{ fontWeight: 1000 }}>3) 목표(Goals)</div>
              <button
                className="btn"
                onClick={() =>
                  setGoals((prev) => [
                    ...prev,
                    { id: newId("G"), horizon: "SHORT", goal: "", metric: "", due: "" },
                  ])
                }
              >
                목표 추가
              </button>

              <table className="table">
                <thead>
                  <tr>
                    <th>기간</th>
                    <th>목표</th>
                    <th>지표</th>
                    <th>기한</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {goals.map((g) => (
                    <tr key={g.id}>
                      <td>
                        <select className="select" value={g.horizon} onChange={(e) => setGoals((prev) => prev.map((x) => (x.id === g.id ? { ...x, horizon: e.target.value as any } : x)))}>
                          <option value="SHORT">SHORT</option>
                          <option value="MID">MID</option>
                          <option value="LONG">LONG</option>
                        </select>
                      </td>
                      <td><input className="input" value={g.goal} onChange={(e) => setGoals((prev) => prev.map((x) => (x.id === g.id ? { ...x, goal: e.target.value } : x)))} /></td>
                      <td><input className="input" value={g.metric ?? ""} onChange={(e) => setGoals((prev) => prev.map((x) => (x.id === g.id ? { ...x, metric: e.target.value } : x)))} /></td>
                      <td><input className="input" value={g.due ?? ""} onChange={(e) => setGoals((prev) => prev.map((x) => (x.id === g.id ? { ...x, due: e.target.value } : x)))} placeholder="YYYY-MM-DD" /></td>
                      <td><button className="btn" onClick={() => setGoals((prev) => prev.filter((x) => x.id !== g.id))}>삭제</button></td>
                    </tr>
                  ))}
                  {goals.length === 0 && <tr><td colSpan={5} className="muted">목표를 추가하세요.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card" style={{ boxShadow: "none" }}>
            <div className="card-b" style={{ display: "grid", gap: 10 }}>
              <div style={{ fontWeight: 1000 }}>4) 개입(Interventions)</div>
              <button
                className="btn"
                onClick={() =>
                  setInterventions((prev) => [
                    ...prev,
                    { id: newId("I"), category: "COUNSELING", action: "", owner: "", schedule: "" },
                  ])
                }
              >
                개입 추가
              </button>

              <table className="table">
                <thead>
                  <tr>
                    <th>유형</th>
                    <th>개입내용</th>
                    <th>담당</th>
                    <th>일정</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {interventions.map((i) => (
                    <tr key={i.id}>
                      <td>
                        <select className="select" value={i.category} onChange={(e) => setInterventions((prev) => prev.map((x) => (x.id === i.id ? { ...x, category: e.target.value as any } : x)))}>
                          <option value="COUNSELING">COUNSELING</option>
                          <option value="PROGRAM">PROGRAM</option>
                          <option value="MEDICAL">MEDICAL</option>
                          <option value="MHIS">MHIS</option>
                          <option value="LEGAL">LEGAL</option>
                          <option value="WELFARE">WELFARE</option>
                          <option value="FAMILY">FAMILY</option>
                        </select>
                      </td>
                      <td><input className="input" value={i.action} onChange={(e) => setInterventions((prev) => prev.map((x) => (x.id === i.id ? { ...x, action: e.target.value } : x)))} /></td>
                      <td><input className="input" value={i.owner ?? ""} onChange={(e) => setInterventions((prev) => prev.map((x) => (x.id === i.id ? { ...x, owner: e.target.value } : x)))} /></td>
                      <td><input className="input" value={i.schedule ?? ""} onChange={(e) => setInterventions((prev) => prev.map((x) => (x.id === i.id ? { ...x, schedule: e.target.value } : x)))} /></td>
                      <td><button className="btn" onClick={() => setInterventions((prev) => prev.filter((x) => x.id !== i.id))}>삭제</button></td>
                    </tr>
                  ))}
                  {interventions.length === 0 && <tr><td colSpan={5} className="muted">개입을 추가하세요.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", flexWrap: "wrap" }}>
            <button className="btn" onClick={() => router.push(`/cases/${c.id}`)}>취소</button>
            <button className="btn primary" onClick={onSave}>ISP 저장</button>
          </div>
        </div>
      </div>
    </Shell>
  );
}
