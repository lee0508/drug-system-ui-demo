import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/programs/[id]/enrolls
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const enrolls = await prisma.naMemberProgramEnroll.findMany({
    where: { programId: params.id },
    include: { subject: { select: { alias: true, caseNo: true, subjectId: true } } },
    orderBy: { enrollDate: "desc" },
  });
  return NextResponse.json(enrolls);
}

// POST /api/programs/[id]/enrolls — 대상자 등록
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const enroll = await prisma.naMemberProgramEnroll.create({
    data: {
      programId: params.id,
      subjectId: body.subjectId,
      enrollDate: new Date(body.enrollDate),
      statusCode: body.statusCode ?? "ENROLLED",
    },
  });
  return NextResponse.json(enroll, { status: 201 });
}
