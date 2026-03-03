import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { serialize } from "@/lib/bigint";

// GET /api/closing?type=MONTHLY — 체크리스트 템플릿 + 마감 이력
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const closingType = searchParams.get("type")?.toUpperCase() ?? "MONTHLY";

  const [templates, history] = await Promise.all([
    prisma.closingChecklistTpl.findMany({
      where: { closingType, isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.closingHistory.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  return NextResponse.json(serialize({ templates, history }));
}

// POST /api/closing — 마감 처리
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { closingType, periodLabel, centerId, closedBy } = body;

  if (!closingType || !periodLabel) {
    return NextResponse.json({ error: "closingType, periodLabel 필수" }, { status: 400 });
  }

  const record = await prisma.closingHistory.create({
    data: {
      closingType,
      periodLabel,
      centerId,
      status: "CLOSED",
      closedAt: new Date(),
      closedBy,
    },
  });

  return NextResponse.json(serialize(record), { status: 201 });
}
