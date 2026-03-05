import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const program = await prisma.naProgram.findUnique({
    where: { programId: params.id },
    include: {
      sessions: { orderBy: { sessionDate: "asc" } },
      enrolls: { include: { subject: { select: { alias: true, caseNo: true } } } },
    },
  });
  if (!program) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(program);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const program = await prisma.naProgram.update({
    where: { programId: params.id },
    data: {
      programName: body.programName,
      programType: body.programType,
      durationWeeks: body.durationWeeks,
      memo: body.memo,
    },
  });
  return NextResponse.json(program);
}
