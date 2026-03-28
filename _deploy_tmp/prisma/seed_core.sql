-- =========================================================
-- Drug Addiction Rehab Management System - Core Seed (PostgreSQL 15+)
-- 스키마(schema.prisma) 컬럼에 맞게 수정된 버전
-- =========================================================

BEGIN;

-- ─────────────────────────────────────────────────────────────
-- 0) 코드 그룹 (tb_code_group)
-- ─────────────────────────────────────────────────────────────
INSERT INTO tb_code_group (group_cd, group_nm, description, sort_order, is_active)
VALUES
  ('GENDER',         '성별',              'M/F 등 성별 코드',                        10, TRUE),
  ('ENTRY_ROUTE',    '유입경로',          '1342/자진/기관연계/사법 등',               20, TRUE),
  ('DRUG_TYPE',      '마약 유형',         '필로폰/대마/향정/마약 등',                30, TRUE),
  ('TRIAGE',         '긴급도',            'LOW/MID/HIGH/EMERG',                      40, TRUE),
  ('INTAKE_STATUS',  '접수 상태',         'QUEUE/SCREEN/CONSENT/ASSIGN/DONE',        50, TRUE),
  ('CASE_STATUS',    '사례 상태',         'NEW/IN_PROGRESS/MONITORING/CLOSED',       60, TRUE),
  ('TASK_STATUS',    '업무 상태',         'TODO/DOING/DONE',                         70, TRUE),
  ('COUNSEL_TYPE',   '상담 유형',         '내방/전화/가정방문/집단 등',              80, TRUE),
  ('CONTACT_METHOD', '접촉 방식',         'VISIT/CALL/MESSAGE/OTHER',                90, TRUE),
  ('CONTACT_RESULT', '접촉 결과',         'STABLE/ALERT/CRISIS/NO_CONTACT',         100, TRUE),
  ('REFERRAL_STATUS','연계 상태',         'OPEN/IN_PROGRESS/DONE/FAIL',             110, TRUE),
  ('RESOURCE_TYPE',  '자원 유형',         'MEDICAL/WELFARE/LEGAL/EMPLOYMENT...',    120, TRUE),
  ('CLOSING_REASON', '종결 사유',         'RECOVERY/REFERRAL/DROPOUT/DEATH/OTHER', 130, TRUE)
ON CONFLICT (group_cd)
DO UPDATE SET
  group_nm    = EXCLUDED.group_nm,
  description = EXCLUDED.description,
  sort_order  = EXCLUDED.sort_order,
  is_active   = EXCLUDED.is_active;

-- ─────────────────────────────────────────────────────────────
-- 1) 코드 값 (tb_code)
-- ─────────────────────────────────────────────────────────────

-- 성별
INSERT INTO tb_code (group_cd, code, code_nm, code_nm_en, sort_order, is_active)
VALUES
  ('GENDER','M','남','Male',1,TRUE),
  ('GENDER','F','여','Female',2,TRUE)
ON CONFLICT (group_cd, code) DO UPDATE SET
  code_nm=EXCLUDED.code_nm, code_nm_en=EXCLUDED.code_nm_en,
  sort_order=EXCLUDED.sort_order, is_active=EXCLUDED.is_active;

-- 유입경로
INSERT INTO tb_code (group_cd, code, code_nm, code_nm_en, sort_order, is_active)
VALUES
  ('ENTRY_ROUTE','1342','1342 콜센터','Call Center 1342',1,TRUE),
  ('ENTRY_ROUTE','SELF','자진','Self',2,TRUE),
  ('ENTRY_ROUTE','AGENCY','기관 연계','Agency',3,TRUE),
  ('ENTRY_ROUTE','LEGAL','사법/법원/검찰','Legal',4,TRUE),
  ('ENTRY_ROUTE','ONLINE','온라인','Online',5,TRUE),
  ('ENTRY_ROUTE','WALKIN','내방','Walk-in',6,TRUE)
ON CONFLICT (group_cd, code) DO UPDATE SET
  code_nm=EXCLUDED.code_nm, code_nm_en=EXCLUDED.code_nm_en,
  sort_order=EXCLUDED.sort_order, is_active=EXCLUDED.is_active;

-- 마약 유형
INSERT INTO tb_code (group_cd, code, code_nm, code_nm_en, sort_order, is_active)
VALUES
  ('DRUG_TYPE','PHILOPON','필로폰','Methamphetamine',1,TRUE),
  ('DRUG_TYPE','CANNABIS','대마','Cannabis',2,TRUE),
  ('DRUG_TYPE','HYPNOTIC','향정','Psychotropics',3,TRUE),
  ('DRUG_TYPE','OPIATE','마약','Narcotics',4,TRUE),
  ('DRUG_TYPE','ETC','기타','Others',99,TRUE)
