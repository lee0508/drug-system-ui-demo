# 마약류중독자관리시스템 데이터베이스 설계서

**기준 UI**: Next.js 14 프로토타입 (drug-system-ui-demo)
**대상 DBMS**: PostgreSQL 15+ (MariaDB/Oracle 호환 주석 포함)
**작성일**: 2026-03-03

---

## 설계 원칙

| 원칙 | 내용 |
|------|------|
| **개인정보 분리** | 실명/주민번호는 별도 암호화 테이블 격리, 시스템 전반은 가명(alias) 사용 |
| **Soft Delete** | 물리 삭제 금지 → `is_deleted`, `deleted_at` 컬럼으로 논리 삭제 |
| **감사 필드** | 모든 테이블에 `created_at`, `updated_at`, `created_by`, `updated_by` |
| **공통 코드** | ENUM 대신 `tb_code` 테이블 관리 (운영 중 코드 추가 가능) |
| **버전 관리** | ISP 등 변경이 잦은 데이터는 `version` 컬럼으로 이력 보존 |

---

## ERD 개요 (테이블 관계)

```
tb_center ──< tb_user
tb_center ──< tb_case
tb_subject ──< tb_case (1:N, 대상자 1명 = 여러 케이스)
tb_intake ──< tb_case (접수 → 케이스 전환)
tb_case ──< tb_case_event
tb_case ──< tb_case_task
tb_case ──< tb_isp ──< tb_isp_goal
                   ──< tb_isp_intervention
tb_subject ──< tb_family
tb_subject ──< tb_supporter_assignment ──< tb_supporter
tb_subject ──< tb_edu_legal
tb_case ──< tb_counseling
tb_case ──< tb_case_monitoring
tb_resource ──< tb_resource_referral ──< tb_case
```

---

## 00. 공통 코드 테이블

```sql
-- ─── 코드 그룹 ──────────────────────────────────────────────
CREATE TABLE tb_code_group (
  group_cd     VARCHAR(30)  PRIMARY KEY,     -- 'DRUG_TYPE', 'REGION', 'TRIAGE'
  group_nm     VARCHAR(100) NOT NULL,        -- '마약 유형', '지역', '긴급도'
  description  TEXT,
  sort_order   SMALLINT     DEFAULT 0,
  is_active    BOOLEAN      DEFAULT TRUE,
  created_at   TIMESTAMPTZ  DEFAULT NOW()
);

-- ─── 공통 코드 ──────────────────────────────────────────────
CREATE TABLE tb_code (
  group_cd     VARCHAR(30)  NOT NULL REFERENCES tb_code_group(group_cd),
  code         VARCHAR(30)  NOT NULL,        -- 'PHILOPON', 'CANNABIS'
  code_nm      VARCHAR(100) NOT NULL,        -- '필로폰', '대마'
  code_nm_en   VARCHAR(100),
  sort_order   SMALLINT     DEFAULT 0,
  is_active    BOOLEAN      DEFAULT TRUE,
  attr1        VARCHAR(100),                 -- 확장 속성 (범주 등)
  created_at   TIMESTAMPTZ  DEFAULT NOW(),
  PRIMARY KEY  (group_cd, code)
);

-- 기초 데이터 예시
INSERT INTO tb_code_group VALUES ('DRUG_TYPE','마약 유형',NULL,1,TRUE,NOW());
INSERT INTO tb_code VALUES ('DRUG_TYPE','PHILOPON','필로폰','Methamphetamine',1,TRUE,NULL,NOW());
INSERT INTO tb_code VALUES ('DRUG_TYPE','CANNABIS','대마','Cannabis',2,TRUE,NULL,NOW());
INSERT INTO tb_code VALUES ('DRUG_TYPE','HYPNOTIC','향정','Psychotropics',3,TRUE,NULL,NOW());
INSERT INTO tb_code VALUES ('DRUG_TYPE','OPIATE','마약','Narcotics',4,TRUE,NULL,NOW());

INSERT INTO tb_code_group VALUES ('REGION','지역',NULL,2,TRUE,NOW());
INSERT INTO tb_code_group VALUES ('TRIAGE','긴급도',NULL,3,TRUE,NOW());
INSERT INTO tb_code VALUES ('TRIAGE','LOW','낮음','Low',1,TRUE,NULL,NOW());
INSERT INTO tb_code VALUES ('TRIAGE','MID','중간','Medium',2,TRUE,NULL,NOW());
INSERT INTO tb_code VALUES ('TRIAGE','HIGH','높음','High',3,TRUE,NULL,NOW());
INSERT INTO tb_code VALUES ('TRIAGE','EMERG','응급','Emergency',4,TRUE,NULL,NOW());
```

---

## 01. 센터 관리 (`/centers`)

