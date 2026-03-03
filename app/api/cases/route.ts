import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/cases — 케이스 목록
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const centerId = searchParams.get("centerId");
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "20");

  const where = {
    isDeleted: false,
    ...(status ? { status } : {}),
    ...(centerId ? { centerId } : {}),
  };

  const [total, items] = await Promise.all([
    prisma.case.count({ where }),
    prisma.case.findMany({
      where,
      include: {
        events: { orderBy: { eventAt: "desc" }, take: 1 },
        tasks: { where: { isDeleted: false, status: { not: "DONE" } } },
      },
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  return NextResponse.json({ total, page, limit, items });
}

// POST /api/cases — 케이스 생성 (수동)
export async function POST(req: NextRequest) {
  const body = await req.json();

  const newCase = await prisma.case.create({
    data: {
      subjectId: body.subjectId,
      centerId: body.centerId,
      subjectLabel: body.subjectLabel,
      status: "NEW",
      triage: body.triage ?? "LOW",
      createdBy: body.createdBy,
    },
  });

  return NextResponse.json(newCase, { status: 201 });
}
