import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { ok, err } from "@/lib/api";
import { verifyPassword, createAccessToken, createRefreshToken } from "@/lib/auth";

// POST /api/auth/login
// Body: { username, password }
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { username, password } = body ?? {};

  if (!username || !password) {
    return err("VALIDATION_ERROR", "username, password 필수", 400);
  }

  const user = await prisma.user.findFirst({
    where: { userId: username, isDeleted: false, isActive: true },
    include: { role: true },
  });

  if (!user || !user.pwdHash) {
    return err("UNAUTHORIZED", "아이디 또는 비밀번호가 올바르지 않습니다", 401);
  }

  if (!verifyPassword(password, user.pwdHash)) {
    // 로그인 실패 기록
    await prisma.userLoginLog.create({
      data: { userId: user.userId, ipAddr: req.headers.get("x-forwarded-for") ?? undefined, result: "FAIL" },
    }).catch(() => undefined);
    return err("UNAUTHORIZED", "아이디 또는 비밀번호가 올바르지 않습니다", 401);
  }

  const tokenBase = { sub: user.userId, roleId: user.roleId, centerId: user.centerId };
  const accessToken  = createAccessToken(tokenBase);
  const refreshToken = createRefreshToken(tokenBase);

  // 로그인 성공 기록
  await prisma.userLoginLog.create({
    data: { userId: user.userId, ipAddr: req.headers.get("x-forwarded-for") ?? undefined, result: "SUCCESS" },
  }).catch(() => undefined);

  return ok({
    accessToken,
    refreshToken,
    user: {
      userId:   user.userId,
      userNm:   user.userNm,
      roleCd:   user.roleId,
      centerId: user.centerId,
    },
  });
}
