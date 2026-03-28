/**
 * Prisma Seed — 전체 메뉴 샘플 데이터 입력
 * 실행: npm run db:seed
 *
 * 커버 범위:
 *   대상자관리 / 검사관리 / 프로그램·출석 / 의뢰·연계
 *   접수·초기개입 / 사례관리 / 상담 / 모니터링 / 재활교육
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ─── 헬퍼 ──────────────────────────────────────────────
function d(dateStr: string) { return new Date(dateStr); }

async function main() {
  console.log("🌱 Seeding database...");

  // ===================================================================
  // 1. 공통 코드
  // ===================================================================
  await prisma.codeGroup.upsert({ where: { groupCd: "DRUG_TYPE" }, update: {}, create: { groupCd: "DRUG_TYPE", groupNm: "마약 유형" } });
  for (const row of [
    { code: "METH",    codeNm: "필로폰(메스암페타민)" },
    { code: "THC",     codeNm: "대마" },
    { code: "COCAINE", codeNm: "코카인" },
    { code: "HEROIN",  codeNm: "헤로인" },
    { code: "MDMA",    codeNm: "MDMA(엑스터시)" },
    { code: "FENTANYL",codeNm: "펜타닐" },
    { code: "OTHER",   codeNm: "기타" },
  ]) {
    await prisma.code.upsert({ where: { groupCd_code: { groupCd: "DRUG_TYPE", code: row.code } }, update: {}, create: { groupCd: "DRUG_TYPE", ...row } });
  }

  // ===================================================================
  // 2. 지역 / 센터 / 역할
  // ===================================================================
  for (const r of [
    { regionCd: "SEOUL",     regionNm: "서울" },
    { regionCd: "BUSAN",     regionNm: "부산" },
    { regionCd: "INCHEON",   regionNm: "인천" },
    { regionCd: "DAEGU",     regionNm: "대구" },
    { regionCd: "GWANGJU",   regionNm: "광주" },
    { regionCd: "DAEJEON",   regionNm: "대전" },
    { regionCd: "ULSAN",     regionNm: "울산" },
    { regionCd: "GYEONGGI",  regionNm: "경기" },
    { regionCd: "JEONBUK",   regionNm: "전북" },
  ]) {
    await prisma.region.upsert({ where: { regionCd: r.regionCd }, update: {}, create: r });
  }

  for (const c of [
    { centerId: "CTR-SEO-001", centerNm: "서울중독재활센터",  regionCd: "SEOUL",    capacity: 50 },
    { centerId: "CTR-BUS-001", centerNm: "부산중독재활센터",  regionCd: "BUSAN",    capacity: 30 },
    { centerId: "CTR-GGI-001", centerNm: "경기중독재활센터",  regionCd: "GYEONGGI", capacity: 40 },
    { centerId: "CTR-ICN-001", centerNm: "인천중독재활센터",  regionCd: "INCHEON",  capacity: 25 },
  ]) {
    await prisma.center.upsert({ where: { centerId: c.centerId }, update: {}, create: c });
  }

  for (const r of [
    { roleId: "ADMIN",    roleNm: "시스템관리자" },
    { roleId: "MANAGER",  roleNm: "센터장" },
    { roleId: "COUNSELOR",roleNm: "상담사" },
    { roleId: "VIEWER",   roleNm: "열람자" },
  ]) {
    await prisma.role.upsert({ where: { roleId: r.roleId }, update: {}, create: r });
  }

  // ===================================================================
  // 3. 연계 커넥터
  // ===================================================================
  for (const c of [
    { connectorId: "C-EA-1342",      connectorNm: "MHIS 1342",      groupCd: "EA",    status: "OK" },
    { connectorId: "C-EA-HEALTH",    connectorNm: "정신건강 통합",  groupCd: "EA",    status: "OK" },
    { connectorId: "C-ADMIN-COURT",  connectorNm: "법원 전산망",    groupCd: "ADMIN", status: "DEGRADED" },
    { connectorId: "C-ADMIN-POLICE", connectorNm: "경찰청 기소유예",groupCd: "ADMIN", status: "OK" },
    { connectorId: "C-ADMIN-WELFARE",connectorNm: "행복e음",        groupCd: "ADMIN", status: "OK" },
  ]) {
    await prisma.connector.upsert({ where: { connectorId: c.connectorId }, update: {}, create: c });
  }

  // ===================================================================
  // 4. 마감 체크리스트
  // ===================================================================
  if ((await prisma.closingChecklistTpl.count()) === 0) {
    for (const t of [
      { closingType: "MONTHLY",   checkItem: "월간 통계 보고서 제출",     sortOrder: 1 },
      { closingType: "MONTHLY",   checkItem: "케이스 현황 업데이트 확인", sortOrder: 2 },
      { closingType: "QUARTERLY", checkItem: "분기 국가 통계 보고서 제출",sortOrder: 1 },
      { closingType: "ANNUAL",    checkItem: "연간 실적 보고서 제출",     sortOrder: 1 },
    ]) {
      await prisma.closingChecklistTpl.create({ data: t });
    }
  }

  // ===================================================================
  // 5. 대상자 (Subject) 20명 + 관련 테이블
  // ===================================================================
  console.log("👤 대상자 샘플 데이터 입력 중...");

  type SubjectSeed = {
    subjectId: string; caseNo: string; alias: string; gender: string;
    birthYear: number; regionCd: string; entryRoute: string;
    status: string; registeredAt: Date;
    drugs:    { drugCd: string; isPrimary: boolean }[];
    pii:      { fullNameEnc: string; rrnEnc: string; phoneEnc: string; addrEnc: string };
    drugUses: object[];
    tests:    object[];
    referrals:object[];
  };

  const subjects: SubjectSeed[] = [
    {
      subjectId:"SUBJ-2024-0001", caseNo:"SUBJ-2024-0001", alias:"가나01",
      gender:"M", birthYear:1985, regionCd:"SEOUL",   entryRoute:"1342",   status:"ACTIVE",      registeredAt:d("2024-01-10"),
      drugs:[{drugCd:"METH",isPrimary:true}],
      pii:{fullNameEnc:"enc:홍길동",rrnEnc:"enc:850101-1234567",phoneEnc:"enc:010-1234-0001",addrEnc:"enc:서울시 강남구"},
      drugUses:[{substanceCode:"METH",routeCode:"INJECT",firstUseAge:28,lastUseDate:d("2023-11-15"),injectionYn:true,overdoseHistoryYn:true,overdoseCount:2,severityCode:"SEVERE",abstinentStartDate:d("2023-12-01")}],
      tests:[
        {testTypeCode:"URINE",testDate:d("2024-01-15"),testOrgNm:"국립과학수사연구원",resultCode:"POSITIVE",resultDetail:{METH:"POSITIVE"}},
        {testTypeCode:"HAIR", testDate:d("2024-03-10"),testOrgNm:"국립과학수사연구원",resultCode:"NEGATIVE",resultDetail:{METH:"NEGATIVE"}},
      ],
      referrals:[{referralType:"IN",fromOrg:"서울경찰청",referralDate:d("2024-01-08"),statusCode:"CLOSED",summary:"기소유예 조건부 상담 연계"}],
    },
    {
      subjectId:"SUBJ-2024-0002", caseNo:"SUBJ-2024-0002", alias:"나다02",
      gender:"F", birthYear:1992, regionCd:"BUSAN",   entryRoute:"SELF",   status:"ACTIVE",      registeredAt:d("2024-01-20"),
      drugs:[{drugCd:"THC",isPrimary:true},{drugCd:"MDMA",isPrimary:false}],
      pii:{fullNameEnc:"enc:김지수",rrnEnc:"enc:920505-2345678",phoneEnc:"enc:010-2345-0002",addrEnc:"enc:부산시 해운대구"},
      drugUses:[
        {substanceCode:"THC",routeCode:"INHALE",firstUseAge:22,lastUseDate:d("2024-01-10"),injectionYn:false,overdoseHistoryYn:false,severityCode:"MILD"},
        {substanceCode:"MDMA",routeCode:"ORAL",firstUseAge:25,lastUseDate:d("2023-12-28"),injectionYn:false,overdoseHistoryYn:false,severityCode:"MOD"},
      ],
      tests:[{testTypeCode:"URINE",testDate:d("2024-01-25"),testOrgNm:"부산의료원",resultCode:"POSITIVE",resultDetail:{THC:"POSITIVE",MDMA:"POSITIVE"}}],
      referrals:[],
    },
    {
      subjectId:"SUBJ-2024-0003", caseNo:"SUBJ-2024-0003", alias:"다라03",
      gender:"M", birthYear:1978, regionCd:"GYEONGGI",entryRoute:"LEGAL",  status:"MONITORING",  registeredAt:d("2024-02-05"),
      drugs:[{drugCd:"HEROIN",isPrimary:true}],
      pii:{fullNameEnc:"enc:이민수",rrnEnc:"enc:780315-1456789",phoneEnc:"enc:010-3456-0003",addrEnc:"enc:경기도 수원시"},
      drugUses:[{substanceCode:"HEROIN",routeCode:"INJECT",firstUseAge:30,lastUseDate:d("2024-01-20"),injectionYn:true,overdoseHistoryYn:true,overdoseCount:1,severityCode:"SEVERE",abstinentStartDate:d("2024-02-01")}],
      tests:[
        {testTypeCode:"BLOOD",testDate:d("2024-02-10"),testOrgNm:"경기도의료원",resultCode:"POSITIVE",resultDetail:{HEROIN:"POSITIVE"}},
        {testTypeCode:"URINE",testDate:d("2024-04-10"),testOrgNm:"경기도의료원",resultCode:"NEGATIVE",resultDetail:{HEROIN:"NEGATIVE"}},
      ],
      referrals:[
        {referralType:"IN",fromOrg:"수원지방법원",referralDate:d("2024-02-01"),statusCode:"CLOSED",summary:"집행유예 조건부 치료 명령"},
        {referralType:"OUT",toOrg:"수원정신건강복지센터",referralDate:d("2024-03-15"),statusCode:"IN_PROGRESS",summary:"정신건강 서비스 연계"},
      ],
    },
    {
      subjectId:"SUBJ-2024-0004", caseNo:"SUBJ-2024-0004", alias:"라마04",
      gender:"M", birthYear:1990, regionCd:"INCHEON",  entryRoute:"AGENCY", status:"ACTIVE",      registeredAt:d("2024-02-15"),
      drugs:[{drugCd:"COCAINE",isPrimary:true}],
      pii:{fullNameEnc:"enc:박준영",rrnEnc:"enc:900720-1567890",phoneEnc:"enc:010-4567-0004",addrEnc:"enc:인천시 남동구"},
      drugUses:[{substanceCode:"COCAINE",routeCode:"INHALE",firstUseAge:26,lastUseDate:d("2024-02-10"),injectionYn:false,overdoseHistoryYn:false,severityCode:"MOD"}],
      tests:[{testTypeCode:"SALIVA",testDate:d("2024-02-20"),testOrgNm:"인천적십자병원",resultCode:"POSITIVE",resultDetail:{COCAINE:"POSITIVE"}}],
      referrals:[{referralType:"IN",fromOrg:"인천정신건강복지센터",referralDate:d("2024-02-12"),statusCode:"CLOSED",summary:"기관 의뢰"}],
    },
    {
      subjectId:"SUBJ-2024-0005", caseNo:"SUBJ-2024-0005", alias:"마바05",
      gender:"F", birthYear:2000, regionCd:"SEOUL",    entryRoute:"1342",   status:"ACTIVE",      registeredAt:d("2024-03-01"),
      drugs:[{drugCd:"MDMA",isPrimary:true},{drugCd:"THC",isPrimary:false}],
      pii:{fullNameEnc:"enc:정수연",rrnEnc:"enc:000312-2678901",phoneEnc:"enc:010-5678-0005",addrEnc:"enc:서울시 마포구"},
      drugUses:[{substanceCode:"MDMA",routeCode:"ORAL",firstUseAge:21,lastUseDate:d("2024-02-20"),injectionYn:false,overdoseHistoryYn:false,severityCode:"MILD"}],
      tests:[
        {testTypeCode:"URINE",testDate:d("2024-03-05"),testOrgNm:"서울의료원",resultCode:"POSITIVE",resultDetail:{MDMA:"POSITIVE"}},
        {testTypeCode:"URINE",testDate:d("2024-05-05"),testOrgNm:"서울의료원",resultCode:"NEGATIVE",resultDetail:{MDMA:"NEGATIVE"}},
      ],
      referrals:[],
    },
    {
      subjectId:"SUBJ-2024-0006", caseNo:"SUBJ-2024-0006", alias:"바사06",
      gender:"M", birthYear:1975, regionCd:"DAEGU",    entryRoute:"LEGAL",  status:"MONITORING",  registeredAt:d("2024-03-10"),
      drugs:[{drugCd:"METH",isPrimary:true}],
      pii:{fullNameEnc:"enc:최동현",rrnEnc:"enc:750828-1789012",phoneEnc:"enc:010-6789-0006",addrEnc:"enc:대구시 달서구"},
      drugUses:[{substanceCode:"METH",routeCode:"INJECT",firstUseAge:35,lastUseDate:d("2024-02-25"),injectionYn:true,overdoseHistoryYn:false,severityCode:"SEVERE"}],
      tests:[{testTypeCode:"HAIR",testDate:d("2024-03-15"),testOrgNm:"대구가톨릭대학교병원",resultCode:"POSITIVE",resultDetail:{METH:"POSITIVE"}}],
      referrals:[{referralType:"IN",fromOrg:"대구지방검찰청",referralDate:d("2024-03-05"),statusCode:"CLOSED",summary:"기소유예 상담명령"}],
    },
    {
      subjectId:"SUBJ-2024-0007", caseNo:"SUBJ-2024-0007", alias:"사아07",
      gender:"F", birthYear:1988, regionCd:"GWANGJU",  entryRoute:"SELF",   status:"ACTIVE",      registeredAt:d("2024-03-20"),
      drugs:[{drugCd:"THC",isPrimary:true}],
      pii:{fullNameEnc:"enc:강유진",rrnEnc:"enc:880430-2890123",phoneEnc:"enc:010-7890-0007",addrEnc:"enc:광주시 북구"},
      drugUses:[{substanceCode:"THC",routeCode:"INHALE",firstUseAge:30,lastUseDate:d("2024-03-15"),injectionYn:false,overdoseHistoryYn:false,severityCode:"MILD"}],
      tests:[{testTypeCode:"URINE",testDate:d("2024-03-25"),testOrgNm:"광주기독병원",resultCode:"POSITIVE",resultDetail:{THC:"POSITIVE"}}],
      referrals:[],
    },
    {
      subjectId:"SUBJ-2024-0008", caseNo:"SUBJ-2024-0008", alias:"아자08",
      gender:"M", birthYear:1983, regionCd:"DAEJEON",  entryRoute:"AGENCY", status:"CLOSED",      registeredAt:d("2023-09-01"),
      drugs:[{drugCd:"FENTANYL",isPrimary:true}],
      pii:{fullNameEnc:"enc:윤재혁",rrnEnc:"enc:830615-1901234",phoneEnc:"enc:010-8901-0008",addrEnc:"enc:대전시 서구"},
      drugUses:[{substanceCode:"FENTANYL",routeCode:"INJECT",firstUseAge:38,lastUseDate:d("2023-08-20"),injectionYn:true,overdoseHistoryYn:true,overdoseCount:3,severityCode:"SEVERE",abstinentStartDate:d("2023-09-01")}],
      tests:[
        {testTypeCode:"BLOOD",testDate:d("2023-09-10"),testOrgNm:"충남대학교병원",resultCode:"POSITIVE",resultDetail:{FENTANYL:"POSITIVE"}},
        {testTypeCode:"URINE",testDate:d("2024-01-10"),testOrgNm:"충남대학교병원",resultCode:"NEGATIVE",resultDetail:{FENTANYL:"NEGATIVE"}},
        {testTypeCode:"HAIR", testDate:d("2024-04-10"),testOrgNm:"충남대학교병원",resultCode:"NEGATIVE",resultDetail:{FENTANYL:"NEGATIVE"}},
      ],
      referrals:[
        {referralType:"IN",fromOrg:"대전중독관리통합지원센터",referralDate:d("2023-08-28"),statusCode:"CLOSED",summary:"자의 의뢰"},
        {referralType:"RETURN",fromOrg:"충남대학교병원",toOrg:"대전중독관리통합지원센터",referralDate:d("2024-05-01"),statusCode:"CLOSED",summary:"치료 완료 후 회송"},
      ],
    },
    {
      subjectId:"SUBJ-2024-0009", caseNo:"SUBJ-2024-0009", alias:"자차09",
      gender:"M", birthYear:1995, regionCd:"GYEONGGI",entryRoute:"1342",   status:"ACTIVE",      registeredAt:d("2024-04-05"),
      drugs:[{drugCd:"METH",isPrimary:true},{drugCd:"HEROIN",isPrimary:false}],
      pii:{fullNameEnc:"enc:임태현",rrnEnc:"enc:950222-1012345",phoneEnc:"enc:010-0123-0009",addrEnc:"enc:경기도 성남시"},
      drugUses:[
        {substanceCode:"METH",routeCode:"INJECT",firstUseAge:24,lastUseDate:d("2024-04-01"),injectionYn:true,overdoseHistoryYn:false,severityCode:"MOD",polysubstanceYn:true},
        {substanceCode:"HEROIN",routeCode:"INJECT",firstUseAge:26,lastUseDate:d("2024-03-15"),injectionYn:true,overdoseHistoryYn:true,overdoseCount:1,severityCode:"MOD"},
      ],
      tests:[{testTypeCode:"URINE",testDate:d("2024-04-10"),testOrgNm:"분당서울대학교병원",resultCode:"POSITIVE",resultDetail:{METH:"POSITIVE",HEROIN:"POSITIVE"}}],
      referrals:[],
    },
    {
      subjectId:"SUBJ-2024-0010", caseNo:"SUBJ-2024-0010", alias:"차카10",
      gender:"F", birthYear:1997, regionCd:"SEOUL",    entryRoute:"SELF",   status:"ACTIVE",      registeredAt:d("2024-04-15"),
      drugs:[{drugCd:"COCAINE",isPrimary:true}],
      pii:{fullNameEnc:"enc:한소희",rrnEnc:"enc:970710-2123456",phoneEnc:"enc:010-1234-0010",addrEnc:"enc:서울시 송파구"},
      drugUses:[{substanceCode:"COCAINE",routeCode:"INHALE",firstUseAge:25,lastUseDate:d("2024-04-10"),injectionYn:false,overdoseHistoryYn:false,severityCode:"MILD"}],
      tests:[{testTypeCode:"SALIVA",testDate:d("2024-04-18"),testOrgNm:"서울아산병원",resultCode:"POSITIVE",resultDetail:{COCAINE:"POSITIVE"}}],
      referrals:[],
    },
    {
      subjectId:"SUBJ-2024-0011", caseNo:"SUBJ-2024-0011", alias:"카타11",
      gender:"M", birthYear:1980, regionCd:"BUSAN",    entryRoute:"LEGAL",  status:"MONITORING",  registeredAt:d("2024-04-20"),
      drugs:[{drugCd:"METH",isPrimary:true}],
      pii:{fullNameEnc:"enc:서진우",rrnEnc:"enc:800930-1234568",phoneEnc:"enc:010-2345-0011",addrEnc:"enc:부산시 사상구"},
      drugUses:[{substanceCode:"METH",routeCode:"INHALE",firstUseAge:32,lastUseDate:d("2024-04-15"),injectionYn:false,overdoseHistoryYn:false,severityCode:"MOD"}],
      tests:[
        {testTypeCode:"URINE",testDate:d("2024-04-25"),testOrgNm:"부산대학교병원",resultCode:"POSITIVE",resultDetail:{METH:"POSITIVE"}},
        {testTypeCode:"URINE",testDate:d("2024-07-25"),testOrgNm:"부산대학교병원",resultCode:"INCONCLUSIVE",resultDetail:{METH:"INCONCLUSIVE"}},
      ],
      referrals:[{referralType:"IN",fromOrg:"부산지방법원",referralDate:d("2024-04-18"),statusCode:"CLOSED",summary:"보호관찰 조건부 상담"}],
    },
    {
      subjectId:"SUBJ-2024-0012", caseNo:"SUBJ-2024-0012", alias:"타파12",
      gender:"F", birthYear:1993, regionCd:"INCHEON",  entryRoute:"1342",   status:"ACTIVE",      registeredAt:d("2024-05-03"),
      drugs:[{drugCd:"MDMA",isPrimary:true}],
      pii:{fullNameEnc:"enc:오지은",rrnEnc:"enc:930425-2345679",phoneEnc:"enc:010-3456-0012",addrEnc:"enc:인천시 연수구"},
      drugUses:[{substanceCode:"MDMA",routeCode:"ORAL",firstUseAge:23,lastUseDate:d("2024-04-28"),injectionYn:false,overdoseHistoryYn:false,severityCode:"MILD"}],
      tests:[{testTypeCode:"URINE",testDate:d("2024-05-08"),testOrgNm:"인하대학교병원",resultCode:"POSITIVE",resultDetail:{MDMA:"POSITIVE"}}],
      referrals:[],
    },
    {
      subjectId:"SUBJ-2024-0013", caseNo:"SUBJ-2024-0013", alias:"파하13",
      gender:"M", birthYear:1987, regionCd:"SEOUL",    entryRoute:"AGENCY", status:"ACTIVE",      registeredAt:d("2024-05-15"),
      drugs:[{drugCd:"HEROIN",isPrimary:true},{drugCd:"FENTANYL",isPrimary:false}],
      pii:{fullNameEnc:"enc:문성준",rrnEnc:"enc:871120-1456780",phoneEnc:"enc:010-4567-0013",addrEnc:"enc:서울시 은평구"},
      drugUses:[{substanceCode:"HEROIN",routeCode:"INJECT",firstUseAge:29,lastUseDate:d("2024-05-10"),injectionYn:true,overdoseHistoryYn:true,overdoseCount:2,severityCode:"SEVERE",polysubstanceYn:true}],
      tests:[{testTypeCode:"BLOOD",testDate:d("2024-05-20"),testOrgNm:"서울대학교병원",resultCode:"POSITIVE",resultDetail:{HEROIN:"POSITIVE",FENTANYL:"POSITIVE"}}],
      referrals:[
        {referralType:"IN",fromOrg:"은평구정신건강복지센터",referralDate:d("2024-05-13"),statusCode:"CLOSED",summary:"중독 위기 개입 연계"},
        {referralType:"OUT",toOrg:"국립서울병원",referralDate:d("2024-05-25"),statusCode:"IN_PROGRESS",summary:"입원 치료 연계"},
      ],
    },
    {
      subjectId:"SUBJ-2024-0014", caseNo:"SUBJ-2024-0014", alias:"하가14",
      gender:"F", birthYear:2002, regionCd:"GYEONGGI",entryRoute:"SELF",   status:"ACTIVE",      registeredAt:d("2024-06-01"),
      drugs:[{drugCd:"THC",isPrimary:true}],
      pii:{fullNameEnc:"enc:배지현",rrnEnc:"enc:020815-4567891",phoneEnc:"enc:010-5678-0014",addrEnc:"enc:경기도 화성시"},
      drugUses:[{substanceCode:"THC",routeCode:"INHALE",firstUseAge:20,lastUseDate:d("2024-05-25"),injectionYn:false,overdoseHistoryYn:false,severityCode:"MILD"}],
      tests:[{testTypeCode:"URINE",testDate:d("2024-06-05"),testOrgNm:"화성시의료원",resultCode:"POSITIVE",resultDetail:{THC:"POSITIVE"}}],
      referrals:[],
    },
    {
      subjectId:"SUBJ-2024-0015", caseNo:"SUBJ-2024-0015", alias:"나라15",
      gender:"M", birthYear:1972, regionCd:"ULSAN",    entryRoute:"LEGAL",  status:"CLOSED",      registeredAt:d("2023-06-01"),
      drugs:[{drugCd:"METH",isPrimary:true}],
      pii:{fullNameEnc:"enc:장민철",rrnEnc:"enc:720503-1678902",phoneEnc:"enc:010-6789-0015",addrEnc:"enc:울산시 남구"},
      drugUses:[{substanceCode:"METH",routeCode:"INJECT",firstUseAge:40,lastUseDate:d("2023-05-20"),injectionYn:true,overdoseHistoryYn:false,severityCode:"SEVERE",abstinentStartDate:d("2023-06-01")}],
      tests:[
        {testTypeCode:"URINE",testDate:d("2023-06-10"),testOrgNm:"울산대학교병원",resultCode:"POSITIVE",resultDetail:{METH:"POSITIVE"}},
        {testTypeCode:"URINE",testDate:d("2023-09-10"),testOrgNm:"울산대학교병원",resultCode:"NEGATIVE",resultDetail:{METH:"NEGATIVE"}},
        {testTypeCode:"HAIR", testDate:d("2024-03-10"),testOrgNm:"울산대학교병원",resultCode:"NEGATIVE",resultDetail:{METH:"NEGATIVE"}},
      ],
      referrals:[{referralType:"IN",fromOrg:"울산지방검찰청",referralDate:d("2023-05-25"),statusCode:"CLOSED",summary:"검찰 연계 치료명령"}],
    },
    {
      subjectId:"SUBJ-2025-0001", caseNo:"SUBJ-2025-0001", alias:"다마16",
      gender:"M", birthYear:1991, regionCd:"SEOUL",    entryRoute:"1342",   status:"ACTIVE",      registeredAt:d("2025-01-08"),
      drugs:[{drugCd:"METH",isPrimary:true}],
      pii:{fullNameEnc:"enc:고준혁",rrnEnc:"enc:910901-1789013",phoneEnc:"enc:010-7890-0016",addrEnc:"enc:서울시 노원구"},
      drugUses:[{substanceCode:"METH",routeCode:"INHALE",firstUseAge:29,lastUseDate:d("2024-12-30"),injectionYn:false,overdoseHistoryYn:false,severityCode:"MOD"}],
      tests:[{testTypeCode:"URINE",testDate:d("2025-01-15"),testOrgNm:"국립과학수사연구원",resultCode:"POSITIVE",resultDetail:{METH:"POSITIVE"}}],
      referrals:[],
    },
    {
      subjectId:"SUBJ-2025-0002", caseNo:"SUBJ-2025-0002", alias:"라바17",
      gender:"F", birthYear:1998, regionCd:"BUSAN",    entryRoute:"SELF",   status:"ACTIVE",      registeredAt:d("2025-01-20"),
      drugs:[{drugCd:"COCAINE",isPrimary:true},{drugCd:"MDMA",isPrimary:false}],
      pii:{fullNameEnc:"enc:신아영",rrnEnc:"enc:980614-2890124",phoneEnc:"enc:010-8901-0017",addrEnc:"enc:부산시 동래구"},
      drugUses:[{substanceCode:"COCAINE",routeCode:"INHALE",firstUseAge:24,lastUseDate:d("2025-01-15"),injectionYn:false,overdoseHistoryYn:false,severityCode:"MILD"}],
      tests:[{testTypeCode:"SALIVA",testDate:d("2025-01-25"),testOrgNm:"부산의료원",resultCode:"POSITIVE",resultDetail:{COCAINE:"POSITIVE"}}],
      referrals:[],
    },
    {
      subjectId:"SUBJ-2025-0003", caseNo:"SUBJ-2025-0003", alias:"마사18",
      gender:"M", birthYear:1986, regionCd:"GYEONGGI",entryRoute:"LEGAL",  status:"MONITORING",  registeredAt:d("2025-02-10"),
      drugs:[{drugCd:"METH",isPrimary:true},{drugCd:"COCAINE",isPrimary:false}],
      pii:{fullNameEnc:"enc:류동훈",rrnEnc:"enc:860227-1901235",phoneEnc:"enc:010-0123-0018",addrEnc:"enc:경기도 안산시"},
      drugUses:[{substanceCode:"METH",routeCode:"INJECT",firstUseAge:33,lastUseDate:d("2025-02-05"),injectionYn:true,overdoseHistoryYn:true,overdoseCount:1,severityCode:"SEVERE",polysubstanceYn:true}],
      tests:[{testTypeCode:"URINE",testDate:d("2025-02-15"),testOrgNm:"안산중앙병원",resultCode:"POSITIVE",resultDetail:{METH:"POSITIVE",COCAINE:"POSITIVE"}}],
      referrals:[{referralType:"IN",fromOrg:"안산지방법원",referralDate:d("2025-02-07"),statusCode:"CLOSED",summary:"치료감호 조건부 연계"}],
    },
    {
      subjectId:"SUBJ-2025-0004", caseNo:"SUBJ-2025-0004", alias:"바아19",
      gender:"F", birthYear:1994, regionCd:"DAEGU",    entryRoute:"AGENCY", status:"ACTIVE",      registeredAt:d("2025-02-25"),
      drugs:[{drugCd:"THC",isPrimary:true}],
      pii:{fullNameEnc:"enc:조은서",rrnEnc:"enc:940318-2012346",phoneEnc:"enc:010-1234-0019",addrEnc:"enc:대구시 수성구"},
      drugUses:[{substanceCode:"THC",routeCode:"ORAL",firstUseAge:27,lastUseDate:d("2025-02-20"),injectionYn:false,overdoseHistoryYn:false,severityCode:"MILD"}],
      tests:[{testTypeCode:"URINE",testDate:d("2025-03-01"),testOrgNm:"경북대학교병원",resultCode:"POSITIVE",resultDetail:{THC:"POSITIVE"}}],
      referrals:[],
    },
    {
      subjectId:"SUBJ-2025-0005", caseNo:"SUBJ-2025-0005", alias:"사자20",
      gender:"M", birthYear:1982, regionCd:"JEONBUK",  entryRoute:"1342",   status:"ACTIVE",      registeredAt:d("2025-03-01"),
      drugs:[{drugCd:"FENTANYL",isPrimary:true}],
      pii:{fullNameEnc:"enc:권병찬",rrnEnc:"enc:820711-1123457",phoneEnc:"enc:010-2345-0020",addrEnc:"enc:전북 전주시"},
      drugUses:[{substanceCode:"FENTANYL",routeCode:"INJECT",firstUseAge:38,lastUseDate:d("2025-02-25"),injectionYn:true,overdoseHistoryYn:true,overdoseCount:2,severityCode:"SEVERE"}],
      tests:[{testTypeCode:"BLOOD",testDate:d("2025-03-05"),testOrgNm:"전북대학교병원",resultCode:"POSITIVE",resultDetail:{FENTANYL:"POSITIVE"}}],
      referrals:[{referralType:"IN",fromOrg:"전주1342센터",referralDate:d("2025-02-28"),statusCode:"IN_PROGRESS",summary:"자의 신고 후 연계"}],
    },
  ];

  for (const s of subjects) {
    if (await prisma.subject.findUnique({ where: { subjectId: s.subjectId } })) {
      console.log(`  ⏭ 이미 존재: ${s.caseNo}`);
      continue;
    }
    const { drugs, pii, drugUses, tests, referrals, ...subjectData } = s;
    await prisma.subject.create({ data: subjectData });
    for (const d2 of drugs)    await prisma.subjectDrug.create({ data: { subjectId: s.subjectId, ...d2 } });
    await prisma.subjectPii.create({ data: { subjectId: s.subjectId, ...pii } });
    for (const du of drugUses) await prisma.naMemberDrugUse.create({ data: { subjectId: s.subjectId, ...du as object } });
    for (const t  of tests)    await prisma.naMemberTest.create({ data: { subjectId: s.subjectId, ...t as object } });
    for (const r  of referrals)await prisma.naMemberReferral.create({ data: { subjectId: s.subjectId, ...r as object } });
    console.log(`  ✅ ${s.caseNo} (${s.alias})`);
  }

  // ===================================================================
  // 6. 접수 (Intake) — 12건
  // ===================================================================
  console.log("📥 접수 샘플 데이터 입력 중...");

  const intakeSeeds = [
    { intakeNo:"IN-2024-0001", source:"1342",   regionCd:"SEOUL",    triage:"HIGH",  consent:true,  subjectId:"SUBJ-2024-0001", intakeStep:"CONVERT", summary:"1342 신고 → 긴급 중재, 동의 후 사례 전환", preferredCenter:"CTR-SEO-001", assignedCenter:"CTR-SEO-001" },
    { intakeNo:"IN-2024-0002", source:"WALKIN",  regionCd:"BUSAN",    triage:"MID",   consent:true,  subjectId:"SUBJ-2024-0002", intakeStep:"CONVERT", summary:"센터 직접 방문", preferredCenter:"CTR-BUS-001", assignedCenter:"CTR-BUS-001" },
    { intakeNo:"IN-2024-0003", source:"AGENCY",  regionCd:"GYEONGGI", triage:"HIGH",  consent:true,  subjectId:"SUBJ-2024-0003", intakeStep:"CONVERT", summary:"법원 연계 의뢰", preferredCenter:"CTR-GGI-001", assignedCenter:"CTR-GGI-001" },
    { intakeNo:"IN-2024-0004", source:"ONLINE",  regionCd:"INCHEON",  triage:"MID",   consent:true,  subjectId:"SUBJ-2024-0004", intakeStep:"CONVERT", summary:"온라인 상담 신청", preferredCenter:"CTR-ICN-001", assignedCenter:"CTR-ICN-001" },
    { intakeNo:"IN-2024-0005", source:"1342",    regionCd:"SEOUL",    triage:"LOW",   consent:true,  subjectId:"SUBJ-2024-0005", intakeStep:"CONVERT", summary:"1342 자의 연락", preferredCenter:"CTR-SEO-001", assignedCenter:"CTR-SEO-001" },
    { intakeNo:"IN-2024-0006", source:"AGENCY",  regionCd:"DAEGU",    triage:"HIGH",  consent:true,  subjectId:"SUBJ-2024-0006", intakeStep:"CONVERT", summary:"검찰청 연계", preferredCenter:null, assignedCenter:null },
    { intakeNo:"IN-2024-0007", source:"WALKIN",  regionCd:"GWANGJU",  triage:"LOW",   consent:true,  subjectId:"SUBJ-2024-0007", intakeStep:"CONVERT", summary:"직접 방문 상담 신청" , preferredCenter:null, assignedCenter:null },
    { intakeNo:"IN-2024-0008", source:"AGENCY",  regionCd:"DAEJEON",  triage:"EMERG", consent:true,  subjectId:"SUBJ-2024-0008", intakeStep:"CONVERT", summary:"과다복용 응급 연계", preferredCenter:null, assignedCenter:null },
    { intakeNo:"IN-2024-0009", source:"1342",    regionCd:"GYEONGGI", triage:"HIGH",  consent:true,  subjectId:"SUBJ-2024-0009", intakeStep:"CONVERT", summary:"복합물질 의존 신고", preferredCenter:"CTR-GGI-001", assignedCenter:"CTR-GGI-001" },
    { intakeNo:"IN-2024-0010", source:"ONLINE",  regionCd:"SEOUL",    triage:"LOW",   consent:false, subjectId:null,              intakeStep:"SCREEN",  summary:"익명 온라인 상담 접수 → 동의 미획득 대기", preferredCenter:null, assignedCenter:null },
    { intakeNo:"IN-2025-0001", source:"1342",    regionCd:"SEOUL",    triage:"MID",   consent:true,  subjectId:"SUBJ-2025-0001", intakeStep:"CONVERT", summary:"신규 접수", preferredCenter:"CTR-SEO-001", assignedCenter:"CTR-SEO-001" },
    { intakeNo:"IN-2025-0002", source:"WALKIN",  regionCd:"BUSAN",    triage:"LOW",   consent:true,  subjectId:"SUBJ-2025-0002", intakeStep:"CONVERT", summary:"센터 방문 자의 접수", preferredCenter:"CTR-BUS-001", assignedCenter:"CTR-BUS-001" },
  ];

  const intakeIdMap: Record<string, bigint> = {};
  for (const row of intakeSeeds) {
    const exists = await prisma.intake.findUnique({ where: { intakeNo: row.intakeNo } });
    if (exists) { intakeIdMap[row.intakeNo] = exists.intakeId; continue; }
    const created = await prisma.intake.create({ data: {
      intakeNo: row.intakeNo, source: row.source, regionCd: row.regionCd,
      triage: row.triage, consent: row.consent, summary: row.summary,
      preferredCenter: row.preferredCenter ?? undefined,
      assignedCenter: row.assignedCenter ?? undefined,
      intakeStep: row.intakeStep,
      subjectId: row.subjectId ?? undefined,
    }});
    intakeIdMap[row.intakeNo] = created.intakeId;
    // 접수 단계 로그
    if (row.intakeStep === "CONVERT") {
      for (const step of ["QUEUE","SCREEN","CONSENT","ASSIGN","CONVERT"]) {
        await prisma.intakeStepLog.create({ data: { intakeId: created.intakeId, step, doneBy: "시스템" }});
      }
    } else {
      for (const step of ["QUEUE","SCREEN"]) {
        await prisma.intakeStepLog.create({ data: { intakeId: created.intakeId, step, doneBy: "시스템" }});
      }
    }
  }
  console.log(`  ✅ 접수 ${intakeSeeds.length}건 완료`);

  // ===================================================================
  // 7. 사례 (Case) + 상담 + 모니터링
  // ===================================================================
  console.log("📁 사례 / 상담 / 모니터링 샘플 입력 중...");

  const caseSeedMap: Record<string, bigint> = {};
  type CaseSeed = { subjectId: string; centerId: string; subjectLabel: string; status: string; triage: string };
  const caseSeeds: CaseSeed[] = [
    { subjectId:"SUBJ-2024-0001", centerId:"CTR-SEO-001", subjectLabel:"가나01", status:"IN_PROGRESS", triage:"HIGH" },
    { subjectId:"SUBJ-2024-0002", centerId:"CTR-BUS-001", subjectLabel:"나다02", status:"IN_PROGRESS", triage:"MID"  },
    { subjectId:"SUBJ-2024-0003", centerId:"CTR-GGI-001", subjectLabel:"다라03", status:"MONITORING",  triage:"HIGH" },
    { subjectId:"SUBJ-2024-0004", centerId:"CTR-ICN-001", subjectLabel:"라마04", status:"IN_PROGRESS", triage:"MID"  },
    { subjectId:"SUBJ-2024-0005", centerId:"CTR-SEO-001", subjectLabel:"마바05", status:"IN_PROGRESS", triage:"LOW"  },
    { subjectId:"SUBJ-2024-0006", centerId:"CTR-SEO-001", subjectLabel:"바사06", status:"MONITORING",  triage:"HIGH" },
    { subjectId:"SUBJ-2024-0007", centerId:"CTR-SEO-001", subjectLabel:"사아07", status:"IN_PROGRESS", triage:"LOW"  },
    { subjectId:"SUBJ-2024-0008", centerId:"CTR-SEO-001", subjectLabel:"아자08", status:"CLOSED",      triage:"EMERG"},
    { subjectId:"SUBJ-2024-0009", centerId:"CTR-GGI-001", subjectLabel:"자차09", status:"IN_PROGRESS", triage:"HIGH" },
    { subjectId:"SUBJ-2024-0013", centerId:"CTR-SEO-001", subjectLabel:"파하13", status:"IN_PROGRESS", triage:"HIGH" },
    { subjectId:"SUBJ-2025-0001", centerId:"CTR-SEO-001", subjectLabel:"다마16", status:"IN_PROGRESS", triage:"MID"  },
    { subjectId:"SUBJ-2025-0003", centerId:"CTR-GGI-001", subjectLabel:"마사18", status:"MONITORING",  triage:"HIGH" },
  ];

  for (const cs of caseSeeds) {
    const existingCase = await prisma.case.findFirst({ where: { subjectId: cs.subjectId } });
    if (existingCase) { caseSeedMap[cs.subjectId] = existingCase.caseId; continue; }
    const c = await prisma.case.create({ data: { ...cs } });
    caseSeedMap[cs.subjectId] = c.caseId;

    // 사례 이벤트
    await prisma.caseEvent.create({ data: { caseId: c.caseId, eventType:"INTAKE",     title:"접수 완료",   note:"초기 접수 및 긴급도 분류 완료" }});
    await prisma.caseEvent.create({ data: { caseId: c.caseId, eventType:"ASSESSMENT", title:"초기 평가",   note:"DSM-5 기반 중독 심각도 평가 실시" }});
    if (cs.status !== "CLOSED") {
      await prisma.caseEvent.create({ data: { caseId: c.caseId, eventType:"ISP",      title:"ISP 수립",    note:"개인서비스계획 초안 작성 및 서명" }});
    }

    // 사례 업무
    await prisma.caseTask.create({ data: { caseId: c.caseId, title:"초기 평가 면담 예약", dueAt: new Date(Date.now() + 7*24*3600*1000), status:"DONE" }});
    await prisma.caseTask.create({ data: { caseId: c.caseId, title:"약물검사 결과 확인",    dueAt: new Date(Date.now() + 14*24*3600*1000), status:"DOING" }});

    // 상담 기록 (2~3건)
    await prisma.counseling.create({ data: { caseId: c.caseId, counselAt: new Date(Date.now() - 60*24*3600*1000), duration:50, method:"FACE", summary:"초기 면담 — 동기 탐색 및 치료 목표 설정" }});
    await prisma.counseling.create({ data: { caseId: c.caseId, counselAt: new Date(Date.now() - 30*24*3600*1000), duration:50, method:"FACE", summary:"2차 면담 — 단약 의지 강화, 촉발요인 분석" }});
    if (cs.status === "MONITORING") {
      await prisma.counseling.create({ data: { caseId: c.caseId, counselAt: new Date(Date.now() - 10*24*3600*1000), duration:30, method:"PHONE", summary:"전화 상담 — 단약 유지 확인, 위기 없음" }});
    }

    // 모니터링 (모니터링·종결 상태만)
    if (cs.status === "MONITORING" || cs.status === "CLOSED") {
      await prisma.caseMonitoring.create({ data: { caseId: c.caseId, monitorAt: new Date(Date.now() - 45*24*3600*1000), method:"VISIT",  condition:"양호", note:"단약 유지 중, 직업 훈련 참여" }});
      await prisma.caseMonitoring.create({ data: { caseId: c.caseId, monitorAt: new Date(Date.now() - 15*24*3600*1000), method:"PHONE",  condition:"양호", note:"안정적 생활, 재발 위험 낮음", nextMonitor: new Date(Date.now() + 30*24*3600*1000) }});
    }

    // 종결 처리
    if (cs.status === "CLOSED") {
      await prisma.caseClosing.create({ data: { caseId: c.caseId, closingType:"GOAL_MET", closingDate: d("2024-06-01"), reason:"치료 목표 달성", outcome:"단약 유지 6개월, 직업 복귀 완료" }});
    }
  }
  console.log(`  ✅ 사례 ${caseSeeds.length}건 + 상담 · 모니터링 완료`);

  // ===================================================================
  // 8. 프로그램 (NaProgram)
  // ===================================================================
  console.log("📋 프로그램 샘플 입력 중...");

  const programs = [
    { programId:"PROG-2024-CBT-001", programName:"인지행동치료 기초 12주",  programType:"CBT",    durationWeeks:12, memo:"마약류 중독 회복 CBT" },
    { programId:"PROG-2024-GRP-001", programName:"회복 지지 집단상담",      programType:"GROUP",  durationWeeks:8,  memo:"동료 지지 집단 회복" },
    { programId:"PROG-2024-RHB-001", programName:"재활 직업훈련 프로그램",  programType:"REHAB",  durationWeeks:16, memo:"사회 복귀 직업 기술 훈련" },
    { programId:"PROG-2024-FAM-001", programName:"가족 교육 및 지지",       programType:"FAMILY", durationWeeks:6,  memo:"중독자 가족 심리교육" },
    { programId:"PROG-2025-CBT-001", programName:"고강도 CBT 집중 과정",    programType:"CBT",    durationWeeks:20, memo:"중증 중독자 대상 집중 CBT" },
  ];
  for (const p of programs) {
    await prisma.naProgram.upsert({ where: { programId: p.programId }, update: {}, create: p });
  }

  // 프로그램 회기
  const sessions = [
    { programId:"PROG-2024-CBT-001", sessionNo:1, sessionDate:d("2024-03-04"), location:"서울중독재활센터 3층", facilitator:"김상담" },
    { programId:"PROG-2024-CBT-001", sessionNo:2, sessionDate:d("2024-03-11"), location:"서울중독재활센터 3층", facilitator:"김상담" },
    { programId:"PROG-2024-CBT-001", sessionNo:3, sessionDate:d("2024-03-18"), location:"서울중독재활센터 3층", facilitator:"김상담" },
    { programId:"PROG-2024-CBT-001", sessionNo:4, sessionDate:d("2024-03-25"), location:"서울중독재활센터 3층", facilitator:"김상담" },
    { programId:"PROG-2024-GRP-001", sessionNo:1, sessionDate:d("2024-04-02"), location:"경기중독재활센터 집단상담실", facilitator:"이상담" },
    { programId:"PROG-2024-GRP-001", sessionNo:2, sessionDate:d("2024-04-09"), location:"경기중독재활센터 집단상담실", facilitator:"이상담" },
    { programId:"PROG-2024-GRP-001", sessionNo:3, sessionDate:d("2024-04-16"), location:"경기중독재활센터 집단상담실", facilitator:"이상담" },
    { programId:"PROG-2024-RHB-001", sessionNo:1, sessionDate:d("2024-05-06"), location:"부산중독재활센터 교육실", facilitator:"박강사" },
    { programId:"PROG-2024-RHB-001", sessionNo:2, sessionDate:d("2024-05-13"), location:"부산중독재활센터 교육실", facilitator:"박강사" },
    { programId:"PROG-2024-FAM-001", sessionNo:1, sessionDate:d("2024-06-03"), location:"서울중독재활센터 대강당", facilitator:"최교육" },
    { programId:"PROG-2024-FAM-001", sessionNo:2, sessionDate:d("2024-06-10"), location:"서울중독재활센터 대강당", facilitator:"최교육" },
    { programId:"PROG-2025-CBT-001", sessionNo:1, sessionDate:d("2025-02-03"), location:"경기중독재활센터 3층", facilitator:"정상담" },
    { programId:"PROG-2025-CBT-001", sessionNo:2, sessionDate:d("2025-02-10"), location:"경기중독재활센터 3층", facilitator:"정상담" },
  ];
  for (const s of sessions) {
    const ex = await prisma.naProgramSession.findUnique({ where: { programId_sessionNo: { programId: s.programId, sessionNo: s.sessionNo } } });
    if (!ex) await prisma.naProgramSession.create({ data: s });
  }

  // 프로그램 등록
  const enrollments = [
    { subjectId:"SUBJ-2024-0001", programId:"PROG-2024-CBT-001", enrollDate:d("2024-03-01"), statusCode:"ENROLLED" },
    { subjectId:"SUBJ-2024-0003", programId:"PROG-2024-CBT-001", enrollDate:d("2024-03-01"), statusCode:"COMPLETED" },
    { subjectId:"SUBJ-2024-0006", programId:"PROG-2024-CBT-001", enrollDate:d("2024-03-01"), statusCode:"DROPPED", dropReason:"개인 사정" },
    { subjectId:"SUBJ-2024-0009", programId:"PROG-2024-GRP-001", enrollDate:d("2024-04-01"), statusCode:"ENROLLED" },
    { subjectId:"SUBJ-2024-0011", programId:"PROG-2024-GRP-001", enrollDate:d("2024-04-01"), statusCode:"ENROLLED" },
    { subjectId:"SUBJ-2024-0013", programId:"PROG-2024-GRP-001", enrollDate:d("2024-04-01"), statusCode:"COMPLETED" },
    { subjectId:"SUBJ-2024-0008", programId:"PROG-2024-RHB-001", enrollDate:d("2024-05-01"), statusCode:"COMPLETED" },
    { subjectId:"SUBJ-2024-0015", programId:"PROG-2024-RHB-001", enrollDate:d("2024-05-01"), statusCode:"COMPLETED" },
    { subjectId:"SUBJ-2024-0002", programId:"PROG-2024-FAM-001", enrollDate:d("2024-06-01"), statusCode:"ENROLLED" },
    { subjectId:"SUBJ-2024-0005", programId:"PROG-2024-FAM-001", enrollDate:d("2024-06-01"), statusCode:"ENROLLED" },
    { subjectId:"SUBJ-2025-0001", programId:"PROG-2025-CBT-001", enrollDate:d("2025-01-15"), statusCode:"ENROLLED" },
    { subjectId:"SUBJ-2025-0003", programId:"PROG-2025-CBT-001", enrollDate:d("2025-02-15"), statusCode:"ENROLLED" },
  ];
  for (const e of enrollments) {
    const ex = await prisma.naMemberProgramEnroll.findUnique({ where: { subjectId_programId: { subjectId: e.subjectId, programId: e.programId } } });
    if (!ex) await prisma.naMemberProgramEnroll.create({ data: e });
  }
  console.log(`  ✅ 프로그램 ${programs.length}개 + 회기 ${sessions.length}개 + 등록 ${enrollments.length}건`);

  // ===================================================================
  // 9. 재활교육 — EduLegal (치료명령/기소유예)
  // ===================================================================
  console.log("🎓 재활교육 샘플 입력 중...");

  const eduLegals = [
    { subjectId:"SUBJ-2024-0001", legalType:"PROSECUTION_SUSPENDED", courtNm:"서울중앙지방법원", orderDate:d("2024-01-05"), startDate:d("2024-02-01"), endDate:d("2024-07-31"), hours:40, status:"COMPLETED" },
    { subjectId:"SUBJ-2024-0003", legalType:"TRAINING",              courtNm:"수원지방법원",     orderDate:d("2024-01-30"), startDate:d("2024-02-15"), endDate:d("2024-08-14"), hours:60, status:"IN_PROGRESS" },
    { subjectId:"SUBJ-2024-0006", legalType:"PROSECUTION_SUSPENDED", courtNm:"대구지방법원",     orderDate:d("2024-03-01"), startDate:d("2024-04-01"), endDate:d("2024-09-30"), hours:40, status:"IN_PROGRESS" },
    { subjectId:"SUBJ-2024-0008", legalType:"COMPLETION",            courtNm:"대전지방법원",     orderDate:d("2023-08-25"), startDate:d("2023-09-10"), endDate:d("2024-03-09"), hours:80, status:"COMPLETED" },
    { subjectId:"SUBJ-2024-0011", legalType:"TRAINING",              courtNm:"부산지방법원",     orderDate:d("2024-04-15"), startDate:d("2024-05-06"), endDate:d("2024-11-04"), hours:60, status:"IN_PROGRESS" },
    { subjectId:"SUBJ-2024-0015", legalType:"PROSECUTION_SUSPENDED", courtNm:"울산지방법원",     orderDate:d("2023-05-20"), startDate:d("2023-06-05"), endDate:d("2023-12-04"), hours:40, status:"COMPLETED" },
    { subjectId:"SUBJ-2025-0003", legalType:"TRAINING",              courtNm:"안산지원",         orderDate:d("2025-02-01"), startDate:d("2025-03-01"), endDate:d("2025-08-31"), hours:60, status:"SCHEDULED" },
  ];
  const eduLegalIds: bigint[] = [];
  for (const el of eduLegals) {
    const exists = await prisma.eduLegal.findFirst({ where: { subjectId: el.subjectId, legalType: el.legalType } });
    if (exists) { eduLegalIds.push(exists.eduId); continue; }
    const created = await prisma.eduLegal.create({ data: el });
    eduLegalIds.push(created.eduId);
    // 출석 기록 (완료된 건만 일부 추가)
    if (el.status === "COMPLETED") {
      for (let i = 0; i < 3; i++) {
        const attendDate = new Date(el.startDate!.getTime() + i * 14 * 24 * 3600 * 1000);
        await prisma.eduLegalAttendance.create({ data: { eduId: created.eduId, attendDate, hours: el.hours! / 3 | 0 } });
      }
    }
  }

  // EduOutreach (찾아가는 교육)
  const outreachItems = [
    { outreachDate:d("2024-02-20"), location:"서울 강남구 청소년 수련관",  staffCount:3, targetCount:45, note:"청소년 마약 예방 교육" },
    { outreachDate:d("2024-04-15"), location:"부산 해운대구 주민센터",     staffCount:2, targetCount:30, note:"지역사회 중독 예방 캠페인" },
    { outreachDate:d("2024-06-10"), location:"경기 수원 고등학교",         staffCount:4, targetCount:120,note:"학교 방문 마약 예방 교육" },
    { outreachDate:d("2024-09-05"), location:"인천 남동구 산업단지",       staffCount:2, targetCount:50, note:"직장인 대상 예방 교육" },
    { outreachDate:d("2025-01-20"), location:"서울 노원구 복지관",         staffCount:3, targetCount:35, note:"취약계층 중독 예방 교육" },
    { outreachDate:d("2025-02-18"), location:"대구 달서구 청소년 센터",    staffCount:2, targetCount:60, note:"청소년 마약 예방 교육" },
  ];
  for (const o of outreachItems) {
    const ex = await prisma.eduOutreach.findFirst({ where: { outreachDate: o.outreachDate } });
    if (!ex) await prisma.eduOutreach.create({ data: o });
  }
  console.log(`  ✅ 재활교육(치료명령) ${eduLegals.length}건 + 찾아가는교육 ${outreachItems.length}건`);

  // ===================================================================
  // 완료
  // ===================================================================
  console.log("\n✅ Seed 완료!");
  console.log("   대상자 20명 | 접수 12건 | 사례 12건 | 상담·모니터링");
  console.log("   프로그램 5개 | 회기 13건 | 등록 12건");
  console.log("   치료명령 7건 | 찾아가는교육 6건");
  console.log("   검사결과 · 의뢰연계 → 대상자별 포함");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