```sql
-- ─── 권역 코드 ──────────────────────────────────────────────
CREATE TABLE tb_region (
  region_cd   VARCHAR(10)  PRIMARY KEY,     -- 'SEOUL', 'GYEONGGI'
  region_nm   VARCHAR(50)  NOT NULL,        -- '서울', '경기'
  sort_order  SMALLINT     DEFAULT 0
);

-- ─── 센터 ───────────────────────────────────────────────────
CREATE TABLE tb_center (
  center_id    CHAR(10)     PRIMARY KEY,    -- 'CT-01'
  center_nm    VARCHAR(100) NOT NULL,       -- '서울중독재활센터'
  region_cd    VARCHAR(10)  REFERENCES tb_region(region_cd),
  address      VARCHAR(300),
  phone        VARCHAR(20),
  fax          VARCHAR(20),
  manager_nm   VARCHAR(50),                 -- 담당자 이름
  capacity     SMALLINT     DEFAULT 0,      -- 정원
  open_date    DATE,                        -- 개소일
  is_active    BOOLEAN      DEFAULT TRUE,
  is_deleted   BOOLEAN      DEFAULT FALSE,
  created_at   TIMESTAMPTZ  DEFAULT NOW(),
  updated_at   TIMESTAMPTZ  DEFAULT NOW(),
  created_by   VARCHAR(50),
  updated_by   VARCHAR(50)
);

-- ─── 뷰: 센터 + 활성 케이스 수 (active_cases는 집계) ────────
CREATE VIEW vw_center_stats AS
SELECT
  c.*,
  COUNT(ca.case_id) FILTER (WHERE ca.status NOT IN ('CLOSED')) AS active_cases,
  ROUND(COUNT(ca.case_id) FILTER (WHERE ca.status NOT IN ('CLOSED'))::NUMERIC
        / NULLIF(c.capacity, 0) * 100, 1) AS occupancy_rate
FROM tb_center c
LEFT JOIN tb_case ca ON ca.center_id = c.center_id AND ca.is_deleted = FALSE
WHERE c.is_deleted = FALSE
GROUP BY c.center_id;
```

---

## 02. 권한 관리 (`/admin/users`)

```sql
-- ─── 역할 ───────────────────────────────────────────────────
CREATE TABLE tb_role (
  role_cd     VARCHAR(20)  PRIMARY KEY,     -- 'ADMIN','MANAGER','COUNSELOR','VIEWER'
  role_nm     VARCHAR(50)  NOT NULL,
  description TEXT
);
INSERT INTO tb_role VALUES
  ('ADMIN',    '관리자',   '전체 기능 접근'),
  ('MANAGER',  '팀장',     '소속 센터 전체 접근'),
  ('COUNSELOR','상담사',   '담당 케이스만 접근'),
  ('VIEWER',   '열람자',   '읽기 전용');

-- ─── 시스템 사용자 ──────────────────────────────────────────
CREATE TABLE tb_user (
  user_id       CHAR(10)     PRIMARY KEY,   -- 'U-01'
  login_id      VARCHAR(50)  NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,      -- bcrypt hash
  user_nm       VARCHAR(50)  NOT NULL,
  center_id     CHAR(10)     REFERENCES tb_center(center_id),
  role_cd       VARCHAR(20)  REFERENCES tb_role(role_cd),
  email         VARCHAR(100),
  phone         VARCHAR(20),
  is_active     BOOLEAN      DEFAULT TRUE,
  pw_changed_at TIMESTAMPTZ,               -- 비밀번호 변경일
  is_deleted    BOOLEAN      DEFAULT FALSE,
  created_at    TIMESTAMPTZ  DEFAULT NOW(),
  updated_at    TIMESTAMPTZ  DEFAULT NOW(),
  created_by    VARCHAR(50),
  updated_by    VARCHAR(50)
);

-- ─── 로그인 이력 ────────────────────────────────────────────
CREATE TABLE tb_user_login_log (
  log_id      BIGSERIAL    PRIMARY KEY,
  user_id     CHAR(10)     REFERENCES tb_user(user_id),
  login_at    TIMESTAMPTZ  DEFAULT NOW(),
  login_ip    VARCHAR(45),                  -- IPv6 대응
  user_agent  TEXT,
  result      VARCHAR(10)  CHECK (result IN ('SUCCESS','FAIL')),
  fail_reason VARCHAR(100)
);

-- ─── 감사 로그 (모든 변경 이력) ─────────────────────────────
CREATE TABLE tb_audit_log (
  log_id      BIGSERIAL    PRIMARY KEY,
  user_id     VARCHAR(50),
  action      VARCHAR(20),                  -- 'INSERT','UPDATE','DELETE'
  table_nm    VARCHAR(50),
  record_id   VARCHAR(50),
  old_data    JSONB,                        -- 변경 전 값
  new_data    JSONB,                        -- 변경 후 값
  logged_at   TIMESTAMPTZ  DEFAULT NOW(),
  ip_addr     VARCHAR(45)
);
```

---

## 03. 대상자 관리 (`/subjects`)

