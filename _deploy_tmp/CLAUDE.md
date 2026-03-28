# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

마약류중독자관리시스템 (Drug Addiction Rehabilitation Management System) — A Next.js 14 App Router prototype for managing drug addiction rehabilitation cases. Currently in Phase 1 (UI prototype with partial DB integration).

**Language**: Korean UI/comments, English code

## Development Commands

```bash
# Development
npm run dev           # Start dev server on http://localhost:3000
npm run dev:network   # Start dev server accessible on LAN (0.0.0.0)

# Build & Production
npm run build         # Build for production
npm run start         # Start production server
npm run start:network # Start production server on LAN

# Database (Prisma)
npm run db:generate   # Generate Prisma Client after schema changes
npm run db:migrate    # Run migrations (dev)
npm run db:push       # Push schema to DB without migration
npm run db:studio     # Open Prisma Studio GUI
npm run db:seed       # Seed initial data (tsx prisma/seed.ts)
```

## Architecture

### Tech Stack
- **Framework**: Next.js 14 (App Router, TypeScript, strict mode)
- **ORM**: Prisma Client v5.22.0 with PostgreSQL
- **State**: React Context (`AppProvider`) for mock data, `fetch` for DB-connected pages
- **Styling**: CSS variables (custom design system in `app/globals.css`)

### Directory Structure
```
app/
├── api/                    # Next.js Route Handlers (REST API)
│   ├── subjects/           # 대상자 관리 API
│   ├── cases/[id]/events/  # 타임라인 이벤트 API
│   ├── cases/[id]/isp/     # ISP 계획 API
│   ├── connectors/         # 연계 커넥터 API
│   ├── forms/[id]/download/ # 파일 다운로드 API
│   └── ...
├── subjects/               # 대상자 관리 페이지
├── intake/                 # 접수/초기개입
├── cases/[id]/             # 사례 상세 (5탭)
├── isp/[caseId]/           # ISP 수립
├── stats/                  # 통계 대시보드
├── centers/                # 센터관리
├── integrations/           # 연계관리
├── resources/              # 지역자원관리
├── support/                # 업무지원 (서식)
├── closing/                # 마감관리
└── admin/users/            # 권한관리

components/
├── AppProvider.tsx         # Global state (mock data) — 접수/사례/연계용
├── Shell.tsx               # Layout wrapper with sidebar navigation
├── Stepper.tsx             # 5-step intake wizard
├── Tabs.tsx                # Tab component for case detail
└── MiniChart.tsx           # SVG mini chart for stats

lib/
├── prisma.ts               # Prisma singleton (hot-reload safe)
├── bigint.ts               # BigInt JSON serialization: serialize()
├── mockData.ts             # Mock data for non-DB pages
└── types.ts                # TypeScript interfaces

prisma/
├── schema.prisma           # 43 Prisma models (PostgreSQL)
└── seed.ts                 # Initial data seeding
```

### Key Patterns

**API Route Pattern** (DB-connected pages):
```typescript
// app/api/resource/route.ts
import { prisma } from "@/lib/prisma";
import { serialize } from "@/lib/bigint";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const data = await prisma.model.findMany({ where: {...} });
  return NextResponse.json(serialize(data)); // serialize() handles BigInt
}
```

**Page Data Fetching Pattern**:
```typescript
// Client component fetching from API
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetch("/api/resource?params")
    .then(r => r.json())
    .then(setData)
    .finally(() => setLoading(false));
}, [deps]);
```

**Mock Data Pattern** (non-DB pages):
```typescript
import { useApp } from "@/components/AppProvider";
const { cases, updateCase } = useApp();
```

### DB Connection Status

**DB-Connected (7 menus)**:
- 대상자 관리 (`/subjects`)
- 센터관리 (`/centers`)
- 연계관리 (`/integrations`)
- 통계 대시보드 (`/stats`)
- 지역자원관리 (`/resources`)
- 업무지원 (`/support`)
- 마감관리 (`/closing`)

**Mock Data (pending DB integration)**:
- 접수/초기개입 (`/intake`)
- 사례관리 (`/cases`, `/cases/[id]`)
- ISP 수립 (`/isp/[caseId]`)
- 권한관리 (`/admin/users`)

### Database Notes

- **BigInt fields**: Always use `serialize()` from `lib/bigint.ts` when returning Prisma results
- **Soft delete**: Most tables use `isDeleted` boolean instead of physical deletion
- **PII separation**: Sensitive data (주민번호, 실명) stored encrypted in separate `tb_subject_pii` table
- **File uploads**: Stored in `form-uploads/` directory, accessed via API only (path traversal protection)

### Environment Setup

Copy `.env.example` to `.env` and configure:
```bash
DATABASE_URL="postgresql://postgres:password@localhost:5432/drug_system?schema=public"
```

Then run:
```bash
npm run db:push     # Create tables
npm run db:seed     # Seed initial data
```

## Deployment Server

- **서버 IP**: 192.168.0.114
- **사용자**: hksun (`hksun@weeslee.co.kr`)
- **프로젝트 경로**: `C:/xampp/htdocs/drug-system-ui-demo`
- **SSH 접속**: `ssh hksun@192.168.0.114`
- **프로세스 관리**: pm2 (`ecosystem.config.js`)

### 배포 워크플로우

```bash
# 1. 로컬: 커밋 & 푸시
git add . && git commit -m "메시지" && git push origin main

# 2. 배포 서버 접속
ssh hksun@192.168.0.114

# 3. 서버: 코드 업데이트 & 재빌드
cd C:/xampp/htdocs/drug-system-ui-demo
git pull origin main
npm run build
pm2 reload drug-system-ui-demo
```

### pm2 주요 명령어

```bash
pm2 start ecosystem.config.js    # 최초 시작
pm2 reload drug-system-ui-demo   # 무중단 재시작 (배포 후)
pm2 status                       # 상태 확인
pm2 logs drug-system-ui-demo     # 실시간 로그
pm2 logs drug-system-ui-demo --err --lines 50  # 에러 로그
```

### 주의사항

- 배포 전 반드시 `npm run build` 먼저 실행 (.next 폴더 필요)
- `logs/` 폴더 없으면 pm2 에러 → `mkdir logs` 먼저
- `npm run dev`는 pm2와 함께 쓰지 않음 (개발 전용)

---

## Important Conventions

- **Korean field naming in Prisma**: Uses `@map()` to map camelCase to snake_case DB columns (e.g., `centerNm @map("center_nm")`)
- **ID formats**: `CTR-XXX-001` (centers), `SB-XXX` (subjects), `CA-XXXX` (cases)
- **Status enums**: Defined as strings with CHECK constraints in comments, not Prisma enums
- **Path alias**: Use `@/` for imports (e.g., `import { prisma } from "@/lib/prisma"`)
