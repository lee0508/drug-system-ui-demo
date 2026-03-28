import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const item = await prisma.naMemberReferral.findUnique({
    where: { referralId: params.id },
    include: { subject: { select: { alias: true, caseNo: true } } },
  });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const item = await prisma.naMemberReferral.update({
    where: { referralId: params.id },
    data: {
      referralType: body.referralType,
      fromOrg: body.fromOrg,
      toOrg: body.toOrg,
      referralDate: body.referralDate ? new Date(body.referralDate) : undefined,
      statusCode: body.statusCode,
      summary: body.summary,
    },
  });
  return NextResponse.json(item);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.naMemberReferral.delete({ where: { referralId: params.id } });
  return NextResponse.json({ ok: true });
}
