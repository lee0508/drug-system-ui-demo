/**
 * Prisma Seed — 초기 데이터 입력
 * 실행: npm run db:seed
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ─── 공통 코드 ────────────────────────────────────────
  await prisma.codeGroup.upsert({
    where: { groupCd: "DRUG_TYPE" },
    update: {},
    create: { groupCd: "DRUG_TYPE", groupNm: "마약 유형" },
  });

  const drugTypes = [
    { code: "PHILOPON", codeNm: "필로폰(메스암페타민)" },
    { code: "CANNABIS", codeNm: "대마" },
    { code: "COCAINE",  codeNm: "코카인" },
    { code: "HEROIN",   codeNm: "헤로인" },
    { code: "ECSTASY",  codeNm: "엑스터시(MDMA)" },
    { code: "KETAMINE", codeNm: "케타민" },
    { code: "PSILOCYBIN", codeNm: "실로시빈(마법버섯)" },
    { code: "OTHER",    codeNm: "기타" },
  ];
  for (const d of drugTypes) {
    await prisma.code.upsert({
      where: { groupCd_code: { groupCd: "DRUG_TYPE", code: d.code } },
      update: {},
      create: { groupCd: "DRUG_TYPE", ...d },
    });
  }

  // ─── 지역 ──────────────────────────────────────────────
  const regions = [
    { regionCd: "SEOUL",  regionNm: "서울" },
    { regionCd: "BUSAN",  regionNm: "부산" },
    { regionCd: "INCHEON", regionNm: "인천" },
    { regionCd: "DAEGU",  regionNm: "대구" },
    { regionCd: "GWANGJU", regionNm: "광주" },
    { regionCd: "DAEJEON", regionNm: "대전" },
    { regionCd: "ULSAN",  regionNm: "울산" },
    { regionCd: "GYEONGGI", regionNm: "경기" },
    { regionCd: "GANGWON", regionNm: "강원" },
    { regionCd: "JEONBUK", regionNm: "전북" },
    { regionCd: "JEONNAM", regionNm: "전남" },
    { regionCd: "GYEONGBUK", regionNm: "경북" },
    { regionCd: "GYEONGNAM", regionNm: "경남" },
    { regionCd: "JEJU",   regionNm: "제주" },
  ];
  for (const r of regions) {
    await prisma.region.upsert({ where: { regionCd: r.regionCd }, update: {}, create: r });
  }

  // ─── 센터 ──────────────────────────────────────────────
  const centers = [
    { centerId: "CTR-SEO-001", centerNm: "서울중독재활센터",   regionCd: "SEOUL",   capacity: 50 },
    { centerId: "CTR-BUS-001", centerNm: "부산중독재활센터",   regionCd: "BUSAN",   capacity: 30 },
    { centerId: "CTR-GGI-001", centerNm: "경기중독재활센터",   regionCd: "GYEONGGI", capacity: 40 },
    { centerId: "CTR-ICN-001", centerNm: "인천중독재활센터",   regionCd: "INCHEON", capacity: 25 },
  ];
  for (const c of centers) {
    await prisma.center.upsert({ where: { centerId: c.centerId }, update: {}, create: c });
  }

  // ─── 역할 ──────────────────────────────────────────────
  const roles = [
    { roleId: "ADMIN",    roleNm: "시스템관리자" },
    { roleId: "MANAGER",  roleNm: "센터장" },
    { roleId: "COUNSELOR", roleNm: "상담사" },
    { roleId: "VIEWER",   roleNm: "열람자" },
  ];
  for (const r of roles) {
    await prisma.role.upsert({ where: { roleId: r.roleId }, update: {}, create: r });
  }

  // ─── 연계 커넥터 ───────────────────────────────────────
  const connectors = [
    { connectorId: "C-EA-1342", connectorNm: "마약류 통합 관리 시스템(MHIS) 1342", groupCd: "EA", status: "OK" },
    { connectorId: "C-EA-HEALTH", connectorNm: "정신건강 통합 시스템", groupCd: "EA", status: "OK" },
    { connectorId: "C-ADMIN-COURT", connectorNm: "법원 전산망", groupCd: "ADMIN", status: "DEGRADED" },
    { connectorId: "C-ADMIN-POLICE", connectorNm: "경찰청 기소유예 연계", groupCd: "ADMIN", status: "OK" },
    { connectorId: "C-ADMIN-WELFARE", connectorNm: "사회보장정보시스템(행복e음)", groupCd: "ADMIN", status: "OK" },
  ];
  for (const c of connectors) {
    await prisma.connector.upsert({
      where: { connectorId: c.connectorId },
      update: {},
      create: c,
    });
  }

  // ─── 마감 체크리스트 템플릿 ─────────────────────────────
  const tplItems = [
    { closingType: "MONTHLY", checkItem: "월간 통계 보고서 제출", sortOrder: 1 },
    { closingType: "MONTHLY", checkItem: "케이스 현황 업데이트 확인", sortOrder: 2 },
    { closingType: "MONTHLY", checkItem: "연계 로그 오류 해소 확인", sortOrder: 3 },
    { closingType: "QUARTERLY", checkItem: "분기 국가 통계 보고서 제출", sortOrder: 1 },
    { closingType: "QUARTERLY", checkItem: "ISP 이행 점검 회의 완료", sortOrder: 2 },
    { closingType: "ANNUAL", checkItem: "연간 실적 보고서 제출", sortOrder: 1 },
    { closingType: "ANNUAL", checkItem: "대상자 상태 일괄 검토 완료", sortOrder: 2 },
  ];
  for (const t of tplItems) {
    await prisma.closingChecklistTpl.create({ data: t });
  }

  console.log("✅ Seed completed!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
