import { NextRequest } from "next/server";
import { ok, err } from "@/lib/api";
import { getAuth } from "@/lib/auth";

// POST /api/auth/logout
// 현재 토큰 방식은 stateless이므로 클라이언트에서 토큰 삭제가 주 처리.
// 서버 측에서는 로그만 남기고 성공 응답 반환.
// (운영 시 refreshToken → DB 블랙리스트 또는 redis 무효화로 확장)
export async function POST(req: NextRequest) {
  const auth = getAuth(req);
  if (!auth) return err("UNAUTHORIZED", "인증이 필요합니다", 401);

  return ok({ message: "로그아웃되었습니다. 클라이언트에서 토큰을 삭제하세요." });
}
