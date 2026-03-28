import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/subjects/:id
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const subject = await prisma.subject.findFirst({
    where: { subjectId: params.id, isDeleted: false },
    include: {
      drugTypes: { select: { drugCd: true, isPrimary: true } },
      families: { where: { isDeleted: false } },
      assignments: {
        where: { isActive: true },
        include: { supporter: true },
      },
    },
  });

  if (!subject) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  return NextResponse.json(subject);
}

// PUT /api/subjects/:id
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();

  const subject = await prisma.subject.update({
    where: { subjectId: params.id },
    data: {
      alias: body.alias,
      gender: body.gender,
      birthYear: body.birthYear,
      regionCd: body.regionCd,
      entryRoute: body.entryRoute,
      status: body.status,
    },
  });

  return NextResponse.json(subject);
}

// DELETE /api/subjects/:id — 소프트 삭제
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.subject.update({
    where: { subjectId: params.id },
    data: { isDeleted: true, deletedAt: new Date() },
  });

  return NextResponse.json({ ok: true });
}
