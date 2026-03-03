"use client";

import Shell from "@/components/Shell";
import { useState, useEffect, useRef } from "react";

// ─── 타입 ────────────────────────────────────────────────────────────
type FormTemplate = {
  formId: string;
  formNm: string;
  fileExt: string | null;
  version: string | null;
  updatedAt: string;
  isActive: boolean;
};

const TABS = [
  { key: "forms",   label: "서식 관리" },
  { key: "notices", label: "공지사항" },
  { key: "faq",     label: "FAQ" },
];

// mock 공지사항 / FAQ (별도 DB 연동 확장 가능)
const NOTICES = [
  { id: 1, title: "2026년 1분기 마감 일정 안내",               important: true,  date: "2026-02-28", author: "관리자" },
  { id: 2, title: "국가통계 보고서 제출 방법 변경 안내",        important: true,  date: "2026-02-20", author: "관리자" },
  { id: 3, title: "3월 정기 교육 일정 공지",                    important: false, date: "2026-02-10", author: "서울센터" },
  { id: 4, title: "시스템 정기점검 안내 (3/8 새벽 2~4시)",      important: false, date: "2026-03-01", author: "관리자" },
];

const FAQS = [
  { q: "대상자 등록 시 실명 입력이 필요한가요?",   a: "아니오. 가명(alias)만 입력합니다. 실명은 별도 보안 저장소에서 관리합니다." },
  { q: "케이스 종결 후 재접수가 가능한가요?",       a: "네. CLOSED 상태에서도 신규 접수(Intake)를 통해 새 케이스 생성이 가능합니다." },
  { q: "1342 연계 데이터는 어떻게 수신되나요?",     a: "연계관리 > 1342 커넥터를 통해 수신되며, 접수 대기열에 자동 등록됩니다." },
  { q: "서식 파일은 어떤 형식을 지원하나요?",       a: "HWP, HWPX, PDF, XLSX, DOCX, DOC 형식을 지원합니다. (최대 50MB)" },
];

// ─── EXT 뱃지 색상 ───────────────────────────────────────────────────
const EXT_COLOR: Record<string, string> = {
  HWP:  "#0ea5e9",
  HWPX: "#0ea5e9",
  PDF:  "#dc2626",
  XLSX: "#16a34a",
  DOCX: "#2563eb",
  DOC:  "#2563eb",
};

