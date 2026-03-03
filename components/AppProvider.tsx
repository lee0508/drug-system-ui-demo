"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import { Case, Intake, IntegrationConnector, IntegrationLog, ISPPlan } from "@/lib/types";
import { mockCases, mockConnectors, mockIntakes, mockLogs } from "@/lib/mockData";

type AppState = {
  intakes: Intake[];
  cases: Case[];
  connectors: IntegrationConnector[];
  logs: IntegrationLog[];

  updateIntake: (id: string, patch: Partial<Intake>) => void;
  convertIntakeToCase: (intakeId: string) => string;
  updateCase: (id: string, patch: Partial<Case>) => void;
  addCaseEvent: (caseId: string, event: Case["events"][number]) => void;
  saveISP: (caseId: string, isp: ISPPlan) => void;

  retryLog: (logId: string) => void;
};

const Ctx = createContext<AppState | null>(null);

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp must be used inside <AppProvider/>");
  return v;
}

export default function AppProvider({ children }: { children: React.ReactNode }) {
  const [intakes, setIntakes] = useState<Intake[]>(mockIntakes);
  const [cases, setCases] = useState<Case[]>(mockCases);
  const [connectors] = useState<IntegrationConnector[]>(mockConnectors);
  const [logs, setLogs] = useState<IntegrationLog[]>(mockLogs);

  const updateIntake = (id: string, patch: Partial<Intake>) => {
    setIntakes((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  };

  const updateCase = (id: string, patch: Partial<Case>) => {
    setCases((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, ...patch, lastUpdatedAt: new Date().toISOString() }
          : c
      )
    );
  };

  const addCaseEvent = (caseId: string, event: Case["events"][number]) => {
    setCases((prev) =>
      prev.map((c) =>
        c.id === caseId
          ? { ...c, events: [event, ...c.events], lastUpdatedAt: new Date().toISOString() }
          : c
      )
    );
  };

  const convertIntakeToCase = (intakeId: string) => {
    const intake = intakes.find((i) => i.id === intakeId);
    if (!intake) return "";

    const newId = `CA-${Math.floor(3000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const newCase: Case = {
      id: newId,
      subjectLabel: `CASE-${String(Math.floor(100000 + Math.random() * 900000))}`,
      region: intake.region,
      status: "NEW",
      triage: intake.triage,
      createdAt: now,
      lastUpdatedAt: now,
      intakeId: intake.id,
      events: [
        { at: now, type: "INTAKE", title: `접수(${intake.source})`, note: intake.summary },
      ],
      tasks: [
        { id: `T-${Math.random().toString(16).slice(2)}`, title: "초기 사정(스크리닝) 수행", status: "TODO" },
        { id: `T-${Math.random().toString(16).slice(2)}`, title: "대상자 동의/연계 범위 확인", status: "TODO" },
      ],
    };

    setCases((prev) => [newCase, ...prev]);
    updateIntake(intakeId, { convertedCaseId: newId });

    return newId;
  };

  const saveISP = (caseId: string, isp: ISPPlan) => {
    setCases((prev) =>
      prev.map((c) =>
        c.id === caseId
          ? { ...c, isp, lastUpdatedAt: new Date().toISOString() }
          : c
      )
    );
    addCaseEvent(caseId, {
      at: new Date().toISOString(),
      type: "ISP",
      title: `ISP v${isp.version} 저장`,
      note: `점검주기: ${isp.reviewCycle}`,
    });
  };

  const retryLog = (logId: string) => {
    setLogs((prev) =>
      prev.map((l) => (l.id === logId ? { ...l, result: "SUCCESS" } : l))
    );
  };

  const value = useMemo<AppState>(
    () => ({
      intakes,
      cases,
      connectors,
      logs,
      updateIntake,
      convertIntakeToCase,
      updateCase,
      addCaseEvent,
      saveISP,
      retryLog,
    }),
    [intakes, cases, connectors, logs]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
