import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/intakes — 접수 목록 조회
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const source = searchParams.get("source");
  const step = searchParams.get("step");

  const intakes = await prisma.intake.findMany({
    where: {
      isDeleted: false,
      ...(source ? { source } : {}),
      ...(step ? { intakeStep: step } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(intakes);
}

// POST /api/intakes — 접수 등록
export async function POST(req: NextRequest) {
  const body = await req.json();

  const count = await prisma.intake.count();
  const intakeNo = `INT-${String(count + 1).padStart(6, "0")}`;

  const intake = await prisma.intake.create({
    data: {
      intakeNo,
      source: body.source,
      regionCd: body.regionCd,
      triage: body.triage ?? "LOW",
      consent: body.consent ?? false,
      summary: body.summary,
      preferredCenter: body.preferredCenter,
      intakeStep: "QUEUE",
      createdBy: body.createdBy,
    },
  });

  // 접수 대기 스텝 로그 기록
  await prisma.intakeStepLog.create({
    data: {
      intakeId: intake.intakeId,
      step: "QUEUE",
      doneBy: body.createdBy,
    },
  });

  return NextResponse.json(intake, { status: 201 });
}