export default function SupportPage() {
  const [tab, setTab]           = useState("forms");
  const [openFaq, setOpenFaq]   = useState<number | null>(null);

  // ── 서식 목록 상태 ──────────────────────────────────────────────────
  const [forms, setForms]         = useState<FormTemplate[]>([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);

  // ── 업로드 모달 상태 ────────────────────────────────────────────────
  const [showUpload, setShowUpload]     = useState(false);
  const [uploadFile, setUploadFile]     = useState<File | null>(null);
  const [uploadName, setUploadName]     = useState("");
  const [uploadVer, setUploadVer]       = useState("1.0");
  const [uploading, setUploading]       = useState(false);
  const [uploadMsg, setUploadMsg]       = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── 다운로드 상태 ───────────────────────────────────────────────────
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // ─── 서식 목록 불러오기 ─────────────────────────────────────────────
  const fetchForms = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/forms");
      if (!res.ok) throw new Error("서버 오류");
      setForms(await res.json());
    } catch {
      setError("서식 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tab === "forms") fetchForms();
  }, [tab]);

  // ─── 파일 선택 핸들러 ───────────────────────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setUploadFile(f);
    if (f && !uploadName) setUploadName(f.name.replace(/\.[^.]+$/, ""));
    setUploadMsg(null);
  };

  // ─── 업로드 제출 ────────────────────────────────────────────────────
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) { setUploadMsg({ type: "err", text: "파일을 선택해 주세요." }); return; }
    if (!uploadName.trim()) { setUploadMsg({ type: "err", text: "서식명을 입력해 주세요." }); return; }

    setUploading(true);
    setUploadMsg(null);
    try {
      const fd = new FormData();
      fd.append("file", uploadFile);
      fd.append("formNm", uploadName.trim());
      fd.append("version", uploadVer.trim() || "1.0");

      const res = await fetch("/api/forms", { method: "POST", body: fd });
      const json = await res.json();

      if (!res.ok) {
        setUploadMsg({ type: "err", text: json.error ?? "업로드 실패" });
      } else {
        setUploadMsg({ type: "ok", text: "업로드가 완료되었습니다." });
        await fetchForms();   // 목록 갱신
        // 2초 후 모달 닫기
        setTimeout(() => {
          setShowUpload(false);
          resetUploadForm();
        }, 1500);
      }
    } catch {
      setUploadMsg({ type: "err", text: "네트워크 오류가 발생했습니다." });
    } finally {
      setUploading(false);
    }
  };

  const resetUploadForm = () => {
    setUploadFile(null);
    setUploadName("");
    setUploadVer("1.0");
    setUploadMsg(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ─── 다운로드 ────────────────────────────────────────────────────────
  const handleDownload = async (form: FormTemplate) => {
    setDownloadingId(form.formId);
    try {
      const res = await fetch(`/api/forms/${form.formId}/download`);
      if (!res.ok) { alert("파일을 다운로드할 수 없습니다."); return; }

      const blob = await res.blob();
      const ext  = (form.fileExt ?? "bin").toLowerCase();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = `${form.formNm}.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      alert("다운로드 중 오류가 발생했습니다.");
    } finally {
      setDownloadingId(null);
    }
  };

  // ─── 날짜 포맷 ───────────────────────────────────────────────────────
  const fmt = (ts: string) => new Date(ts).toLocaleDateString("ko-KR");

  // ─── JSX ─────────────────────────────────────────────────────────────
  return (
    <Shell title="업무지원" subtitle="서식 관리 · 공지사항 · FAQ">

      {/* 탭 */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            className="btn"
            onClick={() => setTab(t.key)}
            style={{
              background: tab === t.key ? "linear-gradient(180deg,var(--blue),var(--blue2))" : "#fff",
              color: tab === t.key ? "#fff" : "var(--ink)",
              borderColor: tab === t.key ? "transparent" : "var(--line)",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ─── 서식 관리 탭 ─────────────────────────────────────────── */}
      {tab === "forms" && (
        <div className="card">
          <div className="card-h">
            <span>서식 목록</span>
            <span className="pill">{forms.length}개</span>
          </div>
          <div className="card-b">
            {/* 업로드 버튼 */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
              <button
                className="btn primary"
                onClick={() => { setShowUpload(true); resetUploadForm(); }}
              >
                + 서식 업로드 (관리자)
              </button>
            </div>

            {/* 로딩 / 오류 */}
            {loading && <div className="muted" style={{ textAlign: "center", padding: 24 }}>불러오는 중...</div>}
            {error   && <div style={{ color: "#dc2626", padding: "8px 0" }}>{error}</div>}

            {/* 서식 테이블 */}
            {!loading && (
              <table className="table">
                <thead>
                  <tr>
                    <th>서식명</th>
                    <th>형식</th>
                    <th>버전</th>
                    <th>최종수정</th>
                    <th>다운로드</th>
                  </tr>
                </thead>
                <tbody>
                  {forms.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: "center", color: "var(--muted)", padding: 32 }}>
                        등록된 서식이 없습니다. 서식 업로드 버튼으로 추가해 주세요.
                      </td>
                    </tr>
                  ) : (
                    forms.map((f) => (
                      <tr key={f.formId}>
                        <td style={{ fontWeight: 600 }}>{f.formNm}</td>
                        <td>
                          <span
                            className="badge"
                            style={{ background: EXT_COLOR[f.fileExt ?? ""] ?? "var(--blue)" }}
                          >
                            {f.fileExt ?? "-"}
                          </span>
                        </td>
                        <td className="muted">{f.version ?? "-"}</td>
                        <td className="muted">{fmt(f.updatedAt)}</td>
                        <td>
                          <button
                            className="btn"
                            onClick={() => handleDownload(f)}
                            disabled={downloadingId === f.formId}
                            style={{ minWidth: 80 }}
                          >
                            {downloadingId === f.formId ? "⏳" : "⬇ 다운로드"}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            <div className="muted" style={{ marginTop: 8 }}>
              ※ 서식 파일은 관리자만 업로드할 수 있습니다. (HWP, PDF, XLSX, DOCX 지원)
            </div>
          </div>
        </div>
      )}

      {/* ─── 공지사항 탭 ─────────────────────────────────────────── */}
      {tab === "notices" && (
        <div className="card">
          <div className="card-h"><span>공지사항</span></div>
          <div className="card-b">
            <table className="table">
              <thead>
                <tr><th></th><th>제목</th><th>작성자</th><th>날짜</th></tr>
              </thead>
              <tbody>
                {NOTICES.map((n) => (
                  <tr key={n.id}>
                    <td>
                      {n.important && (
                        <span className="badge" style={{ background: "#dc2626" }}>중요</span>
                      )}
                    </td>
                    <td style={{ fontWeight: n.important ? 600 : 400 }}>{n.title}</td>
                    <td>{n.author}</td>
                    <td>{n.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: 12 }}>
              <button className="btn primary">+ 공지 작성</button>
            </div>
          </div>
        </div>
      )}

      {/* ─── FAQ 탭 ─────────────────────────────────────────────── */}
      {tab === "faq" && (
        <div className="card">
          <div className="card-h"><span>자주 묻는 질문</span></div>
          <div className="card-b" style={{ display: "grid", gap: 8 }}>
            {FAQS.map((f, i) => (
              <div
                key={i}
                style={{ border: "1px solid var(--line)", borderRadius: 12, overflow: "hidden" }}
              >
                <button
                  className="btn ghost"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: "100%", textAlign: "left", padding: "12px 14px", fontWeight: 600 }}
                >
                  Q. {f.q}
                </button>
                {openFaq === i && (
                  <div style={{ padding: "10px 14px", background: "#f8fafc", color: "var(--muted)" }}>
                    A. {f.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── 서식 업로드 모달 ──────────────────────────────────────── */}
      {showUpload && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 1000,
            background: "rgba(0,0,0,0.45)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
          onClick={(e) => { if (e.target === e.currentTarget) { setShowUpload(false); resetUploadForm(); } }}
        >
          <div
            style={{
              background: "#fff", borderRadius: 16, padding: 28, width: "100%", maxWidth: 480,
              boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
            }}
          >
            {/* 모달 헤더 */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>서식 업로드</h2>
              <button
                style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "var(--muted)" }}
                onClick={() => { setShowUpload(false); resetUploadForm(); }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleUpload} style={{ display: "grid", gap: 14 }}>

              {/* 파일 선택 */}
              <div>
                <label style={{ fontWeight: 600, fontSize: 13, display: "block", marginBottom: 6 }}>
                  파일 선택 <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".hwp,.hwpx,.pdf,.xlsx,.docx,.doc"
                  onChange={handleFileChange}
                  style={{
                    display: "block", width: "100%", padding: "8px 10px",
                    border: "1px solid var(--line)", borderRadius: 8,
                    fontSize: 13, cursor: "pointer",
                  }}
                />
                {uploadFile && (
                  <div className="muted" style={{ marginTop: 4, fontSize: 12 }}>
                    {uploadFile.name} ({(uploadFile.size / 1024).toFixed(1)} KB)
                  </div>
                )}
                <div className="muted" style={{ fontSize: 11, marginTop: 4 }}>
                  HWP, HWPX, PDF, XLSX, DOCX, DOC · 최대 50MB
                </div>
              </div>

              {/* 서식명 */}
              <div>
                <label style={{ fontWeight: 600, fontSize: 13, display: "block", marginBottom: 6 }}>
                  서식명 <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <input
                  className="input"
                  type="text"
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                  placeholder="예: 대상자 초기 사정지"
                  style={{ width: "100%", boxSizing: "border-box" }}
                />
              </div>

              {/* 버전 */}
              <div>
                <label style={{ fontWeight: 600, fontSize: 13, display: "block", marginBottom: 6 }}>버전</label>
                <input
                  className="input"
                  type="text"
                  value={uploadVer}
                  onChange={(e) => setUploadVer(e.target.value)}
                  placeholder="예: 1.0"
                  style={{ width: 100 }}
                />
              </div>

              {/* 결과 메시지 */}
              {uploadMsg && (
                <div
                  style={{
                    padding: "10px 14px", borderRadius: 8, fontSize: 13,
                    background: uploadMsg.type === "ok" ? "#dcfce7" : "#fee2e2",
                    color: uploadMsg.type === "ok" ? "#15803d" : "#dc2626",
                    border: `1px solid ${uploadMsg.type === "ok" ? "#86efac" : "#fca5a5"}`,
                  }}
                >
                  {uploadMsg.type === "ok" ? "✓ " : "✕ "}{uploadMsg.text}
                </div>
              )}

              {/* 버튼 */}
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 4 }}>
                <button
                  type="button"
                  className="btn"
                  onClick={() => { setShowUpload(false); resetUploadForm(); }}
                  disabled={uploading}
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="btn primary"
                  disabled={uploading}
                  style={{ minWidth: 90 }}
                >
                  {uploading ? "업로드 중..." : "업로드"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </Shell>
  );
}
