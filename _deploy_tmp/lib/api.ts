/**
 * API 응답 엔벨로프 헬퍼
 *
 * 모든 Route Handler에서 일관된 응답 형식을 보장합니다.
 *   { ok, data, error, meta }
 */
import { NextResponse } from "next/server";
import { serialize } from "@/lib/bigint";

export type Meta = {
  page: number;
  pageSize: number;
  total: number;
};

type ErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "INTERNAL_ERROR";

/** 단건 성공 응답 */
export function ok<T>(data: T, status = 200) {
  return NextResponse.json(
    serialize({ ok: true, data, error: null }),
    { status }
  );
}

/** 목록 성공 응답 (페이지네이션 메타 포함) */
export function okList<T>(data: T[], meta: Meta) {
  return NextResponse.json(
    serialize({ ok: true, data, error: null, meta })
  );
}

/** 에러 응답 */
export function err(code: ErrorCode, message: string, status: number) {
  return NextResponse.json(
    { ok: false, data: null, error: { code, message } },
    { status }
  );
}

/** 페이지네이션 파라미터 파싱 */
export function parsePage(searchParams: URLSearchParams) {
  const page = Math.max(parseInt(searchParams.get("page") ?? "1", 10), 1);
  const pageSize = Math.min(
    Math.max(parseInt(searchParams.get("pageSize") ?? "20", 10), 1),
    100
  );
  return { page, pageSize, skip: (page - 1) * pageSize };
}