ON CONFLICT (group_cd, code) DO UPDATE SET
  code_nm=EXCLUDED.code_nm, code_nm_en=EXCLUDED.code_nm_en,
  sort_order=EXCLUDED.sort_order, is_active=EXCLUDED.is_active;

-- 긴급도
INSERT INTO tb_code (group_cd, code, code_nm, code_nm_en, sort_order, is_active)
VALUES
  ('TRIAGE','LOW','낮음','Low',1,TRUE),
  ('TRIAGE','MID','중간','Medium',2,TRUE),
  ('TRIAGE','HIGH','높음','High',3,TRUE),
  ('TRIAGE','EMERG','응급','Emergency',4,TRUE)
ON CONFLICT (group_cd, code) DO UPDATE SET
  code_nm=EXCLUDED.code_nm, code_nm_en=EXCLUDED.code_nm_en,
  sort_order=EXCLUDED.sort_order, is_active=EXCLUDED.is_active;

-- 접수 상태
INSERT INTO tb_code (group_cd, code, code_nm, code_nm_en, sort_order, is_active)
VALUES
  ('INTAKE_STATUS','QUEUE','대기','Queue',1,TRUE),
  ('INTAKE_STATUS','SCREEN','스크리닝','Screening',2,TRUE),
  ('INTAKE_STATUS','CONSENT','동의','Consent',3,TRUE),
  ('INTAKE_STATUS','ASSIGN','배정','Assign',4,TRUE),
  ('INTAKE_STATUS','DONE','완료','Done',5,TRUE)
ON CONFLICT (group_cd, code) DO UPDATE SET
  code_nm=EXCLUDED.code_nm, code_nm_en=EXCLUDED.code_nm_en,
  sort_order=EXCLUDED.sort_order, is_active=EXCLUDED.is_active;

-- 사례 상태
INSERT INTO tb_code (group_cd, code, code_nm, code_nm_en, sort_order, is_active)
VALUES
  ('CASE_STATUS','NEW','신규','New',1,TRUE),
  ('CASE_STATUS','IN_PROGRESS','진행','In Progress',2,TRUE),
  ('CASE_STATUS','MONITORING','모니터링','Monitoring',3,TRUE),
  ('CASE_STATUS','CLOSED','종결','Closed',4,TRUE)
ON CONFLICT (group_cd, code) DO UPDATE SET
  code_nm=EXCLUDED.code_nm, code_nm_en=EXCLUDED.code_nm_en,
  sort_order=EXCLUDED.sort_order, is_active=EXCLUDED.is_active;

-- 업무 상태
INSERT INTO tb_code (group_cd, code, code_nm, code_nm_en, sort_order, is_active)
VALUES
  ('TASK_STATUS','TODO','예정','To Do',1,TRUE),
  ('TASK_STATUS','DOING','진행중','Doing',2,TRUE),
  ('TASK_STATUS','DONE','완료','Done',3,TRUE)
ON CONFLICT (group_cd, code) DO UPDATE SET
  code_nm=EXCLUDED.code_nm, code_nm_en=EXCLUDED.code_nm_en,
  sort_order=EXCLUDED.sort_order, is_active=EXCLUDED.is_active;

-- 상담 유형
INSERT INTO tb_code (group_cd, code, code_nm, code_nm_en, sort_order, is_active)
VALUES
  ('COUNSEL_TYPE','VISIT','내방','Visit',1,TRUE),
  ('COUNSEL_TYPE','CALL','전화','Call',2,TRUE),
  ('COUNSEL_TYPE','HOME','가정방문','Home Visit',3,TRUE),
  ('COUNSEL_TYPE','GROUP','집단','Group',4,TRUE),
  ('COUNSEL_TYPE','ETC','기타','Others',99,TRUE)
ON CONFLICT (group_cd, code) DO UPDATE SET
  code_nm=EXCLUDED.code_nm, code_nm_en=EXCLUDED.code_nm_en,
  sort_order=EXCLUDED.sort_order, is_active=EXCLUDED.is_active;

-- 접촉 방식
INSERT INTO tb_code (group_cd, code, code_nm, code_nm_en, sort_order, is_active)
VALUES
  ('CONTACT_METHOD','VISIT','방문','Visit',1,TRUE),
  ('CONTACT_METHOD','CALL','전화','Call',2,TRUE),
  ('CONTACT_METHOD','MESSAGE','문자/메신저','Message',3,TRUE),
  ('CONTACT_METHOD','OTHER','기타','Other',99,TRUE)
ON CONFLICT (group_cd, code) DO UPDATE SET
  code_nm=EXCLUDED.code_nm, code_nm_en=EXCLUDED.code_nm_en,
  sort_order=EXCLUDED.sort_order, is_active=EXCLUDED.is_active;

