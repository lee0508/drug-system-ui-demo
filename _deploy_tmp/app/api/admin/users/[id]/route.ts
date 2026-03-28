import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { ok, err } from "@/lib/api";
import { hashPassword } from "@/lib/auth";

type Ctx = { params: { id: string } };

// PATCH /api/admin/users/:id — 역할/상태/비밀번호 변경
// Body: { roleCd?, centerId?, isActive?, password? }
export async function PATCH(req: NextRequest, { params }: Ctx) {
  const userId = params.id;
  const body = await req.json();

  const user = await prisma.user.findFirst({ where: { userId, isDeleted: false } });
  if (!user) return err("NOT_FOUND", "user not found", 404);

  const updated = await prisma.user.update({
    where: { userId },
    data: {
      ...(body.roleCd   !== undefined ? { roleId:   body.roleCd }   : {}),
      ...(body.centerId !== undefined ? { centerId: body.centerId } : {}),
      ...(body.isActive !== undefined ? { isActive: body.isActive } : {}),
      ...(body.password ? { pwdHash: hashPassword(body.password) } : {}),
      ...(body.userNm   !== undefined ? { userNm:   body.userNm }   : {}),
      ...(body.email    !== undefined ? { email:    body.email }    : {}),
    },
    select: {
      userId:    true,
      userNm:    true,
      roleId:    true,
      centerId:  true,
      email:     true,
      isActive:  true,
      updatedAt: true,
    },
  });

  return ok(updated);
}

// DELETE /api/admin/users/:id — 논리삭제
export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const userId = params.id;

  const user = await prisma.user.findFirst({ where: { userId, isDeleted: false } });
  if (!user) return err("NOT_FOUND", "user not found", 404);

  await prisma.user.update({
    where: { userId },
    data: { isDeleted: true, deletedAt: new Date(), isActive: false },
  });

  return ok({ message: "사용자가 비활성화되었습니다." });
}
