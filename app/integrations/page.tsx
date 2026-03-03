"use client";

import Shell from "@/components/Shell";
import { useApp } from "@/components/AppProvider";
import { useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function fmt(ts?: string) {
  if (!ts) return "-";
  const d = new Date(ts);
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
}

function IntegrationsContent() {
  const { connectors, logs, retryLog } = useApp();
  const sp = useSearchParams();
  const focus = sp.get("focus");

  const filtered = useMemo(() => {
    if (focus === "legal") return connectors.filter((c) => c.group === "ADMIN");
    return connectors;
  }, [connectors, focus]);

  return (
    <Shell title="연계관리" subtitle="EA 연계모듈 / 행정정보 연계모듈 상태·로그·재처리(예시)">
      <div className="grid2">
        <div className="card">
          <div className="card-h">
            <span>연계 커넥터</span>
            <span className="pill">{focus ? `focus=${focus}` : "ALL"}</span>
          </div>
          <div className="card-b">
            <table className="table">
              <thead>
                <tr>
                  <th>구분</th>
                  <th>연계대상</th>
                  <th>상태</th>
                  <th>마지막 동기화</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 1000 }}>{c.group}</td>
                    <td>{c.name}</td>
                    <td><span className="badge">{c.status}</span></td>
                    <td>{fmt(c.lastSyncAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-h">
            <span>연계 로그</span>
            <span className="pill">{logs.length} logs</span>
          </div>
          <div className="card-b">
            <table className="table">
              <thead>
                <tr>
                  <th>시각</th>
                  <th>대상</th>
                  <th>방향</th>
                  <th>메시지</th>
                  <th>결과</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {logs.map((l) => (
                  <tr key={l.id}>
                    <td>{fmt(l.at)}</td>
                    <td>{connectors.find((c) => c.id === l.connectorId)?.name ?? l.connectorId}</td>
                    <td>{l.direction}</td>
                    <td className="muted">{l.message}</td>
                    <td><span className="badge">{l.result}</span></td>
                    <td>
                      <button className="btn" onClick={() => retryLog(l.id)} disabled={l.result === "SUCCESS"}>
                        재처리
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Shell>
  );
}

export default function IntegrationsPage() {
  return (
    <Suspense fallback={null}>
      <IntegrationsContent />
    </Suspense>
  );
}
