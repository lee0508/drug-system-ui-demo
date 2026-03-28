import { ok } from "@/lib/api";
import prisma from "@/lib/prisma";

// GET /api/admin/roles — 역할 목록
export async function GET() {
  const roles = await prisma.role.findMany({
    orderBy: { roleId: "asc" },
  });
  return ok(roles);
}