```sql
-- ─── 대상자 마스터 ──────────────────────────────────────────
CREATE TABLE tb_subject (
  subject_id    CHAR(10)     PRIMARY KEY,   -- 'SB-001'
  case_no       VARCHAR(20)  NOT NULL UNIQUE, -- 'SUBJ-000101' (관리번호)
  alias         VARCHAR(50)  NOT NULL,      -- 가명 (예: 김*수)
  gender        CHAR(1)      CHECK (gender IN ('M','F')),
  birth_year    SMALLINT,
  region_cd     VARCHAR(10)  REFERENCES tb_region(region_cd),
  entry_route   VARCHAR(10)  CHECK (entry_route IN ('1342','LEGAL','SELF','AGENCY')),
  registered_at DATE         NOT NULL,
  status        VARCHAR(15)  CHECK (status IN ('ACTIVE','MONITORING','CLOSED'))
                             DEFAULT 'ACTIVE',
  center_id     CHAR(10)     REFERENCES tb_center(center_id),
  -- 개인정보는 암호화 테이블 분리 (tb_subject_pii 참조)
  is_deleted    BOOLEAN      DEFAULT FALSE,
  created_at    TIMESTAMPTZ  DEFAULT NOW(),
  updated_at    TIMESTAMPTZ  DEFAULT NOW(),
  created_by    VARCHAR(50),
  updated_by    VARCHAR(50)
);

-- ─── 대상자 마약 유형 (1:N) ─────────────────────────────────
CREATE TABLE tb_subject_drug (
  subject_id   CHAR(10)     REFERENCES tb_subject(subject_id),
  drug_cd      VARCHAR(30),                 -- tb_code (DRUG_TYPE) 참조
  is_primary   BOOLEAN      DEFAULT FALSE,  -- 주 사용 마약
  created_at   TIMESTAMPTZ  DEFAULT NOW(),
  PRIMARY KEY  (subject_id, drug_cd)
);

-- ─── 개인정보 암호화 테이블 (별도 접근 제어) ─────────────────
-- 실명/주민번호는 이 테이블에만 저장, 별도 권한(ADMIN)만 접근
CREATE TABLE tb_subject_pii (
  subject_id   CHAR(10)     PRIMARY KEY REFERENCES tb_subject(subject_id),
  real_name    BYTEA,                       -- AES-256 암호화
  jumin_no     BYTEA,                       -- AES-256 암호화
  phone        BYTEA,                       -- AES-256 암호화
  address      TEXT,
  updated_at   TIMESTAMPTZ  DEFAULT NOW(),
  updated_by   VARCHAR(50)
);

-- ─── 가족/보호자 ────────────────────────────────────────────
CREATE TABLE tb_family (
  family_id    BIGSERIAL    PRIMARY KEY,
  subject_id   CHAR(10)     REFERENCES tb_subject(subject_id),
  relation     VARCHAR(20),                 -- '배우자','부모','자녀','형제'
  alias        VARCHAR(50),                 -- 가명
  phone_masked VARCHAR(20),                 -- 마스킹 번호 (010-****-1234)
  live_together BOOLEAN     DEFAULT FALSE,  -- 동거 여부
  consent_yn   BOOLEAN      DEFAULT FALSE,  -- 동의서
  note         TEXT,
  is_deleted   BOOLEAN      DEFAULT FALSE,
  created_at   TIMESTAMPTZ  DEFAULT NOW(),
  created_by   VARCHAR(50)
);

-- ─── 회복지원가 ─────────────────────────────────────────────
CREATE TABLE tb_supporter (
  supporter_id BIGSERIAL    PRIMARY KEY,
  supporter_nm VARCHAR(50)  NOT NULL,       -- 가명 처리 (장*민)
  phone_masked VARCHAR(20),
  center_id    CHAR(10)     REFERENCES tb_center(center_id),
  join_date    DATE,
  is_active    BOOLEAN      DEFAULT TRUE,
  is_deleted   BOOLEAN      DEFAULT FALSE,
  created_at   TIMESTAMPTZ  DEFAULT NOW()
);

-- ─── 회복지원가 ↔ 대상자 배정 ────────────────────────────────
CREATE TABLE tb_supporter_assignment (
  assign_id    BIGSERIAL    PRIMARY KEY,
  supporter_id BIGINT       REFERENCES tb_supporter(supporter_id),
  subject_id   CHAR(10)     REFERENCES tb_subject(subject_id),
  start_date   DATE,
  end_date     DATE,
  last_act_date DATE,                       -- 최근 활동일
  note         TEXT,
  created_at   TIMESTAMPTZ  DEFAULT NOW()
);
```

---

## 04. 접수/초기개입 (`/intake`)

```sql
-- ─── 접수 ───────────────────────────────────────────────────
CREATE TABLE tb_intake (
  intake_id        VARCHAR(15)  PRIMARY KEY,  -- 'IN-1001'
  source           VARCHAR(10)  CHECK (source IN ('1342','ONLINE','WALKIN','AGENCY')),
  region_cd        VARCHAR(10)  REFERENCES tb_region(region_cd),
  triage           VARCHAR(10)  CHECK (triage IN ('LOW','MID','HIGH','EMERG')),
  consent_yn       BOOLEAN      DEFAULT FALSE,
  summary          TEXT,
  preferred_center CHAR(10)     REFERENCES tb_center(center_id),
  assigned_center  CHAR(10)     REFERENCES tb_center(center_id),
  assigned_user_id CHAR(10)     REFERENCES tb_user(user_id),
  intake_step      VARCHAR(20)  DEFAULT 'QUEUE',  -- QUEUE/SCREEN/CONSENT/ASSIGN/DONE
  converted_case_id VARCHAR(15),                  -- 케이스 전환 후 case_id
  converted_at     TIMESTAMPTZ,
  is_deleted       BOOLEAN      DEFAULT FALSE,
  created_at       TIMESTAMPTZ  DEFAULT NOW(),
  updated_at       TIMESTAMPTZ  DEFAULT NOW(),
  created_by       VARCHAR(50),
  updated_by       VARCHAR(50)
);

-- ─── 접수 단계 이력 ─────────────────────────────────────────
CREATE TABLE tb_intake_step_log (
  log_id      BIGSERIAL    PRIMARY KEY,
  intake_id   VARCHAR(15)  REFERENCES tb_intake(intake_id),
  step        VARCHAR(20)  NOT NULL,         -- QUEUE/SCREEN/CONSENT/ASSIGN/DONE
  step_at     TIMESTAMPTZ  DEFAULT NOW(),
  note        TEXT,
  done_by     VARCHAR(50)
);
```

