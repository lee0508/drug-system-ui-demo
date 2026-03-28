# 마약류중독자관리시스템 UI 데모 (Next.js App Router)

이 ZIP에는 아래 2가지가 포함됩니다.

1) **Next.js(App Router) 프로토타입 소스**
   - 개요(모듈) 화면에서 클릭하면 업무화면(접수/사례/ISP/연계/통계)으로 이동
   - 상태는 `lib/mockData.ts` 기반의 in-memory 상태(AppProvider)로 동작

2) **단일 HTML 프로토타입**
   - `ui-demo.html`을 브라우저로 바로 열어 화면 확인 가능 (정적 데모)

## 실행 방법(Next.js)
```bash
npm install
npm run dev
```
- 브라우저에서 http://localhost:3000 접속

## 주요 라우트
- / : 개요(모듈)
- /intake : 접수/초기개입
- /cases : 사례 목록
- /cases/[id] : 케이스 상세
- /isp/[caseId] : ISP 수립
- /integrations : 연계관리
- /stats : 통계 대시보드
