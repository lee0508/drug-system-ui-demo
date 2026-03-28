"use client";

import Shell from "@/components/Shell";
import { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";

type IntegrationLog = {
  logId: string;
  connectorId: string;
  direction: string;
  message: string;
  result: string;
  loggedAt: string;
  retryCount: number;
};

type Connector = {
  connectorId: string;
  connectorNm: string;
  groupCd: string;
  status: string;
  lastSyncAt?: string;
  logs: IntegrationLog[];
};

function fmt(ts?: string) {
  if (!ts) return "-";
  const d = new Date(ts);
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
}

function IntegrationsContent() {
  const sp = useSearchParams();
  const focus = sp.get("focus");

  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState<string | null>(null);

  const loadConnectors = () => {
    setLoading(true);
    fetch("/api/connectors")
      .then((r) => r.json())
      .then((data) => setConnectors(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadConnectors(); }, []);

  const filtered = useMemo(() => {
    if (focus === "legal") return connectors.filter((c) => c.groupCd === "ADMIN");
    return connectors;
  }, [connectors, focus]);

  // 전체 로그 = 모든 커넥터의 logs 합산 (최신순)
  const allLogs = useMemo(() => {
    return connectors
      .flatMap((c) => c.logs.map((l) => ({ ...l, connectorNm: c.connectorNm })))
      .sort((a, b) => new Date(b.loggedAt).getTime() - new Date(a.loggedAt).getTime());
  }, [connectors]);

  const retry = async (log: IntegrationLog & { connectorNm: string }) => {
    setRetrying(log.logId);
    try {
      await fetch(`/api/connectors/${log.connectorId}/logs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logId: log.logId }),
      });
      loadConnectors();
    } finally {
      setRetrying(null);
    }
  };

  return (
    <Shell title="연계관리" subtitle="EA 연계모듈 / 행정정보 연계모듈 상태·로그·재처리">
      <div className="grid2">
        <div className="card">
          <div className="card-h">
            <span>연계 커넥터</span>
            <span className="pill">{focus ? `focus=${focus}` : "ALL"}</span>
          </div>
          <div className="card-b">
            {loading ? (
              <div className="muted" style={{ textAlign: "center", padding: 24 }}>불러오는 중...</div>
            ) : (
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
                    <tr key={c.connectorId}>
                      <td style={{ fontWeight: 1000 }}>{c.groupCd}</td>
                      <td>{c.connectorNm}</td>
                      <td>
                        <span
                          className="badge"
                          style={{
                            background:
                              c.status === "OK" ? "#16a34a" :
                              c.status === "DEGRADED" ? "#d97706" : "#dc2626",
                          }}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td>{fmt(c.lastSyncAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-h">
            <span>연계 로그</span>
            <span className="pill">{allLogs.length} logs</span>
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
                {allLogs.length === 0 ? (
                  <tr><td colSpan={6} className="muted" style={{ textAlign: "center" }}>로그 없음</td></tr>
                ) : (
                  allLogs.map((l) => (
                    <tr key={l.logId}>
                      <td>{fmt(l.loggedAt)}</td>
                      <td>{l.connectorNm}</td>
                      <td>{l.direction}</td>
                      <td className="muted">{l.message}</td>
                      <td>
                        <span
                          className="badge"
                          style={{ background: l.result === "SUCCESS" ? "#16a34a" : l.result === "FAIL" ? "#dc2626" : undefined }}
                        >
                          {l.result}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn"
                          onClick={() => retry(l)}
                          disabled={l.result === "SUCCESS" || retrying === l.logId}
                        >
                          {retrying === l.logId ? "처리중..." : "재처리"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
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