---

## 05. 사례관리 (`/cases`, `/cases/[id]`)

```sql
-- ─── 케이스 마스터 ──────────────────────────────────────────
CREATE TABLE tb_case (
  case_id        VARCHAR(15)  PRIMARY KEY,   -- 'CA-2001'
  subject_id     CHAR(10)     REFERENCES tb_subject(subject_id),
  subject_label  VARCHAR(30)  NOT NULL,      -- 가명 'CASE-000231'
  intake_id      VARCHAR(15)  REFERENCES tb_intake(intake_id),
  center_id      CHAR(10)     REFERENCES tb_center(center_id),
  assigned_user_id CHAR(10)   REFERENCES tb_user(user_id),  -- 담당 상담사
  region_cd      VARCHAR(10)  REFERENCES tb_region(region_cd),
  status         VARCHAR(15)  CHECK (status IN ('NEW','IN_PROGRESS','MONITORING','CLOSED'))
                              DEFAULT 'NEW',
  triage         VARCHAR(10)  CHECK (triage IN ('LOW','MID','HIGH','EMERG')),
  opened_at      TIMESTAMPTZ  DEFAULT NOW(), -- 케이스 개시일
  closed_at      TIMESTAMPTZ,               -- 종결일
  last_updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_deleted     BOOLEAN      DEFAULT FALSE,
  created_at     TIMESTAMPTZ  DEFAULT NOW(),
  updated_at     TIMESTAMPTZ  DEFAULT NOW(),
  created_by     VARCHAR(50),
  updated_by     VARCHAR(50)
);

-- ─── 케이스 이벤트/타임라인 ────────────────────────────────
CREATE TABLE tb_case_event (
  event_id    BIGSERIAL    PRIMARY KEY,
  case_id     VARCHAR(15)  REFERENCES tb_case(case_id),
  event_type  VARCHAR(20)  CHECK (event_type IN
              ('INTAKE','ASSESSMENT','ISP','INTERVENTION',
               'REFERRAL','MONITORING','CLOSE')),
  title       VARCHAR(200) NOT NULL,
  note        TEXT,
  event_at    TIMESTAMPTZ  DEFAULT NOW(),
  created_by  VARCHAR(50)
);

-- ─── 케이스 할일 ─────────────────────────────────────────────
CREATE TABLE tb_case_task (
  task_id     BIGSERIAL    PRIMARY KEY,
  case_id     VARCHAR(15)  REFERENCES tb_case(case_id),
  title       VARCHAR(200) NOT NULL,
  due_at      TIMESTAMPTZ,
  status      VARCHAR(10)  CHECK (status IN ('TODO','DOING','DONE')) DEFAULT 'TODO',
  done_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ  DEFAULT NOW(),
  created_by  VARCHAR(50),
  updated_by  VARCHAR(50)
);

-- ─── 상담 기록 (개별/집단) ──────────────────────────────────
CREATE TABLE tb_counseling (
  counsel_id    BIGSERIAL    PRIMARY KEY,
  case_id       VARCHAR(15)  REFERENCES tb_case(case_id),
  counsel_type  VARCHAR(10)  CHECK (counsel_type IN ('INDIVIDUAL','GROUP')),
  counsel_date  DATE         NOT NULL,
  duration_min  SMALLINT,                   -- 상담 시간(분)
  counselor_id  CHAR(10)     REFERENCES tb_user(user_id),
  content       TEXT,                       -- 상담 내용 (암호화 권장)
  next_plan     TEXT,                       -- 다음 계획
  created_at    TIMESTAMPTZ  DEFAULT NOW(),
  created_by    VARCHAR(50)
);

-- ─── 사례지원 기록 ──────────────────────────────────────────
CREATE TABLE tb_case_support (
  support_id   BIGSERIAL    PRIMARY KEY,
  case_id      VARCHAR(15)  REFERENCES tb_case(case_id),
  support_type VARCHAR(30),                 -- 'MEDICAL','WELFARE','LEGAL','HOUSING'
  service_nm   VARCHAR(200),
  provider     VARCHAR(100),                -- 제공 기관
  start_date   DATE,
  end_date     DATE,
  status       VARCHAR(15)  DEFAULT 'ACTIVE',
  note         TEXT,
  created_at   TIMESTAMPTZ  DEFAULT NOW(),
  created_by   VARCHAR(50)
);

-- ─── 모니터링 기록 ──────────────────────────────────────────
CREATE TABLE tb_case_monitoring (
  monitor_id   BIGSERIAL    PRIMARY KEY,
  case_id      VARCHAR(15)  REFERENCES tb_case(case_id),
  monitor_date DATE         NOT NULL,
  method       VARCHAR(20)  CHECK (method IN ('VISIT','CALL','MESSAGE','OTHER')),
  result       VARCHAR(20)  CHECK (result IN ('STABLE','ALERT','CRISIS','NO_CONTACT')),
  content      TEXT,
  next_date    DATE,                        -- 다음 모니터링 예정일
  done_by      CHAR(10)     REFERENCES tb_user(user_id),
  created_at   TIMESTAMPTZ  DEFAULT NOW()
);

-- ─── 사례 종결 ──────────────────────────────────────────────
CREATE TABLE tb_case_closing (
  closing_id      BIGSERIAL    PRIMARY KEY,
  case_id         VARCHAR(15)  REFERENCES tb_case(case_id) UNIQUE,
  closing_type    VARCHAR(20)  CHECK (closing_type IN
                  ('RECOVERY','REFERRAL','DROPOUT','DEATH','OTHER')),
  closing_date    DATE         NOT NULL,
  closing_reason  TEXT,
  outcome         TEXT,                     -- 종결 시 성과 요약
  post_monitor_yn BOOLEAN      DEFAULT FALSE, -- 사후관리 여부
  approved_by     CHAR(10)     REFERENCES tb_user(user_id),
  approved_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ  DEFAULT NOW(),
  created_by      VARCHAR(50)
);
```

