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

  // 마약 유형별 대상자 수
  const drugTypeRaw = await prisma.subjectDrug.groupBy({
    by: ["drugCd"],
    _count: { drugCd: true },
    orderBy: { _count: { drugCd: "desc" } },
  });

  // 검사 결과별 건수
  const testResultRaw = await prisma.naMemberTest.groupBy({
    by: ["resultCode"],
    _count: { resultCode: true },
  });

  // 검사 유형별 건수
  const testTypeRaw = await prisma.naMemberTest.groupBy({
    by: ["testTypeCode"],
    _count: { testTypeCode: true },
    orderBy: { _count: { testTypeCode: "desc" } },
  });

  // 의뢰/연계 상태별 건수
  const referralStatusRaw = await prisma.naMemberReferral.groupBy({
    by: ["statusCode"],
    _count: { statusCode: true },
  });

  // 프로그램 참가자 수 (상위 5개)
  const programEnrollRaw = await prisma.naMemberProgramEnroll.groupBy({
    by: ["programId"],
    _count: { programId: true },
    orderBy: { _count: { programId: "desc" } },
    take: 5,
  });
  const programIds = programEnrollRaw.map(p => p.programId);
  const programNames = programIds.length > 0
    ? await prisma.naProgram.findMany({
        where: { programId: { in: programIds } },
        select: { programId: true, programName: true },
      })
    : [];
  const programNameMap = Object.fromEntries(programNames.map(p => [p.programId, p.programName]));

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
    drugTypes: drugTypeRaw.map(r => ({ drugCd: r.drugCd, count: r._count.drugCd })),
    testResults: testResultRaw.map(r => ({ resultCode: r.resultCode, count: r._count.resultCode })),
    testTypes: testTypeRaw.map(r => ({ testTypeCode: r.testTypeCode, count: r._count.testTypeCode })),
    referralStatus: referralStatusRaw.map(r => ({ statusCode: r.statusCode, count: r._count.statusCode })),
    programEnrolls: programEnrollRaw.map(r => ({
      programId: r.programId,
      programName: programNameMap[r.programId] ?? r.programId,
      count: r._count.programId,
    })),
  });
}
