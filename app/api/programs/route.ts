import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/programs
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const programType = searchParams.get("programType");
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "20");

  const where: Record<string, unknown> = {};
  if (programType) where.programType = programType;

  const [total, items] = await Promise.all([
    prisma.naProgram.count({ where }),
    prisma.naProgram.findMany({
      where,
      include: { _count: { select: { sessions: true, enrolls: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  return NextResponse.json({ total, page, limit, items });
}

// POST /api/programs
export async function POST(req: NextRequest) {
  const body = await req.json();

  const program = await prisma.naProgram.create({
    data: {
      programName: body.programName,
      programType: body.programType,
      durationWeeks: body.durationWeeks ? parseInt(body.durationWeeks) : undefined,
      memo: body.memo,
    },
  });

  return NextResponse.json(program, { status: 201 });
}
