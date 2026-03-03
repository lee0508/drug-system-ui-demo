import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/cases/:id — 케이스 상세 (이벤트, 태스크, ISP 포함)
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const caseId = BigInt(params.id);

  const item = await prisma.case.findFirst({
    where: { caseId, isDeleted: false },
    include: {
      events: { orderBy: { eventAt: "asc" } },
      tasks: { where: { isDeleted: false }, orderBy: { createdAt: "asc" } },
      counselings: { where: { isDeleted: false }, orderBy: { counselAt: "desc" } },
      monitorings: { where: { isDeleted: false }, orderBy: { monitorAt: "desc" } },
      closing: true,
      isps: {
        where: { isCurrent: true, isDeleted: false },
        include: { problems: true, goals: true, interventions: true },
        take: 1,
      },
    },
  });

  if (!item) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  return NextResponse.json(item);
}

// PUT /api/cases/:id — 케이스 상태/정보 수정
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const caseId = BigInt(params.id);
  const body = await req.json();

  const updated = await prisma.case.update({
    where: { caseId },
    data: {
      status: body.status,
      triage: body.triage,
      centerId: body.centerId,
    },
  });

  // 상태 변경 이벤트 자동 기록
  if (body.status) {
    await prisma.caseEvent.create({
      data: {
        caseId,
        eventType: "MONITORING",
        title: `상태 변경: ${body.status}`,
        note: body.note,
        createdBy: body.updatedBy,
      },
    });
  }

  return NextResponse.json(updated);
}