-- 접촉 결과
INSERT INTO tb_code (group_cd, code, code_nm, code_nm_en, sort_order, is_active)
VALUES
  ('CONTACT_RESULT','STABLE','안정','Stable',1,TRUE),
  ('CONTACT_RESULT','ALERT','주의','Alert',2,TRUE),
  ('CONTACT_RESULT','CRISIS','위기','Crisis',3,TRUE),
  ('CONTACT_RESULT','NO_CONTACT','미연락','No Contact',4,TRUE)
ON CONFLICT (group_cd, code) DO UPDATE SET
  code_nm=EXCLUDED.code_nm, code_nm_en=EXCLUDED.code_nm_en,
  sort_order=EXCLUDED.sort_order, is_active=EXCLUDED.is_active;

-- 연계 상태
INSERT INTO tb_code (group_cd, code, code_nm, code_nm_en, sort_order, is_active)
VALUES
  ('REFERRAL_STATUS','OPEN','접수','Open',1,TRUE),
  ('REFERRAL_STATUS','IN_PROGRESS','진행','In Progress',2,TRUE),
  ('REFERRAL_STATUS','DONE','완료','Done',3,TRUE),
  ('REFERRAL_STATUS','FAIL','실패','Fail',4,TRUE)
ON CONFLICT (group_cd, code) DO UPDATE SET
  code_nm=EXCLUDED.code_nm, code_nm_en=EXCLUDED.code_nm_en,
  sort_order=EXCLUDED.sort_order, is_active=EXCLUDED.is_active;

-- 자원 유형
INSERT INTO tb_code (group_cd, code, code_nm, code_nm_en, sort_order, is_active)
VALUES
  ('RESOURCE_TYPE','MEDICAL','의료','Medical',1,TRUE),
  ('RESOURCE_TYPE','WELFARE','복지','Welfare',2,TRUE),
  ('RESOURCE_TYPE','LEGAL','법률','Legal',3,TRUE),
  ('RESOURCE_TYPE','EMPLOYMENT','취업','Employment',4,TRUE),
  ('RESOURCE_TYPE','SELF_HELP','자조모임','Self-help',5,TRUE),
  ('RESOURCE_TYPE','ETC','기타','Others',99,TRUE)
ON CONFLICT (group_cd, code) DO UPDATE SET
  code_nm=EXCLUDED.code_nm, code_nm_en=EXCLUDED.code_nm_en,
  sort_order=EXCLUDED.sort_order, is_active=EXCLUDED.is_active;

-- 종결 사유
INSERT INTO tb_code (group_cd, code, code_nm, code_nm_en, sort_order, is_active)
VALUES
  ('CLOSING_REASON','RECOVERY','회복','Recovery',1,TRUE),
  ('CLOSING_REASON','REFERRAL','타기관연계','Referral',2,TRUE),
  ('CLOSING_REASON','DROPOUT','중도탈락','Dropout',3,TRUE),
  ('CLOSING_REASON','DEATH','사망','Death',4,TRUE),
  ('CLOSING_REASON','OTHER','기타','Other',99,TRUE)
ON CONFLICT (group_cd, code) DO UPDATE SET
  code_nm=EXCLUDED.code_nm, code_nm_en=EXCLUDED.code_nm_en,
  sort_order=EXCLUDED.sort_order, is_active=EXCLUDED.is_active;

-- ─────────────────────────────────────────────────────────────
-- 2) 권역 (tb_region)
-- 스키마: region_cd, region_nm, sort_order  (parent_cd/is_active 없음)
-- ─────────────────────────────────────────────────────────────
INSERT INTO tb_region (region_cd, region_nm, sort_order)
VALUES
  ('SEOUL',    '서울', 1),
  ('GYEONGGI', '경기', 2),
  ('INCHEON',  '인천', 3),
  ('BUSAN',    '부산', 4),
  ('DAEGU',    '대구', 5),
  ('GWANGJU',  '광주', 6),
  ('DAEJEON',  '대전', 7),
  ('ULSAN',    '울산', 8),
  ('SEJONG',   '세종', 9),
  ('GANGWON',  '강원',10),
  ('CHUNGBUK', '충북',11),
  ('CHUNGNAM', '충남',12),
  ('JEONBUK',  '전북',13),
  ('JEONNAM',  '전남',14),
  ('GYEONGBUK','경북',15),
  ('GYEONGNAM','경남',16),
  ('JEJU',     '제주',17)
ON CONFLICT (region_cd)
DO UPDATE SET
  region_nm  = EXCLUDED.region_nm,
  sort_order = EXCLUDED.sort_order;

