import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/subjects — 대상자 목록 조회
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status");
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "20");

  const where = {
    isDeleted: false,
    ...(status ? { status } : {}),
    ...(search
      ? {
          OR: [
            { alias: { contains: search } },
            { caseNo: { contains: search, mode: "insensitive" as const } },
            { regionCd: { contains: search } },
          ],
        }
      : {}),
  };

  const [total, items] = await Promise.all([
    prisma.subject.count({ where }),
    prisma.subject.findMany({
      where,
      include: { drugTypes: { select: { drugCd: true, isPrimary: true } } },
      orderBy: { registeredAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  return NextResponse.json({ total, page, limit, items });
}

// POST /api/subjects — 대상자 등록
export async function POST(req: NextRequest) {
  const body = await req.json();

  // 관리번호 자동 생성 (SUBJ-XXXXXX)
  const count = await prisma.subject.count();
  const caseNo = `SUBJ-${String(count + 1).padStart(6, "0")}`;
  const subjectId = `SUBJ${Date.now()}`;

  const subject = await prisma.subject.create({
    data: {
      subjectId,
      caseNo,
      alias: body.alias,
      gender: body.gender,
      birthYear: body.birthYear,
      regionCd: body.regionCd,
      entryRoute: body.entryRoute,
      status: body.status ?? "ACTIVE",
      createdBy: body.createdBy,
      drugTypes: {
        create: (body.drugTypes ?? []).map((drugCd: string, i: number) => ({
          drugCd,
          isPrimary: i === 0,
        })),
      },
    },
    include: { drugTypes: { select: { drugCd: true, isPrimary: true } } },
  });

  return NextResponse.json(subject, { status: 201 });
}
