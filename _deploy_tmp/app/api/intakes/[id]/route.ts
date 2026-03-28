import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { ok, err } from "@/lib/api";

type Ctx = { params: { id: string } };

// GET /api/intakes/:id — 상세 + step log
export async function GET(_req: NextRequest, { params }: Ctx) {
  const intakeId = BigInt(params.id);
  const intake = await prisma.intake.findFirst({
    where: { intakeId, isDeleted: false },
    include: { stepLogs: { orderBy: { doneAt: "asc" } } },
  });
  if (!intake) return err("NOT_FOUND", "intake not found", 404);
  return ok({ intake, steps: intake.stepLogs });
}

// PATCH /api/intakes/:id — 단계 진행 / 정보 수정
export async function PATCH(req: NextRequest, { params }: Ctx) {
  const intakeId = BigInt(params.id);
  const body = await req.json();

  const intake = await prisma.intake.update({
    where: { intakeId },
    data: {
      ...(body.statusCd    !== undefined ? { intakeStep:      body.statusCd }    : {}),
      ...(body.triage      !== undefined ? { triage:          body.triage }      : {}),
      ...(body.triageCd    !== undefined ? { triage:          body.triageCd }    : {}),
      ...(body.consent     !== undefined ? { consent:         body.consent }     : {}),
      ...(body.summary     !== undefined ? { summary:         body.summary }     : {}),
      ...(body.preferredCenter !== undefined ? { preferredCenter: body.preferredCenter } : {}),
      ...(body.assignedCenter  !== undefined ? { assignedCenter:  body.assignedCenter }  : {}),
    },
  });

  // 스텝 변경 시 로그 기록
  const newStep = body.statusCd ?? body.intakeStep;
  if (newStep) {
    await prisma.intakeStepLog.create({
      data: {
        intakeId,
        step: newStep,
        note: body.memo,
        doneBy: body.updatedBy,
      },
    });
  }

  return ok(intake);
}

// PUT (하위 호환) → PATCH 위임
export const PUT = PATCH;

// POST /api/intakes/:id — 케이스 전환 (접수 → 케이스)
export async function POST(req: NextRequest, { params }: Ctx) {
  const intakeId = BigInt(params.id);
  const body = await req.json();

  const intake = await prisma.intake.findFirst({
    where: { intakeId, isDeleted: false },
  });
  if (!intake) return err("NOT_FOUND", "intake not found", 404);
  if (!intake.consent) return err("VALIDATION_ERROR", "동의서 미제출", 400);
  if (intake.convertedCaseId) {
    return err("CONFLICT", `이미 케이스로 전환됨 (caseId=${intake.convertedCaseId})`, 409);
  }

  const newCase = await prisma.case.create({
    data: {
      subjectId:    intake.subjectId ?? body.subjectId,
      centerId:     intake.assignedCenter ?? body.centerId,
      subjectLabel: body.subjectLabel ?? intake.intakeNo,
      status:       "NEW",
      triage:       intake.triage,
      createdBy:    body.createdBy,
      events: {
        create: {
          eventType: "INTAKE",
          title: "접수 → 케이스 전환",
          note: `접수번호: ${intake.intakeNo}`,
          createdBy: body.createdBy,
        },
      },
    },
  });

  await prisma.intake.update({
    where: { intakeId },
    data: { convertedCaseId: newCase.caseId, intakeStep: "CONVERT" },
  });

  await prisma.intakeStepLog.create({
    data: { intakeId, step: "CONVERT", doneBy: body.createdBy, note: `caseId=${newCase.caseId}` },
  });

  return ok({ caseId: String(newCase.caseId) }, 201);
}
