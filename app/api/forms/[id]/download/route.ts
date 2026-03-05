import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import prisma from "@/lib/prisma";

const UPLOAD_DIR = path.join(process.cwd(), "form-uploads");

const MIME_MAP: Record<string, string> = {
  HWP:  "application/x-hwp",
  HWPX: "application/x-hwpx",
  PDF:  "application/pdf",
  XLSX: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  DOCX: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  DOC:  "application/msword",
};

// GET /api/forms/:id/download — 서식 파일 다운로드
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  let formId: bigint;
  try {
    formId = BigInt(params.id);
  } catch {
    return NextResponse.json({ error: "잘못된 ID" }, { status: 400 });
  }

  const form = await prisma.formTemplate.findFirst({
    where: { formId, isDeleted: false },
  });

  if (!form || !form.filePath) {
    return NextResponse.json({ error: "파일을 찾을 수 없습니다." }, { status: 404 });
  }

  // 경로 순회 공격 방지 (path traversal protection)
  const resolvedPath = path.resolve(UPLOAD_DIR, form.filePath);
  if (!resolvedPath.startsWith(UPLOAD_DIR)) {
    return NextResponse.json({ error: "잘못된 파일 경로" }, { status: 403 });
  }

  let buffer: Buffer;
  try {
    buffer = await readFile(resolvedPath);
  } catch {
    return NextResponse.json({ error: "파일을 읽을 수 없습니다." }, { status: 500 });
  }

  const ext = (form.fileExt ?? "bin").toUpperCase();
  const mimeType = MIME_MAP[ext] ?? "application/octet-stream";
  const downloadName = `${form.formNm}.${ext.toLowerCase()}`;

  return new NextResponse(buffer as unknown as BodyInit, {
    status: 200,
    headers: {
      "Content-Type": mimeType,
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(downloadName)}`,
      "Content-Length": String(buffer.byteLength),
    },
  });
}
