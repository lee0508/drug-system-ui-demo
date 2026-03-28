import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { ok, err } from "@/lib/api";

type Ctx = { params: { id: string } };

// GET /api/cases/:id — 케이스 상세
export async function GET(_req: NextRequest, { params }: Ctx) {
  const caseId = BigInt(params.id);

  const item = await prisma.case.findFirst({
    where: { caseId, isDeleted: false },
    include: {
      events:     { orderBy: { eventAt: "asc" } },
      tasks:      { where: { isDeleted: false }, orderBy: { createdAt: "asc" } },
      counselings:{ where: { isDeleted: false }, orderBy: { counselAt: "desc" } },
      monitorings:{ where: { isDeleted: false }, orderBy: { monitorAt: "desc" } },
      closing:    true,
      isps: {
        where:   { isCurrent: true, isDeleted: false },
        include: { problems: true, goals: true, interventions: true },
        take: 1,
      },
    },
  });

  if (!item) return err("NOT_FOUND", "case not found", 404);

  // 대상자 기본정보 분리 조회 (PII 제외)
  const subject = item.subjectId
    ? await prisma.subject.findUnique({
        where: { subjectId: item.subjectId },
        select: { subjectId: true, alias: true, regionCd: true, status: true, caseNo: true },
      })
    : null;

  return ok({ case: item, subject });
}

// PATCH /api/cases/:id — 상태/담당자/긴급도 변경
export async function PATCH(req: NextRequest, { params }: Ctx) {
  const caseId = BigInt(params.id);
  const body = await req.json();

  const updated = await prisma.case.update({
    where: { caseId },
    data: {
      ...(body.statusCd        !== undefined ? { status:    body.statusCd }        : {}),
      ...(body.status          !== undefined ? { status:    body.status }          : {}),
      ...(body.triageCd        !== undefined ? { triage:    body.triageCd }        : {}),
      ...(body.triage          !== undefined ? { triage:    body.triage }          : {}),
      ...(body.centerId        !== undefined ? { centerId:  body.centerId }        : {}),
      ...(body.assignedUserId  !== undefined ? { createdBy: body.assignedUserId }  : {}),
    },
  });

  // 상태 변경 이벤트 자동 기록
  const newStatus = body.statusCd ?? body.status;
  if (newStatus) {
    await prisma.caseEvent.create({
      data: {
        caseId,
        eventType: "MONITORING",
        title: `상태 변경: ${newStatus}`,
        note: body.note,
        createdBy: body.updatedBy,
      },
    });
  }

  return ok(updated);
}

// PUT (하위 호환) → PATCH 위임
export const PUT = PATCH;
