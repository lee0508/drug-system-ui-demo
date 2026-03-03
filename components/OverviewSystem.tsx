"use client";

import { useRouter } from "next/navigation";

// ─── 공통 아이템 (클릭 가능) ───────────────────────────────────────────────
function Item({ label, desc, onClick }: { label: string; desc: string; onClick: () => void }) {
  return (
    <button
      className="btn ghost"
      onClick={onClick}
      style={{
        textAlign: "left",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 10,
        borderRadius: 12,
        padding: "12px 12px",
        background: "#f8fafc",
        border: "1px solid var(--line)",
        cursor: "pointer",
      }}
    >
      <span style={{ fontSize: 16, fontWeight: 1000 }}>{label}</span>
      <small style={{ color: "var(--muted)", fontWeight: 900, fontSize: 12, whiteSpace: "nowrap" }}>{desc}</small>
    </button>
  );
}

// ─── 정보 표시 전용 아이템 (클릭 불가) ────────────────────────────────────
function InfoItem({ label, desc }: { label: string; desc: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 10,
        borderRadius: 12,
        padding: "12px 12px",
        background: "#f1f5f9",
        border: "1px solid var(--line)",
      }}
    >
      <span style={{ fontSize: 15, fontWeight: 900, color: "var(--ink)" }}>{label}</span>
      <small style={{ color: "var(--muted)", fontWeight: 800, fontSize: 12, whiteSpace: "nowrap" }}>{desc}</small>
    </div>
  );
}

// ─── 3열 모듈 카드 ──────────────────────────────────────────────────────────
function Module({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card" style={{ overflow: "hidden" }}>
      <div style={{ background: "#1d6fbf", color: "#fff", fontWeight: 1000, padding: "10px 12px", fontSize: 14 }}>
        {title}
      </div>
      <div style={{ padding: 12, display: "grid", gap: 10 }}>
        {children}
      </div>
    </div>
  );
}

// ─── 전행 섹션 (fullRow) ────────────────────────────────────────────────────
function Section({
  title,
  badge,
  cols = 3,
  children,
}: {
  title: string;
  badge?: string;
  cols?: number;
  children: React.ReactNode;
}) {
  return (
    <div style={{ border: "1px solid var(--line)", borderRadius: 16, overflow: "hidden", background: "#fff", marginTop: 12 }}>
      <div style={{
        background: "#1d6fbf", color: "#fff", fontWeight: 1000, padding: "10px 12px", fontSize: 14,
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span>{title}</span>
        {badge && (
          <span style={{
            fontSize: 11, padding: "3px 8px", borderRadius: 999,
            border: "1px solid rgba(255,255,255,.35)", background: "rgba(255,255,255,.12)", color: "#fff", fontWeight: 900,
          }}>{badge}</span>
        )}
      </div>
      <div style={{ padding: 12, display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 12 }}>
        {children}
      </div>
    </div>
  );
}

// ─── 메인 컴포넌트 ──────────────────────────────────────────────────────────
export default function OverviewSystem() {
  const router = useRouter();

  return (
    <div className="card">
      <div className="card-h">
        <span>마약류중독자관리시스템</span>
        <span className="pill">6대 기능 · 표준프레임워크 · 인프라</span>
      </div>

      <div className="card-b">

        {/* ── 1. 3대 핵심 모듈 ─────────────────────────────── */}
        <div className="grid3">

          <Module title="재활교육/초기개입">
            <Item label="1342 전화상담"        desc="접수·초기상담"  onClick={() => router.push("/intake?source=1342")} />
            <Item label="기소유예/수강·이수명령" desc="사법 연계"    onClick={() => router.push("/education/legal")} />
            <Item label="단기교육"             desc="집중 개입"     onClick={() => router.push("/education/short")} />
            <Item label="찾아가는 재활프로그램" desc="현장 지원"    onClick={() => router.push("/education/outreach")} />
            <Item label="타기관 의뢰"          desc="전원·연계"    onClick={() => router.push("/integrations?type=referral")} />
          </Module>

          <Module title="사례관리">
            <Item label="상담"        desc="개별/집단"       onClick={() => router.push("/cases?filter=counseling")} />
            <Item label="사례지원"    desc="서비스 계획·연계" onClick={() => router.push("/cases?filter=support")} />
            <Item label="사례종결"    desc="종결 기준/이력"   onClick={() => router.push("/cases?filter=closing")} />
            <Item label="모니터링"    desc="사후관리"         onClick={() => router.push("/cases?filter=monitoring")} />
            <Item label="지역자원관리" desc="기관/프로그램"   onClick={() => router.push("/resources")} />
          </Module>

          <Module title="통계관리">
            <Item label="기초통계"   desc="운영 KPI"    onClick={() => router.push("/stats")} />
            <Item label="국가통계"   desc="정책 보고"   onClick={() => router.push("/stats?tab=national")} />
            <Item label="다차원통계" desc="분석·피벗"   onClick={() => router.push("/stats?tab=multi")} />
            <Item label="1342 통계"  desc="콜센터 지표"  onClick={() => router.push("/stats?tab=1342")} />
            <Item label="보고서관리" desc="생성/제출"   onClick={() => router.push("/stats?tab=reports")} />
          </Module>

        </div>

        {/* ── 2. 대상자 관리 (Master) ──────────────────────── */}
        <Section title="대상자 관리" badge="Master" cols={3}>
          <Item label="마약류 중독자"   desc="대상자 카드" onClick={() => router.push("/subjects")} />
          <Item label="가족 및 보호자"  desc="관계관리"   onClick={() => router.push("/subjects?tab=family")} />
          <Item label="회복지원가"     desc="지원인력"    onClick={() => router.push("/subjects?tab=supporter")} />
        </Section>

        {/* ── 3. 공통 (Ops) ────────────────────────────────── */}
        <Section title="공통" badge="Ops" cols={5}>
          <Item label="센터관리" desc="센터/권역"  onClick={() => router.push("/centers")} />
          <Item label="권한관리" desc="RBAC"       onClick={() => router.push("/admin/users")} />
          <Item label="업무지원" desc="서식/공지"  onClick={() => router.push("/support")} />
          <Item label="연계관리" desc="I/F 현황"   onClick={() => router.push("/integrations")} />
          <Item label="마감관리" desc="월/분기/연" onClick={() => router.push("/closing")} />
        </Section>

        {/* ── 4. 전자정부 표준프레임워크 ───────────────────── */}
        <div style={{
          marginTop: 12, borderRadius: 16,
          border: "1px dashed #9ca3af",
          background: "linear-gradient(135deg,#e8f5e9 0%, #f0fdf4 50%, #ecfeff 100%)",
          padding: "12px 14px", fontWeight: 1000, textAlign: "center", color: "#0f5132",
        }}>
          전자정부표준프레임워크
        </div>

        {/* ── 5. 인프라 ────────────────────────────────────── */}
        <Section title="인프라" cols={5}>
          <InfoItem label="하드웨어"      desc="서버/스토리지" />
          <InfoItem label="소프트웨어"    desc="WAS/DB" />
          <InfoItem label="네트워크"      desc="VPN/보안" />
          <Item     label="1342 상담전화"  desc="콜 인프라" onClick={() => router.push("/intake?source=1342")} />
          <InfoItem label="보안"          desc="암호화/감사" />
        </Section>

        <div className="muted" style={{ marginTop: 10 }}>
          ※ 파란색 항목 클릭 → 해당 업무화면으로 이동합니다. 회색 항목은 인프라 정보 표시 전용입니다.
        </div>

      </div>
    </div>
  );
}
