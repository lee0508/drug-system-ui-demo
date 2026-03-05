import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/programs/[id]/sessions
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const sessions = await prisma.naProgramSession.findMany({
    where: { programId: params.id },
    include: {
      attendances: {
        include: { enroll: { include: { subject: { select: { alias: true, caseNo: true } } } } },
      },
    },
    orderBy: { sessionDate: "asc" },
  });
  return NextResponse.json(sessions);
}

// POST /api/programs/[id]/sessions — 회차 추가
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const session = await prisma.naProgramSession.create({
    data: {
      programId: params.id,
      sessionNo: body.sessionNo,
      sessionDate: new Date(body.sessionDate),
      location: body.location,
      facilitator: body.facilitator,
      memo: body.memo,
    },
  });
  return NextResponse.json(session, { status: 201 });
}
