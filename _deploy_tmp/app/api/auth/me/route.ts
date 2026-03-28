import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { ok, err } from "@/lib/api";
import { getAuth } from "@/lib/auth";

// GET /api/auth/me
// Header: Authorization: Bearer <accessToken>
export async function GET(req: NextRequest) {
  const auth = getAuth(req);
  if (!auth) return err("UNAUTHORIZED", "인증이 필요합니다", 401);

  const user = await prisma.user.findFirst({
    where: { userId: auth.sub, isDeleted: false, isActive: true },
    include: { role: true },
  });

  if (!user) return err("NOT_FOUND", "사용자를 찾을 수 없습니다", 404);

  return ok({
    userId:   user.userId,
    userNm:   user.userNm,
    roleCd:   user.roleId,
    roleNm:   user.role.roleNm,
    centerId: user.centerId,
    email:    user.email,
  });
}