---

## 06. ISP 수립 (`/isp/[caseId]`)

```sql
-- ─── ISP 마스터 (버전 관리) ─────────────────────────────────
CREATE TABLE tb_isp (
  isp_id         BIGSERIAL    PRIMARY KEY,
  case_id        VARCHAR(15)  REFERENCES tb_case(case_id),
  version        SMALLINT     NOT NULL DEFAULT 1,  -- 버전
  review_cycle   VARCHAR(15)  CHECK (review_cycle IN ('WEEKLY','MONTHLY','QUARTERLY')),
  crisis_plan    TEXT,
  is_current     BOOLEAN      DEFAULT TRUE,        -- 최신 버전 여부
  updated_at     TIMESTAMPTZ  DEFAULT NOW(),
  created_at     TIMESTAMPTZ  DEFAULT NOW(),
  created_by     VARCHAR(50),
  UNIQUE (case_id, version)
);

-- ─── ISP 문제 목록 ──────────────────────────────────────────
CREATE TABLE tb_isp_problem (
  problem_id  BIGSERIAL    PRIMARY KEY,
  isp_id      BIGINT       REFERENCES tb_isp(isp_id),
  content     TEXT         NOT NULL,
  sort_order  SMALLINT     DEFAULT 0
);

-- ─── ISP 목표 ────────────────────────────────────────────────
CREATE TABLE tb_isp_goal (
  goal_id     BIGSERIAL    PRIMARY KEY,
  isp_id      BIGINT       REFERENCES tb_isp(isp_id),
  horizon     VARCHAR(10)  CHECK (horizon IN ('SHORT','MID','LONG')),
  goal        TEXT         NOT NULL,
  metric      VARCHAR(200),                 -- 측정 지표
  due_date    DATE,
  achieved_yn BOOLEAN      DEFAULT FALSE,
  sort_order  SMALLINT     DEFAULT 0
);

-- ─── ISP 개입 계획 ──────────────────────────────────────────
CREATE TABLE tb_isp_intervention (
  intervention_id BIGSERIAL   PRIMARY KEY,
  isp_id          BIGINT      REFERENCES tb_isp(isp_id),
  category        VARCHAR(20) CHECK (category IN
                  ('COUNSELING','PROGRAM','MEDICAL','MHIS',
                   'LEGAL','WELFARE','FAMILY')),
  action          TEXT        NOT NULL,
  owner           VARCHAR(100),
  schedule        VARCHAR(100),
  sort_order      SMALLINT    DEFAULT 0
);
```

---

## 07. 재활교육 (`/education/*`)

