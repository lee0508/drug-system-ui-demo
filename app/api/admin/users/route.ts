import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { ok, okList, err, parsePage } from "@/lib/api";
import { hashPassword } from "@/lib/auth";

// GET /api/admin/users?centerId=CT-01&roleCd=COUNSELOR&q=홍&page=1&pageSize=20
export async function GET(req: NextRequest) {
  const sp = new URL(req.url).searchParams;
  const { page, pageSize, skip } = parsePage(sp);

  const where: Record<string, unknown> = { isDeleted: false };
  if (sp.get("centerId")) where.centerId = sp.get("centerId");
  if (sp.get("roleCd"))   where.roleId   = sp.get("roleCd");
  if (sp.get("q")) {
    where.OR = [
      { userId: { contains: sp.get("q")!, mode: "insensitive" } },
      { userNm: { contains: sp.get("q")!, mode: "insensitive" } },
    ];
  }

  const [total, rows] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
      select: {
        userId:    true,
        userNm:    true,
        roleId:    true,
        centerId:  true,
        email:     true,
        isActive:  true,
        createdAt: true,
        role:      { select: { roleNm: true } },
        // pwdHash 제외
      },
    }),
  ]);

  return okList(rows, { page, pageSize, total });
}

// POST /api/admin/users — 사용자 등록
// Body: { userId, userNm, password, centerId, roleCd, email?, phone? }
export async function POST(req: NextRequest) {
  const body = await req.json();

  const required = ["userId", "userNm", "password", "roleCd"];
  for (const f of required) {
    if (!body[f]) return err("VALIDATION_ERROR", `${f} 필수`, 400);
  }

  const exists = await prisma.user.findFirst({ where: { userId: body.userId } });
  if (exists) return err("CONFLICT", `userId '${body.userId}' 이미 사용 중`, 409);

  const user = await prisma.user.create({
    data: {
      userId:   body.userId,
      userNm:   body.userNm,
      roleId:   body.roleCd,
      centerId: body.centerId,
      email:    body.email,
      pwdHash:  hashPassword(body.password),
      isActive: true,
    },
    select: {
      userId:    true,
      userNm:    true,
      roleId:    true,
      centerId:  true,
      email:     true,
      isActive:  true,
      createdAt: true,
    },
  });

  return ok(user, 201);
}
