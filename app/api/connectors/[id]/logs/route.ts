import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/connectors/:id/logs — 연계 로그 조회
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") ?? "50");

  const logs = await prisma.integrationLog.findMany({
    where: { connectorId: params.id },
    orderBy: { loggedAt: "desc" },
    take: limit,
  });

  return NextResponse.json(logs);
}

// POST /api/connectors/:id/logs/:logId/retry — 재처리
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const logId = BigInt(body.logId);

  const original = await prisma.integrationLog.findFirstOrThrow({ where: { logId } });

  if (original.result === "SUCCESS") {
    return NextResponse.json({ error: "이미 성공한 로그입니다" }, { status: 400 });
  }

  // 재처리 로그 생성 (실제 재전송 로직은 connector별 구현 필요)
  const retryLog = await prisma.integrationLog.create({
    data: {
      connectorId: params.id,
      direction: original.direction,
      message: `[RETRY] ${original.message}`,
      payload: original.payload ?? undefined,
      result: "SUCCESS",  // 데모: 성공으로 처리
      retryCount: original.retryCount + 1,
      retriedFrom: logId,
    },
  });

  return NextResponse.json(retryLog, { status: 201 });
}
