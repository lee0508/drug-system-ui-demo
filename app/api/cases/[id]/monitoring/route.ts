import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { ok, okList, err, parsePage } from "@/lib/api";

type Ctx = { params: { id: string } };

// GET /api/cases/:id/monitoring?page=1&pageSize=20
export async function GET(req: NextRequest, { params }: Ctx) {
  const caseId = BigInt(params.id);
  const sp = new URL(req.url).searchParams;
  const { page, pageSize, skip } = parsePage(sp);

  const caseExists = await prisma.case.count({ where: { caseId, isDeleted: false } });
  if (!caseExists) return err("NOT_FOUND", "case not found", 404);

  const [total, rows] = await Promise.all([
    prisma.caseMonitoring.count({ where: { caseId, isDeleted: false } }),
    prisma.caseMonitoring.findMany({
      where:   { caseId, isDeleted: false },
      orderBy: { monitorAt: "desc" },
      skip,
      take: pageSize,
    }),
  ]);

  return okList(rows, { page, pageSize, total });
}

// POST /api/cases/:id/monitoring
// Body: { monitoringDt, contactTypeCd, resultCd, memo, nextMonitor? }
export async function POST(req: NextRequest, { params }: Ctx) {
  const caseId = BigInt(params.id);
  const body = await req.json();

  if (!body.monitoringDt) return err("VALIDATION_ERROR", "monitoringDt 필수", 400);

  const caseExists = await prisma.case.count({ where: { caseId, isDeleted: false } });
  if (!caseExists) return err("NOT_FOUND", "case not found", 404);

  const monitoring = await prisma.caseMonitoring.create({
    data: {
      caseId,
      monitorAt:   new Date(body.monitoringDt),
      method:      body.contactTypeCd ?? body.method,
      condition:   body.resultCd ?? body.condition,
      note:        body.memo ?? body.note,
      nextMonitor: body.nextMonitor ? new Date(body.nextMonitor) : undefined,
      createdBy:   body.createdBy,
    },
  });

  // 모니터링 이벤트 기록
  await prisma.caseEvent.create({
    data: {
      caseId,
      eventType: "MONITORING",
      title: `사후모니터링: ${body.resultCd ?? "완료"}`,
      createdBy: body.createdBy,
    },
  });

  return ok(monitoring, 201);
}
