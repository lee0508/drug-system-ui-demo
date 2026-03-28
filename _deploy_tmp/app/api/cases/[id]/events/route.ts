import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { ok, okList, err, parsePage } from "@/lib/api";

type Ctx = { params: { id: string } };

// GET /api/cases/:id/events?page=1&pageSize=20
export async function GET(req: NextRequest, { params }: Ctx) {
  const caseId = BigInt(params.id);
  const sp = new URL(req.url).searchParams;
  const { page, pageSize, skip } = parsePage(sp);

  const caseExists = await prisma.case.count({ where: { caseId, isDeleted: false } });
  if (!caseExists) return err("NOT_FOUND", "case not found", 404);

  const [total, rows] = await Promise.all([
    prisma.caseEvent.count({ where: { caseId } }),
    prisma.caseEvent.findMany({
      where: { caseId },
      orderBy: { eventAt: "desc" },
      skip,
      take: pageSize,
    }),
  ]);

  return okList(rows, { page, pageSize, total });
}

// POST /api/cases/:id/events
export async function POST(req: NextRequest, { params }: Ctx) {
  const caseId = BigInt(params.id);
  const body = await req.json();

  if (!body.eventCd && !body.eventType) {
    return err("VALIDATION_ERROR", "eventCd 또는 eventType 필수", 400);
  }

  const event = await prisma.caseEvent.create({
    data: {
      caseId,
      eventType: body.eventCd ?? body.eventType,
      title:     body.title ?? body.content?.slice(0, 50),
      note:      body.content ?? body.note,
      createdBy: body.createdBy,
    },
  });

  return ok(event, 201);
}
