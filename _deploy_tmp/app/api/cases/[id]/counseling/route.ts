import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { ok, okList, err, parsePage } from "@/lib/api";

type Ctx = { params: { id: string } };

// GET /api/cases/:id/counseling?page=1&pageSize=20
export async function GET(req: NextRequest, { params }: Ctx) {
  const caseId = BigInt(params.id);
  const sp = new URL(req.url).searchParams;
  const { page, pageSize, skip } = parsePage(sp);

  const caseExists = await prisma.case.count({ where: { caseId, isDeleted: false } });
  if (!caseExists) return err("NOT_FOUND", "case not found", 404);

  const [total, rows] = await Promise.all([
    prisma.counseling.count({ where: { caseId, isDeleted: false } }),
    prisma.counseling.findMany({
      where:   { caseId, isDeleted: false },
      orderBy: { counselAt: "desc" },
      skip,
      take: pageSize,
    }),
  ]);

  return okList(rows, { page, pageSize, total });
}

// POST /api/cases/:id/counseling
// Body: { counselDt, counselTypeCd, content, riskLevelCd, duration? }
export async function POST(req: NextRequest, { params }: Ctx) {
  const caseId = BigInt(params.id);
  const body = await req.json();

  if (!body.counselDt) return err("VALIDATION_ERROR", "counselDt 필수", 400);
  if (!body.content && !body.summary) return err("VALIDATION_ERROR", "content 필수", 400);

  const caseExists = await prisma.case.count({ where: { caseId, isDeleted: false } });
  if (!caseExists) return err("NOT_FOUND", "case not found", 404);

  const counsel = await prisma.counseling.create({
    data: {
      caseId,
      counselAt: new Date(body.counselDt),
      method:    body.counselTypeCd ?? body.method,
      summary:   body.content ?? body.summary,
      duration:  body.duration,
      createdBy: body.createdBy,
    },
  });

  // 상담 이벤트 기록
  await prisma.caseEvent.create({
    data: {
      caseId,
      eventType: "ASSESSMENT",
      title: `상담일지: ${body.counselTypeCd ?? "방문"}`,
      createdBy: body.createdBy,
    },
  });

  return ok(counsel, 201);
}
