"use client";

import Shell from "@/components/Shell";
import Stepper from "@/components/Stepper";
import { useMemo, useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const steps = [
  { key: "QUEUE", label: "접수 대기열(분류)" },
  { key: "SCREEN", label: "초기 사정(스크리닝)" },
  { key: "CONSENT", label: "동의/연계 범위" },
  { key: "ASSIGN", label: "센터 배정/의뢰" },
  { key: "CONVERT", label: "케이스 전환" },
];

function fmt(ts?: string) {
  if (!ts) return "-";
  const d = new Date(ts);
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
}

type IntakeRow = {
  intakeId: string;
  intakeNo: string;
  source: string;
  regionCd: string | null;
  triage: string;
  consent: boolean;
  summary: string | null;
  preferredCenter: string | null;
  assignedCenter: string | null;
  convertedCaseId: string | null;
  createdAt: string;
};

function IntakeContent() {
  const router = useRouter();
  const sp = useSearchParams();
  const sourceFilter = sp.get("source");

  const [intakes, setIntakes] = useState<IntakeRow[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [activeStep, setActiveStep] = useState<string>("QUEUE");

  // 로컬 편집 상태 (선택된 접수 항목)
  const [summary, setSummary] = useState("");
  const [preferredCenter, setPreferredCenter] = useState("");
  const [assignedCenter, setAssignedCenter] = useState("");

  useEffect(() => {
    const url = sourceFilter ? `/api/intakes?source=${sourceFilter}` : "/api/intakes";
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        const items: IntakeRow[] = data.items ?? [];
        setIntakes(items);
        if (items.length > 0) setSelectedId(items[0].intakeId);
      });
  }, [sourceFilter]);

  const selected = useMemo(
    () => intakes.find((x) => x.intakeId === selectedId),
    [intakes, selectedId]
  );

  // 선택 변경 시 로컬 상태 동기화
  useEffect(() => {
    setSummary(selected?.summary ?? "");
    setPreferredCenter(selected?.preferredCenter ?? "");
    setAssignedCenter(selected?.assignedCenter ?? "");
  }, [selected?.intakeId]);

  const save = (fields: Record<string, unknown>) => {
    if (!selected) return;
    fetch(`/api/intakes/${selected.intakeId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    })
      .then((r) => r.json())
      .then((updated) => {
        setIntakes((prev) =>
          prev.map((x) => (x.intakeId === selected.intakeId ? { ...x, ...updated } : x))
        );
      });
  };

  const onConvert = () => {
    if (!selected || !selected.consent) return;
    fetch(`/api/intakes/${selected.intakeId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.caseId) router.push(`/cases/${res.caseId}`);
      });
  };

  return (
    <Shell title="접수/초기개입" subtitle="대기열 → 초기 사정 → 동의 → 배정/의뢰 → 케이스 전환">
      <div className="grid2">
        <div className="card">
          <div className="card-h">
            <span>접수 대기열</span>
            <span className="pill">{sourceFilter ? `source=${sourceFilter}` : "ALL"}</span>
          </div>
          <div className="card-b">
            <table className="table">
              <thead>
                <tr>
                  <th>접수ID</th>
                  <th>유입</th>
                  <th>지역</th>
                  <th>긴급도</th>
                  <th>동의</th>
                </tr>
              </thead>
              <tbody>
                {intakes.map((x) => (
                  <tr
                    key={x.intakeId}
                    onClick={() => setSelectedId(x.intakeId)}
                    style={{ cursor: "pointer", background: x.intakeId === selectedId ? "#f1f5f9" : "#fff" }}
                  >
                    <td style={{ fontWeight: 1000 }}>{x.intakeNo}</td>
                    <td>{x.source}</td>
                    <td>{x.regionCd ?? "-"}</td>
                    <td>{x.triage}</td>
                    <td>{x.consent ? "Y" : "N"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="muted" style={{ marginTop: 8 }}>
              ※ 접수 클릭 후 우측에서 사정/동의/배정/전환을 진행합니다.
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-h">
            <span>접수 처리</span>
            <span className="pill">{selected?.intakeNo ?? "-"}</span>
          </div>
          <div className="card-b">
            <div className="grid2">
              <div>
                <Stepper steps={steps} active={activeStep} />
                <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                  {steps.map((s) => (
                    <button key={s.key} className="btn" onClick={() => setActiveStep(s.key)}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="kpi">
                  <div className="label">접수시각</div>
                  <div className="value" style={{ fontSize: 14, fontWeight: 1000 }}>
                    {fmt(selected?.createdAt)}
                  </div>
                </div>

                <div className="hr" />

                <div style={{ display: "grid", gap: 10 }}>
                  <div>
                    <div style={{ fontWeight: 1000, marginBottom: 6 }}>요약</div>
                    <textarea
                      className="textarea"
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      onBlur={() => save({ summary })}
                    />
                  </div>

                  <div className="grid2">
                    <div>
                      <div style={{ fontWeight: 1000, marginBottom: 6 }}>긴급도</div>
                      <select
                        className="select"
                        value={selected?.triage ?? "LOW"}
                        onChange={(e) => save({ triage: e.target.value })}
                      >
                        <option value="LOW">LOW</option>
                        <option value="MID">MID</option>
                        <option value="HIGH">HIGH</option>
                        <option value="EMERG">EMERG</option>
                      </select>
                    </div>

                    <div>
                      <div style={{ fontWeight: 1000, marginBottom: 6 }}>동의</div>
                      <select
                        className="select"
                        value={selected?.consent ? "Y" : "N"}
                        onChange={(e) => save({ consent: e.target.value === "Y" })}
                      >
                        <option value="Y">Y</option>
                        <option value="N">N</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid2">
                    <div>
                      <div style={{ fontWeight: 1000, marginBottom: 6 }}>희망센터</div>
                      <input
                        className="input"
                        value={preferredCenter}
                        onChange={(e) => setPreferredCenter(e.target.value)}
                        onBlur={() => save({ preferredCenter })}
                        placeholder="예: 서울센터"
                      />
                    </div>
                    <div>
                      <div style={{ fontWeight: 1000, marginBottom: 6 }}>배정센터</div>
                      <input
                        className="input"
                        value={assignedCenter}
                        onChange={(e) => setAssignedCenter(e.target.value)}
                        onBlur={() => save({ assignedCenter })}
                        placeholder="예: 서울센터"
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                    <button
                      className="btn primary"
                      onClick={onConvert}
                      disabled={!selected || !selected.consent}
                    >
                      케이스 전환
                    </button>
                    <button className="btn" onClick={() => router.push("/cases")}>
                      사례 목록 보기
                    </button>
                    <div className="muted">※ 동의=Y 일 때 케이스 전환 가능(예시)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}

export default function IntakePage() {
  return (
    <Suspense fallback={null}>
      <IntakeContent />
    </Suspense>
  );
}
