import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/tests/[id]
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const test = await prisma.naMemberTest.findUnique({
    where: { testId: params.id },
    include: { subject: { select: { alias: true, caseNo: true } } },
  });
  if (!test) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(test);
}

// PATCH /api/tests/[id]
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const test = await prisma.naMemberTest.update({
    where: { testId: params.id },
    data: {
      testTypeCode: body.testTypeCode,
      testDate: body.testDate ? new Date(body.testDate) : undefined,
      testOrgNm: body.testOrgNm,
      resultCode: body.resultCode,
      resultDetail: body.resultDetail,
      memo: body.memo,
    },
  });
  return NextResponse.json(test);
}

// DELETE /api/tests/[id]
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.naMemberTest.delete({ where: { testId: params.id } });
  return NextResponse.json({ ok: true });
}
