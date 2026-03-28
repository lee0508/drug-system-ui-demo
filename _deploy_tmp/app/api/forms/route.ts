import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import prisma from "@/lib/prisma";
import { serialize } from "@/lib/bigint";

// 파일 저장 경로 (public 외부 → API를 통해서만 다운로드 가능)
const UPLOAD_DIR = path.join(process.cwd(), "form-uploads");

// GET /api/forms — 서식 목록 조회
export async function GET() {
  const forms = await prisma.formTemplate.findMany({
    where: { isDeleted: false, isActive: true },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json(serialize(forms));
}

// POST /api/forms — 서식 파일 업로드
export async function POST(req: NextRequest) {
  const data = await req.formData();
  const file = data.get("file") as File | null;
  const formNm = (data.get("formNm") as string) || "";
  const version = (data.get("version") as string) || "1.0";

  if (!file) {
    return NextResponse.json({ error: "파일이 없습니다." }, { status: 400 });
  }

  // 파일 크기 제한: 50MB
  if (file.size > 50 * 1024 * 1024) {
    return NextResponse.json({ error: "파일 크기는 50MB 이하여야 합니다." }, { status: 400 });
  }

  const ext = file.name.split(".").pop()?.toUpperCase() ?? "BIN";
  const allowedExt = ["HWP", "HWPX", "PDF", "XLSX", "DOCX", "DOC"];
  if (!allowedExt.includes(ext)) {
    return NextResponse.json({ error: `허용 형식: ${allowedExt.join(", ")}` }, { status: 400 });
  }

  // 파일 저장
  await mkdir(UPLOAD_DIR, { recursive: true });
  const uuid = randomUUID();
  const savedName = `${uuid}_${file.name.replace(/[^a-zA-Z0-9가-힣._-]/g, "_")}`;
  const bytes = await file.arrayBuffer();
  await writeFile(path.join(UPLOAD_DIR, savedName), Buffer.from(bytes));

  // DB 등록
  const form = await prisma.formTemplate.create({
    data: {
      formNm: formNm || file.name,
      fileExt: ext,
      filePath: savedName,
      version,
    },
  });

  return NextResponse.json(serialize(form), { status: 201 });
}
