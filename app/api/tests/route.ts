import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/tests — 검사결과 목록
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const subjectId = searchParams.get("subjectId");
  const testTypeCode = searchParams.get("testTypeCode");
  const resultCode = searchParams.get("resultCode");
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "20");

  const where: Record<string, unknown> = {};
  if (subjectId) where.subjectId = subjectId;
  if (testTypeCode) where.testTypeCode = testTypeCode;
  if (resultCode) where.resultCode = resultCode;
  if (from || to) {
    where.testDate = {
      ...(from ? { gte: new Date(from) } : {}),
      ...(to ? { lte: new Date(to) } : {}),
    };
  }

  const [total, items] = await Promise.all([
    prisma.naMemberTest.count({ where }),
    prisma.naMemberTest.findMany({
      where,
      include: { subject: { select: { alias: true, caseNo: true } } },
      orderBy: { testDate: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  return NextResponse.json({ total, page, limit, items });
}

// POST /api/tests — 검사결과 등록
export async function POST(req: NextRequest) {
  const body = await req.json();

  const test = await prisma.naMemberTest.create({
    data: {
      subjectId: body.subjectId,
      testTypeCode: body.testTypeCode,
      testDate: new Date(body.testDate),
      testOrgNm: body.testOrgNm,
      resultCode: body.resultCode,
      resultDetail: body.resultDetail ?? undefined,
      memo: body.memo,
    },
  });

  return NextResponse.json(test, { status: 201 });
}
