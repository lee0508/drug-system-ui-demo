import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/centers — 센터 목록
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const regionCd = searchParams.get("region");

  const centers = await prisma.center.findMany({
    where: {
      isActive: true,
      ...(regionCd ? { regionCd } : {}),
    },
    include: {
      region: true,
      _count: { select: { cases: { where: { isDeleted: false, status: { not: "CLOSED" } } } } },
    },
    orderBy: { regionCd: "asc" },
  });

  return NextResponse.json(centers);
}

// POST /api/centers — 센터 등록
export async function POST(req: NextRequest) {
  const body = await req.json();

  const center = await prisma.center.create({
    data: {
      centerId: body.centerId,
      centerNm: body.centerNm,
      regionCd: body.regionCd,
      address: body.address,
      phone: body.phone,
      manager: body.manager,
      capacity: body.capacity ?? 30,
    },
  });

  return NextResponse.json(center, { status: 201 });
}