```sql
-- ─── 기소유예/이수명령 ──────────────────────────────────────
CREATE TABLE tb_edu_legal (
  legal_id     BIGSERIAL    PRIMARY KEY,
  subject_id   CHAR(10)     REFERENCES tb_subject(subject_id),
  case_id      VARCHAR(15)  REFERENCES tb_case(case_id),
  order_type   VARCHAR(20)  CHECK (order_type IN
               ('DEFERRED_PROSECUTION','LECTURE_ORDER','COMPLETION_ORDER')),
  court_nm     VARCHAR(100),                -- 법원명
  order_date   DATE,                        -- 명령일
  total_hours  SMALLINT,                    -- 이수 시간
  done_hours   SMALLINT     DEFAULT 0,      -- 이수 완료 시간
  due_date     DATE,                        -- 이수 기한
  status       VARCHAR(15)  CHECK (status IN ('IN_PROGRESS','COMPLETED','FAIL','PENDING')),
  note         TEXT,
  created_at   TIMESTAMPTZ  DEFAULT NOW(),
  created_by   VARCHAR(50)
);

-- ─── 이수 출석 기록 ─────────────────────────────────────────
CREATE TABLE tb_edu_legal_attendance (
  attend_id    BIGSERIAL    PRIMARY KEY,
  legal_id     BIGINT       REFERENCES tb_edu_legal(legal_id),
  attend_date  DATE         NOT NULL,
  hours        SMALLINT     NOT NULL,
  status       VARCHAR(10)  CHECK (status IN ('ATTEND','ABSENT','LATE')),
  note         TEXT,
  created_by   VARCHAR(50)
);

-- ─── 단기교육 프로그램 ──────────────────────────────────────
CREATE TABLE tb_edu_program (
  program_id   BIGSERIAL    PRIMARY KEY,
  center_id    CHAR(10)     REFERENCES tb_center(center_id),
  program_nm   VARCHAR(200) NOT NULL,
  program_type VARCHAR(20)  CHECK (program_type IN ('SHORT','REGULAR','INTENSIVE')),
  total_session SMALLINT,                   -- 총 회차
  start_date   DATE,
  end_date     DATE,
  instructor   VARCHAR(100),
  location     VARCHAR(300),
  max_capacity SMALLINT,
  is_active    BOOLEAN      DEFAULT TRUE,
  created_at   TIMESTAMPTZ  DEFAULT NOW()
);

-- ─── 단기교육 회차 ──────────────────────────────────────────
CREATE TABLE tb_edu_session (
  session_id   BIGSERIAL    PRIMARY KEY,
  program_id   BIGINT       REFERENCES tb_edu_program(program_id),
  session_no   SMALLINT     NOT NULL,       -- 1회차, 2회차...
  session_date DATE,
  topic        VARCHAR(200),
  created_at   TIMESTAMPTZ  DEFAULT NOW()
);

-- ─── 단기교육 출석 ──────────────────────────────────────────
CREATE TABLE tb_edu_session_attend (
  attend_id    BIGSERIAL    PRIMARY KEY,
  session_id   BIGINT       REFERENCES tb_edu_session(session_id),
  subject_id   CHAR(10)     REFERENCES tb_subject(subject_id),
  case_id      VARCHAR(15)  REFERENCES tb_case(case_id),
  status       VARCHAR(10)  CHECK (status IN ('ATTEND','ABSENT','LATE')),
  note         TEXT,
  created_by   VARCHAR(50)
);

-- ─── 찾아가는 재활 방문 기록 ────────────────────────────────
CREATE TABLE tb_edu_outreach (
  outreach_id  BIGSERIAL    PRIMARY KEY,
  subject_id   CHAR(10)     REFERENCES tb_subject(subject_id),
  case_id      VARCHAR(15)  REFERENCES tb_case(case_id),
  visit_date   DATE         NOT NULL,
  location     VARCHAR(300),                -- 방문 장소
  counselor_id CHAR(10)     REFERENCES tb_user(user_id),
  purpose      TEXT,                        -- 방문 목적
  result       TEXT,                        -- 방문 결과
  next_date    DATE,
  created_at   TIMESTAMPTZ  DEFAULT NOW(),
  created_by   VARCHAR(50)
);
```

---

## 08. 지역자원 관리 (`/resources`)

```sql
-- ─── 지역 자원 기관 ─────────────────────────────────────────
CREATE TABLE tb_resource (
  resource_id  BIGSERIAL    PRIMARY KEY,
  resource_nm  VARCHAR(200) NOT NULL,
  resource_type VARCHAR(20) CHECK (resource_type IN
               ('MEDICAL','WELFARE','LEGAL','EMPLOYMENT','SELF_HELP')),
  region_cd    VARCHAR(10)  REFERENCES tb_region(region_cd),
  phone        VARCHAR(20),
  address      VARCHAR(300),
  website      VARCHAR(200),
  note         TEXT,
  is_active    BOOLEAN      DEFAULT TRUE,
  is_deleted   BOOLEAN      DEFAULT FALSE,
  created_at   TIMESTAMPTZ  DEFAULT NOW(),
  updated_at   TIMESTAMPTZ  DEFAULT NOW(),
  created_by   VARCHAR(50)
);

-- ─── 연계/의뢰 이력 ─────────────────────────────────────────
CREATE TABLE tb_resource_referral (
  referral_id  BIGSERIAL    PRIMARY KEY,
  case_id      VARCHAR(15)  REFERENCES tb_case(case_id),
  resource_id  BIGINT       REFERENCES tb_resource(resource_id),
  referral_date DATE        NOT NULL,
  purpose      TEXT,
  result       TEXT,
  status       VARCHAR(15)  CHECK (status IN ('PENDING','CONNECTED','REJECTED','CLOSED')),
  created_at   TIMESTAMPTZ  DEFAULT NOW(),
  created_by   VARCHAR(50)
);
```

---

## 09. 통계 관리 (`/stats`)

