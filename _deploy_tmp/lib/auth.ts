/**
 * 인증 유틸리티 (Node.js crypto 기반, 외부 패키지 불필요)
 *
 * - 비밀번호: PBKDF2(SHA-256) 해시
 * - 토큰: HMAC-SHA256 서명 (JWT 호환 구조)
 */
import crypto from "crypto";

const SECRET = process.env.JWT_SECRET ?? "kdart-drug-system-secret-2026";
const ACCESS_TTL = 60 * 60 * 1000;       // 1시간 (ms)
const REFRESH_TTL = 7 * 24 * 60 * 60 * 1000; // 7일 (ms)

// ────────────────────────────────────────────
// 비밀번호 해시
// ────────────────────────────────────────────

export function hashPassword(plain: string): string {
  // 고정 salt(개발용) — 운영에서는 per-user random salt + DB 저장 권장
  const salt = "kdart-salt-2026";
  return crypto.pbkdf2Sync(plain, salt, 10000, 32, "sha256").toString("hex");
}

export function verifyPassword(plain: string, hash: string): boolean {
  return hashPassword(plain) === hash;
}

// ────────────────────────────────────────────
// 토큰 (HMAC-SHA256, JWT 구조 호환)
// ────────────────────────────────────────────

export type TokenPayload = {
  sub: string;       // userId
  roleId: string;
  centerId?: string | null;
  type: "access" | "refresh";
  exp: number;       // 만료 timestamp (ms)
};

function b64url(s: string) {
  return Buffer.from(s).toString("base64url");
}

function sign(header: string, body: string): string {
  return crypto
    .createHmac("sha256", SECRET)
    .update(`${header}.${body}`)
    .digest("base64url");
}

export function createAccessToken(payload: Omit<TokenPayload, "type" | "exp">): string {
  return buildToken({ ...payload, type: "access", exp: Date.now() + ACCESS_TTL });
}

export function createRefreshToken(payload: Omit<TokenPayload, "type" | "exp">): string {
  return buildToken({ ...payload, type: "refresh", exp: Date.now() + REFRESH_TTL });
}

function buildToken(payload: TokenPayload): string {
  const header = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = b64url(JSON.stringify(payload));
  return `${header}.${body}.${sign(header, body)}`;
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [header, body, sig] = parts;
    if (sign(header, body) !== sig) return null;
    const payload: TokenPayload = JSON.parse(Buffer.from(body, "base64url").toString());
    if (payload.exp < Date.now()) return null; // 만료
    return payload;
  } catch {
    return null;
  }
}

/** Authorization: Bearer <token> 에서 토큰 추출 */
export function extractBearer(req: Request): string | null {
  const auth = req.headers.get("Authorization") ?? "";
  return auth.startsWith("Bearer ") ? auth.slice(7) : null;
}

/** 요청에서 인증된 페이로드 반환 (없으면 null) */
export function getAuth(req: Request): TokenPayload | null {
  const token = extractBearer(req);
  if (!token) return null;
  const payload = verifyToken(token);
  if (!payload || payload.type !== "access") return null;
  return payload;
}
