/**
 * BigInt 직렬화 유틸
 * Next.js API 응답에서 BigInt를 JSON으로 직렬화할 때 사용
 *
 * 사용법: NextResponse.json(serialize(data))
 */
export function serialize<T>(data: T): T {
  return JSON.parse(
    JSON.stringify(data, (_key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}
