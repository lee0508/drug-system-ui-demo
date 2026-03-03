import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/intakes/:id
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const intake = await prisma.intake.findFirst({
    where: { intakeId: BigInt(params.id), isDeleted: false },
    include: { stepLogs: { orderBy: { doneAt: "asc" } } },
  });

  if (!intake) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  return NextResponse.json(intake, {
    // BigInt → JSON 직렬화
    headers: { "Content-Type": "application/json" },
  });
}

// PUT /api/intakes/:id — 접수 정보 수정 및 스텝 진행
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const intakeId = BigInt(params.id);

  const intake = await prisma.intake.update({
    where: { intakeId },
    data: {
      triage: body.triage,
      consent: body.consent,
      summary: body.summary,
      preferredCenter: body.preferredCenter,
      assignedCenter: body.assignedCenter,
      intakeStep: body.intakeStep,
    },
  });

  // 스텝 변경 시 로그 기록
  if (body.intakeStep) {
    await prisma.intakeStepLog.create({
      data: { intakeId, step: body.intakeStep, doneBy: body.updatedBy },
    });
  }

  return NextResponse.json(intake);
}

// POST /api/intakes/:id/convert — 케이스 전환
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const intakeId = BigInt(params.id);

  const intake = await prisma.intake.findFirstOrThrow({
    where: { intakeId, isDeleted: false },
  });

  if (!intake.consent) {
    return NextResponse.json({ error: "동의서 미제출" }, { status: 400 });
  }
  if (intake.convertedCaseId) {
    return NextResponse.json({ error: "이미 케이스로 전환됨", caseId: String(intake.convertedCaseId) }, { status: 409 });
  }

  // 케이스 생성
  const newCase = await prisma.case.create({
    data: {
      subjectId: intake.subjectId ?? body.subjectId,
      centerId: intake.assignedCenter ?? body.centerId,
      subjectLabel: body.subjectLabel ?? intake.intakeNo,
      status: "NEW",
      triage: intake.triage,
      createdBy: body.createdBy,
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

  // 접수에 케이스 ID 연결 + 스텝 CONVERT
  await prisma.intake.update({
    where: { intakeId },
    data: { convertedCaseId: newCase.caseId, intakeStep: "CONVERT" },
  });

  await prisma.intakeStepLog.create({
    data: { intakeId, step: "CONVERT", doneBy: body.createdBy, note: `caseId=${newCase.caseId}` },
  });

  return NextResponse.json({ caseId: String(newCase.caseId) }, { status: 201 });
}
