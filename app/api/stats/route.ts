import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/stats — 핵심 KPI + 월별 통계
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const centerId = searchParams.get("centerId") ?? undefined;

  // 실시간 KPI (COUNT 집계)
  const [
    intakeTotal,
    intake1342,
    caseTotal,
    caseNew,
    caseInProgress,
    caseMonitoring,
    caseClosed,
    subjectActive,
  ] = await Promise.all([
    prisma.intake.count({ where: { isDeleted: false } }),
    prisma.intake.count({ where: { isDeleted: false, source: "1342" } }),
    prisma.case.count({ where: { isDeleted: false, ...(centerId ? { centerId } : {}) } }),
    prisma.case.count({ where: { isDeleted: false, status: "NEW", ...(centerId ? { centerId } : {}) } }),
    prisma.case.count({ where: { isDeleted: false, status: "IN_PROGRESS", ...(centerId ? { centerId } : {}) } }),
    prisma.case.count({ where: { isDeleted: false, status: "MONITORING", ...(centerId ? { centerId } : {}) } }),
    prisma.case.count({ where: { isDeleted: false, status: "CLOSED", ...(centerId ? { centerId } : {}) } }),
    prisma.subject.count({ where: { isDeleted: false, status: "ACTIVE" } }),
  ]);

  // 최근 6개월 월별 통계 (배치 생성된 스냅샷)
  const monthly = await prisma.statsMonthly.findMany({
    where: { ...(centerId ? { centerId } : {}) },
    orderBy: { yyyymm: "desc" },
    take: 6,
  });

  // 보고서 현황
  const reports = await prisma.report.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return NextResponse.json({
    kpi: {
      intakeTotal,
      intake1342,
      caseTotal,
      caseNew,
      caseInProgress,
      caseMonitoring,
      caseClosed,
      subjectActive,
    },
    monthly,
    reports,
  });
}
