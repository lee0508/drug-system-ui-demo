import { NextRequest } from "next/server";
import { ok, err } from "@/lib/api";
import { verifyToken, createAccessToken, createRefreshToken } from "@/lib/auth";

// POST /api/auth/refresh
// Body: { refreshToken }
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { refreshToken } = body ?? {};

  if (!refreshToken) return err("VALIDATION_ERROR", "refreshToken 필수", 400);

  const payload = verifyToken(refreshToken);
  if (!payload || payload.type !== "refresh") {
    return err("UNAUTHORIZED", "유효하지 않거나 만료된 refresh token", 401);
  }

  const base = { sub: payload.sub, roleId: payload.roleId, centerId: payload.centerId };
  return ok({
    accessToken:  createAccessToken(base),
    refreshToken: createRefreshToken(base),
  });
}
