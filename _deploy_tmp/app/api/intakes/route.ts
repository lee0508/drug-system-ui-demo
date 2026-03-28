import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { ok, okList, err, parsePage } from "@/lib/api";

// GET /api/intakes?status=QUEUE&centerId=CT-01&from=2026-01-01&to=2026-03-31&page=1&pageSize=20
export async function GET(req: NextRequest) {
  const sp = new URL(req.url).searchParams;
  const { page, pageSize, skip } = parsePage(sp);

  const where: Record<string, unknown> = { isDeleted: false };
  if (sp.get("status"))   where.intakeStep = sp.get("status");
  if (sp.get("source"))   where.source     = sp.get("source");
  if (sp.get("centerId")) where.assignedCenter = sp.get("centerId");
  if (sp.get("from") || sp.get("to")) {
    where.createdAt = {
      ...(sp.get("from") ? { gte: new Date(sp.get("from")!) } : {}),
      ...(sp.get("to")   ? { lte: new Date(sp.get("to")!)   } : {}),
    };
  }

  const [total, rows] = await Promise.all([
    prisma.intake.count({ where }),
    prisma.intake.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
  ]);

  return okList(rows, { page, pageSize, total });
}

// POST /api/intakes
export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.source) return err("VALIDATION_ERROR", "source 필수", 400);

  const count = await prisma.intake.count();
  const intakeNo = `IN-${new Date().getFullYear()}-${String(count + 1).padStart(4, "0")}`;

  const intake = await prisma.intake.create({
    data: {
      intakeNo,
      source:          body.source,
      regionCd:        body.regionCd,
      triage:          body.triageCd ?? body.triage ?? "LOW",
      consent:         body.consent ?? false,
      summary:         body.summary,
      preferredCenter: body.centerId ?? body.preferredCenter,
      intakeStep:      "QUEUE",
      createdBy:       body.createdBy,
      ...(body.subjectId ? { subjectId: body.subjectId } : {}),
    },
  });

  // 접수 대기 스텝 로그
  await prisma.intakeStepLog.create({
    data: { intakeId: intake.intakeId, step: "QUEUE", doneBy: body.createdBy },
  });

  return ok(intake, 201);
}
