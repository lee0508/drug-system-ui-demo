import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/connectors — 연계 커넥터 목록
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const group = searchParams.get("group");

  const connectors = await prisma.connector.findMany({
    where: {
      isActive: true,
      ...(group ? { groupCd: group } : {}),
    },
    include: {
      logs: {
        orderBy: { loggedAt: "desc" },
        take: 5,
      },
    },
    orderBy: { connectorId: "asc" },
  });

  return NextResponse.json(connectors);
}
