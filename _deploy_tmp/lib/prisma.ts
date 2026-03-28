import { PrismaClient } from "@prisma/client";

// BigInt → JSON 직렬화 전역 패치 (JSON.stringify 호환)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(BigInt.prototype as any).toJSON = function () { return this.toString(); };

// PrismaClient 전역 싱글턴 (Next.js 개발 모드 핫리로드 시 중복 연결 방지)
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
