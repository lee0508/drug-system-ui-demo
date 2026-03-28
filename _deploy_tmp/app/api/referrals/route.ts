import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/referrals
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const subjectId = searchParams.get("subjectId");
  const referralType = searchParams.get("referralType");
  const statusCode = searchParams.get("statusCode");
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "20");

  const where: Record<string, unknown> = {};
  if (subjectId) where.subjectId = subjectId;
  if (referralType) where.referralType = referralType;
  if (statusCode) where.statusCode = statusCode;

  const [total, items] = await Promise.all([
    prisma.naMemberReferral.count({ where }),
    prisma.naMemberReferral.findMany({
      where,
      include: { subject: { select: { alias: true, caseNo: true } } },
      orderBy: { referralDate: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  return NextResponse.json({ total, page, limit, items });
}

// POST /api/referrals
export async function POST(req: NextRequest) {
  const body = await req.json();

  const referral = await prisma.naMemberReferral.create({
    data: {
      subjectId: body.subjectId,
      referralType: body.referralType,
      fromOrg: body.fromOrg,
      toOrg: body.toOrg,
      referralDate: new Date(body.referralDate),
      statusCode: body.statusCode ?? "OPEN",
      summary: body.summary,
    },
  });

  return NextResponse.json(referral, { status: 201 });
}
