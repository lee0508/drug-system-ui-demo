import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { ok, err } from "@/lib/api";

type Ctx = { params: { id: string } };

// POST /api/cases/:id/close — 사례 종결
// Body: { closingDt, closingReasonCd, summary }
export async function POST(req: NextRequest, { params }: Ctx) {
  const caseId = BigInt(params.id);
  const body = await req.json();

  if (!body.closingDt || !body.closingReasonCd) {
    return err("VALIDATION_ERROR", "closingDt, closingReasonCd 필수", 400);
  }

  const existing = await prisma.case.findFirst({
    where: { caseId, isDeleted: false },
    include: { closing: true },
  });
  if (!existing) return err("NOT_FOUND", "case not found", 404);
  if (existing.status === "CLOSED") return err("CONFLICT", "이미 종결된 사례입니다", 409);

  // 트랜잭션: 종결 기록 + 상태 변경 + 이벤트
  const [closing] = await prisma.$transaction([
    prisma.caseClosing.upsert({
      where: { caseId },
      create: {
        caseId,
        closingType: body.closingReasonCd,
        closingDate: new Date(body.closingDt),
        reason:      body.closingReasonCd,
        outcome:     body.summary,
        createdBy:   body.createdBy,
      },
      update: {
        closingType: body.closingReasonCd,
        closingDate: new Date(body.closingDt),
        reason:      body.closingReasonCd,
        outcome:     body.summary,
      },
    }),
    prisma.case.update({
      where: { caseId },
      data: { status: "CLOSED" },
    }),
    prisma.caseEvent.create({
      data: {
        caseId,
        eventType: "MONITORING",  // 종결도 MONITORING 타입 (스키마상 CLOSE 없음)
        title: `사례 종결: ${body.closingReasonCd}`,
        note: body.summary,
        createdBy: body.createdBy,
      },
    }),
  ]);

  return ok(closing, 201);
}
