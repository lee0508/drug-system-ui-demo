import { Case, Center, Intake, IntegrationConnector, IntegrationLog, ISPPlan, Resource, Subject, SystemUser } from "./types";

export const mockIntakes: Intake[] = [
  {
    id: "IN-1001",
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    source: "1342",
    region: "서울",
    triage: "MID",
    consent: true,
    summary: "재사용 우려. 가족 갈등 및 불안 호소. 대면 상담 요청.",
    preferredCenter: "서울센터",
  },
  {
    id: "IN-1002",
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    source: "ONLINE",
    region: "경기",
    triage: "LOW",
    consent: false,
    summary: "단기교육 문의. 익명 상담 희망. 기초정보 제공 요청.",
  },
  {
    id: "IN-1003",
    createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    source: "AGENCY",
    region: "부산",
    triage: "HIGH",
    consent: true,
    summary: "기관 의뢰. 프로그램 이수 확인 필요. 초기개입 우선.",
    preferredCenter: "부산센터",
  },
];

export const mockCases: Case[] = [
  {
    id: "CA-2001",
    subjectLabel: "CASE-000231",
    region: "서울",
    status: "IN_PROGRESS",
    triage: "MID",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    lastUpdatedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    intakeId: "IN-0901",
    events: [
      { at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), type: "INTAKE", title: "접수(1342 이관)", note: "동의 확보 후 센터 배정" },
      { at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(), type: "ASSESSMENT", title: "초기 사정(스크리닝)", note: "중증도 MID, 가족개입 필요" },
      { at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), type: "ISP", title: "ISP v1 수립", note: "상담+주간프로그램+가족교육" },
      { at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), type: "INTERVENTION", title: "주간프로그램 1회차", note: "출석" },
      { at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), type: "MONITORING", title: "모니터링", note: "재사용 트리거 없음" },
    ],
    tasks: [
      { id: "T-1", title: "가족 상담 일정 확정", dueAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(), status: "TODO" },
      { id: "T-2", title: "주간프로그램 2회차 안내", dueAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4).toISOString(), status: "DOING" },
    ],
    isp: {
      caseId: "CA-2001",
      version: 1,
      problems: ["재사용 위험", "가족갈등", "불안/수면 문제"],
      goals: [
        { id: "G-1", horizon: "SHORT", goal: "2주간 프로그램 출석률 80% 이상", metric: "출석률", due: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString() },
        { id: "G-2", horizon: "MID", goal: "가족 갈등 완화(가족상담 2회)", metric: "상담 횟수", due: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45).toISOString() },
      ],
      interventions: [
        { id: "I-1", category: "COUNSELING", action: "개별상담 주 1회", owner: "사례관리자", schedule: "매주" },
        { id: "I-2", category: "PROGRAM", action: "주간 재활프로그램 참여", owner: "센터", schedule: "주 1회" },
        { id: "I-3", category: "FAMILY", action: "가족교육/상담 연계", owner: "상담사", schedule: "격주" },
      ],
      reviewCycle: "MONTHLY",
      crisisPlan: "재사용 의심 시 즉시 콜백 및 대면상담(필요 시 의료기관 연계)",
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    } as ISPPlan,
  },
];

export const mockConnectors: IntegrationConnector[] = [
  { id: "C-EA-1", name: "마약류통합관리시스템", group: "EA", status: "OK", lastSyncAt: new Date(Date.now() - 1000 * 60 * 12).toISOString() },
  { id: "C-EA-2", name: "예방·재활 전문인력 인증·관리", group: "EA", status: "DEGRADED", lastSyncAt: new Date(Date.now() - 1000 * 60 * 55).toISOString() },
  { id: "C-AD-1", name: "법무부 연계", group: "ADMIN", status: "OK", lastSyncAt: new Date(Date.now() - 1000 * 60 * 25).toISOString() },
  { id: "C-AD-2", name: "검찰 연계", group: "ADMIN", status: "DOWN" },
  { id: "C-AD-3", name: "경찰청 연계", group: "ADMIN", status: "OK", lastSyncAt: new Date(Date.now() - 1000 * 60 * 40).toISOString() },
  { id: "C-AD-4", name: "MHIS 정신건강 사례관리", group: "ADMIN", status: "OK", lastSyncAt: new Date(Date.now() - 1000 * 60 * 80).toISOString() },
];

