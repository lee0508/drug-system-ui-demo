import Shell from "@/components/Shell";
import OverviewSystem from "@/components/OverviewSystem";

export default function Page() {
  return (
    <Shell title="개요(모듈 UI)" subtitle="개념도 기반 모듈 화면 — 항목 클릭 시 업무용 화면으로 이동">
      <OverviewSystem />
    </Shell>
  );
}
