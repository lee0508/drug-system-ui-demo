"use client";

import Shell from "@/components/Shell";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

function newId() {
  return `tmp-${Math.random().toString(16).slice(2, 9)}`;
}

type ISPGoal = {
  id: string;
  horizon: "SHORT" | "MID" | "LONG";
  goal: string;
  metric: string;
  due: string;
};

type ISPIntervention = {
  id: string;
  category: "COUNSELING" | "PROGRAM" | "MEDICAL" | "MHIS" | "LEGAL" | "WELFARE" | "FAMILY";
  action: string;
  owner: string;
  schedule: string;
};

type CaseInfo = {
  caseId: string;
  subjectLabel: string;
  isps: Array<{
    version: number;
    updatedAt: string;
    reviewCycle: string;
    crisisPlan: string | null;
    problems: Array<{ problem: string; sortOrder: number }>;
    goals: Array<{ goalId: string; horizon: string; goal: string; metric: string | null; due: string | null }>;
    interventions: Array<{ ivId: string; category: string; action: string; owner: string | null; schedule: string | null }>;
  }>;
};

export default function ISPPage() {
  const { caseId } = useParams<{ caseId: string }>();
  const router = useRouter();

  const [caseInfo, setCaseInfo] = useState<CaseInfo | null>(null);
  const [problems, setProblems] = useState<string[]>([""]);
  const [goals, setGoals] = useState<ISPGoal[]>([]);
  const [interventions, setInterventions] = useState<ISPIntervention[]>([]);
  const [reviewCycle, setReviewCycle] = useState<"WEEKLY" | "MONTHLY" | "QUARTERLY">("MONTHLY");
  const [crisisPlan, setCrisisPlan] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/cases/${caseId}`)
      .then((r) => r.json())
      .then((data: CaseInfo) => {
        setCaseInfo(data);
        const isp = data.isps?.[0];
        if (isp) {
          setProblems(isp.problems.map((p) => p.problem).length > 0
            ? isp.problems.map((p) => p.problem)
            : [""]);
          setGoals(
            isp.goals.map((g) => ({
              id: g.goalId,
              horizon: g.horizon as ISPGoal["horizon"],
              goal: g.goal,
              metric: g.metric ?? "",
              due: g.due ? new Date(g.due).toISOString().split("T")[0] : "",
            }))
          );
          setInterventions(
            isp.interventions.map((iv) => ({
              id: iv.ivId,
              category: iv.category as ISPIntervention["category"],
              action: iv.action,
              owner: iv.owner ?? "",
              schedule: iv.schedule ?? "",
            }))
          );
          setReviewCycle(isp.reviewCycle as "WEEKLY" | "MONTHLY" | "QUARTERLY");
          setCrisisPlan(isp.crisisPlan ?? "");
        }
      });
  }, [caseId]);

  if (!caseInfo) {
    return (
      <Shell title="ISP 수립" subtitle="로딩 중...">
        <div className="card"><div className="card-b">Loading...</div></div>
      </Shell>
    );
  }

  const currentVersion = caseInfo.isps?.[0]?.version ?? 0;
  const nextVersion = currentVersion + 1;

  const onSave = async () => {
    setSaving(true);
    try {
      await fetch(`/api/cases/${caseId}/isp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problems: problems.map((p) => p.trim()).filter(Boolean),
          goals: goals.map((g) => ({
            horizon: g.horizon,
            goal: g.goal,
            metric: g.metric || undefined,
            due: g.due || undefined,
          })),
          interventions: interventions.map((iv) => ({
            category: iv.category,
            action: iv.action,
            owner: iv.owner || undefined,
            schedule: iv.schedule || undefined,
          })),
          reviewCycle,
          crisisPlan: crisisPlan.trim(),
        }),
      });
      router.push(`/cases/${caseId}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Shell
      title="ISP 수립/수정"
      subtitle={`${caseInfo.subjectLabel} · ID:${caseId} · v${nextVersion}`}
    >
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
                      onChange={(e) =>
                        setProblems((prev) => prev.map((x, i) => (i === idx ? e.target.value : x)))
                      }
                      placeholder="예: 재사용 위험 / 가족갈등 / 불안·수면 문제"
                    />
                    <button
                      className="btn"
                      onClick={() => setProblems((prev) => prev.filter((_, i) => i !== idx))}
                      disabled={problems.length <= 1}
                    >
                      삭제
                    </button>
                  </div>
                ))}
                <button className="btn" onClick={() => setProblems((prev) => [...prev, ""])}>
                  문제 추가
                </button>
              </div>
            </div>

            <div className="card" style={{ boxShadow: "none" }}>
              <div className="card-b" style={{ display: "grid", gap: 10 }}>
                <div style={{ fontWeight: 1000 }}>2) 점검주기 & 위기대응계획</div>
                <div>
                  <div style={{ fontWeight: 1000, marginBottom: 6 }}>점검주기(Review Cycle)</div>
                  <select
                    className="select"
                    value={reviewCycle}
                    onChange={(e) => setReviewCycle(e.target.value as typeof reviewCycle)}
                  >
                    <option value="WEEKLY">WEEKLY</option>
                    <option value="MONTHLY">MONTHLY</option>
                    <option value="QUARTERLY">QUARTERLY</option>
                  </select>
                </div>
                <div>
                  <div style={{ fontWeight: 1000, marginBottom: 6 }}>위기대응계획(Crisis Plan)</div>
                  <textarea
                    className="textarea"
                    value={crisisPlan}
                    onChange={(e) => setCrisisPlan(e.target.value)}
                    placeholder="재사용 의심/연락두절/응급상황 시 절차(예: 콜백→대면→의료기관 연계)"
                  />
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
                    { id: newId(), horizon: "SHORT", goal: "", metric: "", due: "" },
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
                        <select
                          className="select"
                          value={g.horizon}
                          onChange={(e) =>
                            setGoals((prev) =>
                              prev.map((x) =>
                                x.id === g.id ? { ...x, horizon: e.target.value as ISPGoal["horizon"] } : x
                              )
                            )
                          }
                        >
                          <option value="SHORT">SHORT</option>
                          <option value="MID">MID</option>
                          <option value="LONG">LONG</option>
                        </select>
                      </td>
                      <td>
                        <input
                          className="input"
                          value={g.goal}
                          onChange={(e) =>
                            setGoals((prev) =>
                              prev.map((x) => (x.id === g.id ? { ...x, goal: e.target.value } : x))
                            )
                          }
                        />
                      </td>
                      <td>
                        <input
                          className="input"
                          value={g.metric}
                          onChange={(e) =>
                            setGoals((prev) =>
                              prev.map((x) => (x.id === g.id ? { ...x, metric: e.target.value } : x))
                            )
                          }
                        />
                      </td>
                      <td>
                        <input
                          className="input"
                          value={g.due}
                          onChange={(e) =>
                            setGoals((prev) =>
                              prev.map((x) => (x.id === g.id ? { ...x, due: e.target.value } : x))
                            )
                          }
                          placeholder="YYYY-MM-DD"
                        />
                      </td>
                      <td>
                        <button
                          className="btn"
                          onClick={() => setGoals((prev) => prev.filter((x) => x.id !== g.id))}
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))}
                  {goals.length === 0 && (
                    <tr>
                      <td colSpan={5} className="muted">
                        목표를 추가하세요.
                      </td>
                    </tr>
                  )}
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
                    { id: newId(), category: "COUNSELING", action: "", owner: "", schedule: "" },
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
                  {interventions.map((iv) => (
                    <tr key={iv.id}>
                      <td>
                        <select
                          className="select"
                          value={iv.category}
                          onChange={(e) =>
                            setInterventions((prev) =>
                              prev.map((x) =>
                                x.id === iv.id
                                  ? { ...x, category: e.target.value as ISPIntervention["category"] }
                                  : x
                              )
                            )
                          }
                        >
                          <option value="COUNSELING">COUNSELING</option>
                          <option value="PROGRAM">PROGRAM</option>
                          <option value="MEDICAL">MEDICAL</option>
                          <option value="MHIS">MHIS</option>
                          <option value="LEGAL">LEGAL</option>
                          <option value="WELFARE">WELFARE</option>
                          <option value="FAMILY">FAMILY</option>
                        </select>
                      </td>
                      <td>
                        <input
                          className="input"
                          value={iv.action}
                          onChange={(e) =>
                            setInterventions((prev) =>
                              prev.map((x) => (x.id === iv.id ? { ...x, action: e.target.value } : x))
                            )
                          }
                        />
                      </td>
                      <td>
                        <input
                          className="input"
                          value={iv.owner}
                          onChange={(e) =>
                            setInterventions((prev) =>
                              prev.map((x) => (x.id === iv.id ? { ...x, owner: e.target.value } : x))
                            )
                          }
                        />
                      </td>
                      <td>
                        <input
                          className="input"
                          value={iv.schedule}
                          onChange={(e) =>
                            setInterventions((prev) =>
                              prev.map((x) =>
                                x.id === iv.id ? { ...x, schedule: e.target.value } : x
                              )
                            )
                          }
                        />
                      </td>
                      <td>
                        <button
                          className="btn"
                          onClick={() =>
                            setInterventions((prev) => prev.filter((x) => x.id !== iv.id))
                          }
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))}
                  {interventions.length === 0 && (
                    <tr>
                      <td colSpan={5} className="muted">
                        개입을 추가하세요.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", flexWrap: "wrap" }}>
            <button className="btn" onClick={() => router.push(`/cases/${caseId}`)}>
              취소
            </button>
            <button className="btn primary" onClick={onSave} disabled={saving}>
              {saving ? "저장 중..." : "ISP 저장"}
            </button>
          </div>
        </div>
      </div>
    </Shell>
  );
}