export const mockSubjects: Subject[] = [
  { id: "SB-001", caseNo: "SUBJ-000101", alias: "김*수", gender: "M", birthYear: 1985, region: "서울", drugTypes: ["필로폰"], entryRoute: "1342", registeredAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(), status: "ACTIVE" },
  { id: "SB-002", caseNo: "SUBJ-000102", alias: "이*영", gender: "F", birthYear: 1992, region: "경기", drugTypes: ["대마", "향정"], entryRoute: "LEGAL", registeredAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(), status: "MONITORING" },
  { id: "SB-003", caseNo: "SUBJ-000103", alias: "박*준", gender: "M", birthYear: 1978, region: "부산", drugTypes: ["필로폰"], entryRoute: "AGENCY", registeredAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(), status: "CLOSED" },
  { id: "SB-004", caseNo: "SUBJ-000104", alias: "최*희", gender: "F", birthYear: 1999, region: "대구", drugTypes: ["향정"], entryRoute: "SELF", registeredAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), status: "ACTIVE" },
];

export const mockCenters: Center[] = [
  { id: "CT-01", name: "서울중독재활센터", region: "서울", address: "서울 종로구 세종대로 12", phone: "02-1234-5678", manager: "홍길동", capacity: 50, activeCases: 38 },
  { id: "CT-02", name: "경기북부중독재활센터", region: "경기", address: "경기 의정부시 신흥로 45", phone: "031-9876-5432", manager: "김철수", capacity: 40, activeCases: 27 },
  { id: "CT-03", name: "부산중독재활센터", region: "부산", address: "부산 부산진구 중앙대로 89", phone: "051-3456-7890", manager: "이영희", capacity: 35, activeCases: 22 },
];

export const mockUsers: SystemUser[] = [
  { id: "U-01", name: "관리자", centerId: "CT-01", centerName: "서울중독재활센터", role: "ADMIN", email: "admin@center.go.kr", active: true, lastLoginAt: new Date(Date.now() - 1000 * 60 * 10).toISOString() },
  { id: "U-02", name: "홍길동", centerId: "CT-01", centerName: "서울중독재활센터", role: "COUNSELOR", email: "hong@center.go.kr", active: true, lastLoginAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
  { id: "U-03", name: "김철수", centerId: "CT-02", centerName: "경기북부중독재활센터", role: "MANAGER", email: "kim@center.go.kr", active: true, lastLoginAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
  { id: "U-04", name: "이영희", centerId: "CT-03", centerName: "부산중독재활센터", role: "COUNSELOR", email: "lee@center.go.kr", active: false },
];

export const mockResources: Resource[] = [
  { id: "R-01", name: "서울의료원 정신건강의학과", type: "MEDICAL", region: "서울", phone: "02-2600-1234", address: "서울 중랑구 신내로 156", note: "입원 연계 가능" },
  { id: "R-02", name: "종로종합사회복지관", type: "WELFARE", region: "서울", phone: "02-765-0001", address: "서울 종로구 창경궁로 7", note: "생계지원·주거지원" },
  { id: "R-03", name: "대한법률구조공단 서울지부", type: "LEGAL", region: "서울", phone: "02-3482-7991", address: "서울 서초구 법원로 5" },
  { id: "R-04", name: "마약류중독자 자조모임(NA)", type: "SELF_HELP", region: "전국", phone: "02-555-1212", address: "온라인/대면 병행", note: "매주 화·목 19시" },
];

export const mockLogs: IntegrationLog[] = [
  {
    id: "L-1",
    at: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    connectorId: "C-EA-1",
    direction: "OUT",
    message: "일일 통계(기초통계) 전송",
    result: "SUCCESS",
  },
  {
    id: "L-2",
    at: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    connectorId: "C-AD-2",
    direction: "OUT",
    message: "이수명령 이수상태 회신",
    result: "FAIL",
  },
];
