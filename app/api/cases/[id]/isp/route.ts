import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/cases/:id/isp — 현재 ISP 조회
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const caseId = BigInt(params.id);

  const isp = await prisma.isp.findFirst({
    where: { caseId, isCurrent: true, isDeleted: false },
    include: { problems: true, goals: true, interventions: true },
  });

  if (!isp) return NextResponse.json(null);
  return NextResponse.json(isp);
}

// POST /api/cases/:id/isp — ISP 신규 버전 생성
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const caseId = BigInt(params.id);
  const body = await req.json();

  // 이전 버전 비활성화
  await prisma.isp.updateMany({
    where: { caseId, isCurrent: true },
    data: { isCurrent: false },
  });

  // 최신 버전 번호 조회
  const latest = await prisma.isp.findFirst({
    where: { caseId },
    orderBy: { version: "desc" },
    select: { version: true },
  });
  const nextVersion = (latest?.version ?? 0) + 1;

  const isp = await prisma.isp.create({
    data: {
      caseId,
      version: nextVersion,
      isCurrent: true,
      reviewCycle: body.reviewCycle ?? "MONTHLY",
      crisisPlan: body.crisisPlan,
      createdBy: body.createdBy,
      problems: { create: (body.problems ?? []).map((p: string, i: number) => ({ problem: p, sortOrder: i })) },
      goals: {
        create: (body.goals ?? []).map((g: { horizon: string; goal: string; metric?: string; due?: string }) => ({
          horizon: g.horizon,
          goal: g.goal,
          metric: g.metric,
          due: g.due ? new Date(g.due) : undefined,
        })),
      },
      interventions: {
        create: (body.interventions ?? []).map(
          (iv: { category: string; action: string; owner?: string; schedule?: string }) => ({
            category: iv.category,
            action: iv.action,
            owner: iv.owner,
            schedule: iv.schedule,
          })
        ),
      },
    },
    include: { problems: true, goals: true, interventions: true },
  });

  // ISP 이벤트 기록
  await prisma.caseEvent.create({
    data: {
      caseId,
      eventType: "ISP",
      title: `ISP v${nextVersion} 수립`,
      createdBy: body.createdBy,
    },
  });

  return NextResponse.json(isp, { status: 201 });
}
