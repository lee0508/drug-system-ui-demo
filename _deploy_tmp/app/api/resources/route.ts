import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/resources — 지역 자원 목록
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const region = searchParams.get("region");
  const search = searchParams.get("search") ?? "";

  const resources = await prisma.resource.findMany({
    where: {
      isDeleted: false,
      isActive: true,
      ...(type ? { resourceType: type } : {}),
      ...(region ? { regionCd: region } : {}),
      ...(search ? { resourceNm: { contains: search } } : {}),
    },
    orderBy: { resourceNm: "asc" },
  });

  return NextResponse.json(resources);
}

// POST /api/resources — 지역 자원 등록
export async function POST(req: NextRequest) {
  const body = await req.json();

  const resource = await prisma.resource.create({
    data: {
      resourceNm: body.resourceNm,
      resourceType: body.resourceType,
      regionCd: body.regionCd,
      phone: body.phone,
      address: body.address,
      note: body.note,
    },
  });

  return NextResponse.json(resource, { status: 201 });
}
