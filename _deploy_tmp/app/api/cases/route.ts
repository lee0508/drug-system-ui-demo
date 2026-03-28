import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { ok, okList, err, parsePage } from "@/lib/api";

// GET /api/cases?status=NEW&centerId=CT-01&assignedUserId=hksun&subjectId=SB-000001&page=1&pageSize=20
export async function GET(req: NextRequest) {
  const sp = new URL(req.url).searchParams;
  const { page, pageSize, skip } = parsePage(sp);

  const where: Record<string, unknown> = { isDeleted: false };
  if (sp.get("status"))         where.status         = sp.get("status");
  if (sp.get("centerId"))       where.centerId        = sp.get("centerId");
  if (sp.get("assignedUserId")) where.createdBy       = sp.get("assignedUserId");
  if (sp.get("subjectId"))      where.subjectId       = sp.get("subjectId");

  const [total, rows] = await Promise.all([
    prisma.case.count({ where }),
    prisma.case.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip,
      take: pageSize,
      include: {
        events: { orderBy: { eventAt: "desc" }, take: 1 },
        tasks:  { where: { isDeleted: false, status: { not: "DONE" } } },
      },
    }),
  ]);

  return okList(rows, { page, pageSize, total });
}

// POST /api/cases — 케이스 생성
export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.centerId) return err("VALIDATION_ERROR", "centerId 필수", 400);

  const newCase = await prisma.case.create({
    data: {
      subjectId:    body.subjectId,
      centerId:     body.centerId,
      subjectLabel: body.subjectLabel,
      status:       "NEW",
      triage:       body.triageCd ?? body.triage ?? "LOW",
      createdBy:    body.assignedUserId ?? body.createdBy,
      events: {
        create: {
          eventType: "INTAKE",
          title: "사례 개시",
          note: body.intakeId ? `intakeId=${body.intakeId}` : undefined,
          createdBy: body.assignedUserId ?? body.createdBy,
        },
      },
    },
  });

  // 접수와 연결된 경우 접수 상태 업데이트
  if (body.intakeId) {
    await prisma.intake.update({
      where: { intakeId: BigInt(body.intakeId) },
      data: { convertedCaseId: newCase.caseId, intakeStep: "CONVERT" },
    }).catch(() => undefined); // 접수가 없으면 무시
  }

  return ok(newCase, 201);
}