```sql
-- ─── 월간 집계 통계 ─────────────────────────────────────────
-- 매월 집계 배치 실행으로 생성 (실시간 쿼리 대신 snapshot 저장)
CREATE TABLE tb_stats_monthly (
  stats_id      BIGSERIAL    PRIMARY KEY,
  yyyymm        CHAR(6)      NOT NULL,       -- '202603'
  center_id     CHAR(10)     REFERENCES tb_center(center_id),
  region_cd     VARCHAR(10),
  -- 접수 지표
  intake_total   INT          DEFAULT 0,
  intake_1342    INT          DEFAULT 0,
  intake_legal   INT          DEFAULT 0,
  intake_agency  INT          DEFAULT 0,
  intake_self    INT          DEFAULT 0,
  -- 케이스 지표
  case_new       INT          DEFAULT 0,
  case_in_progress INT        DEFAULT 0,
  case_monitoring INT         DEFAULT 0,
  case_closed    INT          DEFAULT 0,
  -- 교육 지표
  edu_legal_cnt  INT          DEFAULT 0,
  edu_short_cnt  INT          DEFAULT 0,
  edu_outreach_cnt INT        DEFAULT 0,
  -- 상담 지표
  counsel_cnt    INT          DEFAULT 0,
  generated_at   TIMESTAMPTZ  DEFAULT NOW(),
  UNIQUE (yyyymm, center_id)
);

-- ─── 보고서 메타데이터 ──────────────────────────────────────
CREATE TABLE tb_report (
  report_id    BIGSERIAL    PRIMARY KEY,
  report_type  VARCHAR(20)  CHECK (report_type IN
               ('MONTHLY','QUARTERLY','ANNUAL','NATIONAL','AD_HOC')),
  report_title VARCHAR(300),
  period_from  DATE,
  period_to    DATE,
  center_id    CHAR(10)     REFERENCES tb_center(center_id),
  file_path    VARCHAR(500),                -- 생성된 파일 경로
  status       VARCHAR(15)  CHECK (status IN ('DRAFT','SUBMITTED','APPROVED')),
  submitted_at TIMESTAMPTZ,
  approved_by  CHAR(10)     REFERENCES tb_user(user_id),
  created_at   TIMESTAMPTZ  DEFAULT NOW(),
  created_by   VARCHAR(50)
);
```

---

## 10. 마감 관리 (`/closing`)

```sql
-- ─── 마감 체크리스트 템플릿 ─────────────────────────────────
CREATE TABLE tb_closing_checklist_tpl (
  tpl_id       BIGSERIAL    PRIMARY KEY,
  close_type   VARCHAR(15)  CHECK (close_type IN ('MONTHLY','QUARTERLY','ANNUAL')),
  item_no      SMALLINT     NOT NULL,
  item_nm      VARCHAR(300) NOT NULL,
  sort_order   SMALLINT     DEFAULT 0,
  is_active    BOOLEAN      DEFAULT TRUE
);

-- ─── 마감 처리 이력 ─────────────────────────────────────────
CREATE TABLE tb_closing_history (
  closing_id   BIGSERIAL    PRIMARY KEY,
  close_type   VARCHAR(15)  CHECK (close_type IN ('MONTHLY','QUARTERLY','ANNUAL')),
  period       VARCHAR(10)  NOT NULL,        -- '2026-02', '2025-Q4', '2025'
  center_id    CHAR(10)     REFERENCES tb_center(center_id),
  closed_at    TIMESTAMPTZ  DEFAULT NOW(),
  closed_by    CHAR(10)     REFERENCES tb_user(user_id),
  status       VARCHAR(10)  CHECK (status IN ('DONE','CANCELLED')) DEFAULT 'DONE',
  note         TEXT
);

-- ─── 마감 체크항목 완료 기록 ────────────────────────────────
CREATE TABLE tb_closing_check_done (
  done_id      BIGSERIAL    PRIMARY KEY,
  closing_id   BIGINT       REFERENCES tb_closing_history(closing_id),
  tpl_id       BIGINT       REFERENCES tb_closing_checklist_tpl(tpl_id),
  done_yn      BOOLEAN      DEFAULT FALSE,
  done_at      TIMESTAMPTZ,
  done_by      CHAR(10)     REFERENCES tb_user(user_id)
);
```

---

## 11. 연계 관리 (`/integrations`)

```sql
-- ─── 연계 커넥터 ────────────────────────────────────────────
CREATE TABLE tb_connector (
  connector_id  VARCHAR(15)  PRIMARY KEY,   -- 'C-EA-1'
  connector_nm  VARCHAR(200) NOT NULL,
  group_cd      VARCHAR(10)  CHECK (group_cd IN ('EA','ADMIN')),
  endpoint_url  VARCHAR(500),
  status        VARCHAR(10)  CHECK (status IN ('OK','DEGRADED','DOWN')) DEFAULT 'OK',
  last_sync_at  TIMESTAMPTZ,
  is_active     BOOLEAN      DEFAULT TRUE,
  created_at    TIMESTAMPTZ  DEFAULT NOW()
);

-- ─── 연계 로그 ──────────────────────────────────────────────
CREATE TABLE tb_integration_log (
  log_id        BIGSERIAL    PRIMARY KEY,
  connector_id  VARCHAR(15)  REFERENCES tb_connector(connector_id),
  direction     CHAR(3)      CHECK (direction IN ('OUT','IN')),
  message       TEXT,
  payload       JSONB,                      -- 전송 데이터 (민감정보 마스킹)
  result        VARCHAR(10)  CHECK (result IN ('SUCCESS','FAIL')),
  error_msg     TEXT,
  retry_count   SMALLINT     DEFAULT 0,
  retried_from  BIGINT       REFERENCES tb_integration_log(log_id),
  logged_at     TIMESTAMPTZ  DEFAULT NOW()
);
```