-- ─────────────────────────────────────────────────────────────
-- 3) 역할 (tb_role)
-- 스키마: role_id, role_nm  (description 없음)
-- ─────────────────────────────────────────────────────────────
INSERT INTO tb_role (role_id, role_nm)
VALUES
  ('ADMIN',    '관리자'),
  ('MANAGER',  '팀장'),
  ('COUNSELOR','상담사'),
  ('VIEWER',   '열람자')
ON CONFLICT (role_id)
DO UPDATE SET role_nm = EXCLUDED.role_nm;

-- ─────────────────────────────────────────────────────────────
-- 4) 센터 (tb_center)
-- 스키마: center_id, center_nm, region_cd, address, phone, manager, capacity, is_active
-- (is_deleted, created_by, updated_by 없음)
-- ─────────────────────────────────────────────────────────────
INSERT INTO tb_center (center_id, center_nm, region_cd, address, phone, is_active, updated_at)
VALUES
  ('CT-01','서울중독재활센터','SEOUL',   '서울시(예시 주소)', '02-0000-0000',  TRUE, NOW()),
  ('CT-02','경기중독재활센터','GYEONGGI','경기도(예시 주소)', '031-000-0000', TRUE, NOW()),
  ('CT-03','부산중독재활센터','BUSAN',   '부산시(예시 주소)', '051-000-0000', TRUE, NOW())
ON CONFLICT (center_id)
DO UPDATE SET
  center_nm  = EXCLUDED.center_nm,
  region_cd  = EXCLUDED.region_cd,
  address    = EXCLUDED.address,
  phone      = EXCLUDED.phone,
  is_active  = EXCLUDED.is_active,
  updated_at = NOW();

-- ─────────────────────────────────────────────────────────────
-- 5) 연계 커넥터 (tb_connector)
-- 스키마: connector_id, connector_nm, group_cd, endpoint_url, status, is_active
-- (connector_type_cd, name, config_json 없음)
-- ─────────────────────────────────────────────────────────────
INSERT INTO tb_connector (connector_id, connector_nm, group_cd, endpoint_url, status, is_active)
VALUES
  ('CONN-SMS',     'SMS 발송 게이트웨이',   'EA',    'https://sms.example.local',   'OK', TRUE),
  ('CONN-1342-API','1342 콜센터 연계(샘플)','ADMIN', 'https://1342.example.local',  'OK', TRUE),
  ('CONN-HEALTH',  '보건소 연계',           'ADMIN', 'https://health.example.local','OK', TRUE)
ON CONFLICT (connector_id)
DO UPDATE SET
  connector_nm = EXCLUDED.connector_nm,
  group_cd     = EXCLUDED.group_cd,
  endpoint_url = EXCLUDED.endpoint_url,
  status       = EXCLUDED.status,
  is_active    = EXCLUDED.is_active;

-- ─────────────────────────────────────────────────────────────
-- 6) 마감 체크리스트 템플릿 (tb_closing_checklist_tpl)
-- 스키마: tpl_id (BigInt autoincrement), closing_type, check_item, sort_order, is_active
-- (정규화된 행 단위 구조 - JSON 배열 아님)
-- ─────────────────────────────────────────────────────────────

-- 월 마감 체크리스트
INSERT INTO tb_closing_checklist_tpl (closing_type, check_item, sort_order, is_active)
VALUES
  ('MONTHLY', '대상자 신규/종결 수 집계 확인',         1, TRUE),
  ('MONTHLY', '사례 상태(진행/모니터링/종결) 검증',   2, TRUE),
  ('MONTHLY', '상담 기록 누락 여부 점검',             3, TRUE),
  ('MONTHLY', '연계(자원 의뢰) 진행/완료 상태 점검',  4, TRUE),
  ('MONTHLY', '서식/첨부 파일 업로드 정상 여부 점검', 5, TRUE);

-- 분기 마감 체크리스트
INSERT INTO tb_closing_checklist_tpl (closing_type, check_item, sort_order, is_active)
VALUES
  ('QUARTERLY', '분기 보고서 생성/검토',   1, TRUE),
  ('QUARTERLY', '감사로그 샘플 점검',      2, TRUE),
  ('QUARTERLY', 'PII 접근 로그 점검',      3, TRUE),
  ('QUARTERLY', '사례 성과 지표 산출',     4, TRUE);

-- 연간 마감 체크리스트
INSERT INTO tb_closing_checklist_tpl (closing_type, check_item, sort_order, is_active)
VALUES
  ('ANNUAL', '연간 통계 보고서 확정',           1, TRUE),
  ('ANNUAL', '개인정보 보유기간 초과 대상 검토', 2, TRUE),
  ('ANNUAL', '시스템 접근권한 정기 재검토',      3, TRUE);

COMMIT;
