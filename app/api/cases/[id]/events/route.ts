import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// POST /api/cases/:id/events — 케이스 이벤트 추가
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const caseId = BigInt(params.id);
  const body = await req.json();

  const event = await prisma.caseEvent.create({
    data: {
      caseId,
      eventType: body.eventType,
      title: body.title,
      note: body.note,
      createdBy: body.createdBy,
    },
  });

  return NextResponse.json(event, { status: 201 });
}