---

## 12. 업무 지원 (`/support`)

```sql
-- ─── 서식 관리 ──────────────────────────────────────────────
CREATE TABLE tb_form_template (
  form_id      BIGSERIAL    PRIMARY KEY,
  form_nm      VARCHAR(200) NOT NULL,
  file_ext     VARCHAR(10),                 -- 'HWP', 'PDF', 'XLSX'
  file_path    VARCHAR(500),
  version      VARCHAR(20),
  updated_at   TIMESTAMPTZ  DEFAULT NOW(),
  is_active    BOOLEAN      DEFAULT TRUE,
  is_deleted   BOOLEAN      DEFAULT FALSE,
  created_at   TIMESTAMPTZ  DEFAULT NOW(),
  created_by   VARCHAR(50)
);

-- ─── 공지사항 ───────────────────────────────────────────────
CREATE TABLE tb_notice (
  notice_id    BIGSERIAL    PRIMARY KEY,
  title        VARCHAR(300) NOT NULL,
  content      TEXT,
  is_important BOOLEAN      DEFAULT FALSE,
  center_id    CHAR(10)     REFERENCES tb_center(center_id),  -- NULL=전체
  notice_date  DATE         DEFAULT CURRENT_DATE,
  expire_date  DATE,
  is_deleted   BOOLEAN      DEFAULT FALSE,
  created_at   TIMESTAMPTZ  DEFAULT NOW(),
  created_by   VARCHAR(50)
);

-- ─── FAQ ────────────────────────────────────────────────────
CREATE TABLE tb_faq (
  faq_id       BIGSERIAL    PRIMARY KEY,
  question     TEXT         NOT NULL,
  answer       TEXT         NOT NULL,
  category     VARCHAR(50),
  sort_order   SMALLINT     DEFAULT 0,
  is_active    BOOLEAN      DEFAULT TRUE,
  created_at   TIMESTAMPTZ  DEFAULT NOW(),
  created_by   VARCHAR(50)
);
```

---

## 인덱스 설계

```sql
-- 자주 조회되는 컬럼 인덱스
CREATE INDEX idx_case_status        ON tb_case(status) WHERE is_deleted = FALSE;
CREATE INDEX idx_case_center        ON tb_case(center_id);
CREATE INDEX idx_case_subject       ON tb_case(subject_id);
CREATE INDEX idx_intake_source      ON tb_intake(source);
CREATE INDEX idx_intake_status      ON tb_intake(intake_step);
CREATE INDEX idx_subject_status     ON tb_subject(status);
CREATE INDEX idx_subject_region     ON tb_subject(region_cd);
CREATE INDEX idx_case_event_case    ON tb_case_event(case_id);
CREATE INDEX idx_case_task_case     ON tb_case_task(case_id);
CREATE INDEX idx_counsel_case       ON tb_counseling(case_id);
CREATE INDEX idx_monitor_case       ON tb_case_monitoring(case_id);
CREATE INDEX idx_isp_case           ON tb_isp(case_id) WHERE is_current = TRUE;
CREATE INDEX idx_stats_period       ON tb_stats_monthly(yyyymm, center_id);
CREATE INDEX idx_intlog_connector   ON tb_integration_log(connector_id);
CREATE INDEX idx_audit_table        ON tb_audit_log(table_nm, record_id);
CREATE INDEX idx_login_log_user     ON tb_user_login_log(user_id, login_at DESC);
```

---

## 테이블 목록 요약

| 모듈 | 테이블 수 | 주요 테이블 |
|------|----------|------------|
| 공통 코드 | 2 | tb_code_group, tb_code |
| 센터관리 | 2 | tb_region, tb_center |
| 권한관리 | 3 | tb_role, tb_user, tb_user_login_log |
| 감사로그 | 1 | tb_audit_log |
| 대상자관리 | 5 | tb_subject, tb_subject_drug, tb_subject_pii, tb_family, tb_supporter |
| 접수/초기개입 | 2 | tb_intake, tb_intake_step_log |
| 사례관리 | 6 | tb_case, tb_case_event, tb_case_task, tb_counseling, tb_case_support, tb_case_monitoring, tb_case_closing |
| ISP | 4 | tb_isp, tb_isp_problem, tb_isp_goal, tb_isp_intervention |
| 재활교육 | 6 | tb_edu_legal, tb_edu_legal_attendance, tb_edu_program, tb_edu_session, tb_edu_session_attend, tb_edu_outreach |
| 지역자원 | 2 | tb_resource, tb_resource_referral |
| 통계 | 2 | tb_stats_monthly, tb_report |
| 마감관리 | 3 | tb_closing_checklist_tpl, tb_closing_history, tb_closing_check_done |
| 연계관리 | 2 | tb_connector, tb_integration_log |
| 업무지원 | 3 | tb_form_template, tb_notice, tb_faq |
| **합계** | **43** | |
