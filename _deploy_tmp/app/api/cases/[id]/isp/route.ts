import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { ok, err } from "@/lib/api";

type Ctx = { params: { id: string } };

// GET /api/cases/:id/isp?version=3
export async function GET(req: NextRequest, { params }: Ctx) {
  const caseId = BigInt(params.id);
  const version = new URL(req.url).searchParams.get("version");

  const where = version
    ? { caseId, version: parseInt(version, 10), isDeleted: false }
    : { caseId, isCurrent: true, isDeleted: false };

  const isp = await prisma.isp.findFirst({
    where,
    include: { problems: true, goals: true, interventions: true },
  });

  if (!isp) return ok(null);  // ISP 없음은 404가 아닌 null 반환

  return ok({
    isp: {
      ispId:      isp.ispId,
      caseId:     isp.caseId,
      version:    isp.version,
      isCurrent:  isp.isCurrent,
      reviewCycle:isp.reviewCycle,
      crisisPlan: isp.crisisPlan,
      ispDt:      isp.createdAt,
    },
    problems:      isp.problems,
    goals:         isp.goals,
    interventions: isp.interventions,
  });
}

// POST /api/cases/:id/isp — 신규 버전 생성
export async function POST(req: NextRequest, { params }: Ctx) {
  const caseId = BigInt(params.id);
  const body = await req.json();

  // 이전 버전 비활성화
  await prisma.isp.updateMany({
    where: { caseId, isCurrent: true },
    data:  { isCurrent: false },
  });

  // 다음 버전 번호
  const latest = await prisma.isp.findFirst({
    where:   { caseId },
    orderBy: { version: "desc" },
    select:  { version: true },
  });
  const nextVersion = (latest?.version ?? 0) + 1;

  const isp = await prisma.isp.create({
    data: {
      caseId,
      version:     nextVersion,
      isCurrent:   true,
      reviewCycle: body.reviewCycle ?? "MONTHLY",
      crisisPlan:  body.crisisPlan,
      createdBy:   body.createdBy,
      problems: {
        create: (body.problems ?? []).map((p: { description?: string; problemCd?: string } | string, i: number) => ({
          problem:   typeof p === "string" ? p : (p.description ?? ""),
          sortOrder: i,
        })),
      },
      goals: {
        create: (body.goals ?? []).map((g: {
          goalTitle?: string; goal?: string;
          horizon?: string; targetDt?: string; due?: string; metric?: string; indicator?: string;
        }) => ({
          horizon: g.horizon ?? "SHORT",
          goal:    g.goalTitle ?? g.goal ?? "",
          metric:  g.indicator ?? g.metric,
          due:     g.targetDt ? new Date(g.targetDt) : (g.due ? new Date(g.due) : undefined),
        })),
      },
      interventions: {
        create: (body.interventions ?? []).map((iv: {
          category?: string; interventionCd?: string;
          action?: string; plan?: string;
          owner?: string; assignee?: string; schedule?: string;
        }) => ({
          category: iv.interventionCd ?? iv.category ?? "COUNSELING",
          action:   iv.plan ?? iv.action ?? "",
          owner:    iv.assignee ?? iv.owner,
          schedule: iv.schedule,
        })),
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

  return ok(isp, 201);
}
