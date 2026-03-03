# 개발 환경 설치 및 실행 가이드

**프로젝트**: 마약류중독자관리시스템 UI 데모
**GitHub**: https://github.com/lee0508/drug-system-ui-demo
**작성일**: 2026-03-03

---

## 빠른 시작 (요약)

```bash
# 1. 소스 받기
git clone https://github.com/lee0508/drug-system-ui-demo.git

# 2. 폴더 이동
cd drug-system-ui-demo

# 3. 패키지 설치
npm install

# 4. 개발 서버 실행
npm run dev

# 5. 브라우저에서 확인
# → http://localhost:3000
```

---

## 1. 사전 요구사항

### 필수 소프트웨어

| 소프트웨어 | 최소 버전 | 확인 명령어 |
|-----------|----------|------------|
| **Node.js** | 18.17 이상 (LTS 권장) | `node -v` |
| **npm** | 9.x 이상 | `npm -v` |
| **Git** | 2.x 이상 | `git --version` |

> ⚠️ Node.js 버전이 18.17 미만이면 Next.js 14가 실행되지 않습니다.

---

## 2. Node.js 설치 (미설치 시)

### Windows

1. [https://nodejs.org](https://nodejs.org) 접속
2. **LTS 버전** 다운로드 (현재 20.x 권장)
3. 설치 파일 실행 → 기본값으로 설치
4. 설치 확인:
   ```cmd
   node -v
   npm -v
   ```

### macOS

```bash
# Homebrew가 있는 경우
brew install node

# 없는 경우 nodejs.org에서 .pkg 파일 다운로드 후 설치
```

### Linux (Ubuntu / Debian)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v
```

---

## 3. Git 설치 (미설치 시)

### Windows

1. [https://git-scm.com](https://git-scm.com) 접속
2. **Download for Windows** 클릭 → 설치
3. 설치 중 기본값 유지
4. 확인:
   ```cmd
   git --version
   ```

### macOS

```bash
# Xcode Command Line Tools 설치 시 자동 포함
xcode-select --install

# 또는 Homebrew로
brew install git
```

### Linux (Ubuntu)

```bash
sudo apt install -y git
git --version
```

---

## 4. 소스코드 받기 (git clone)

```bash
# 원하는 폴더에서 실행
git clone https://github.com/lee0508/drug-system-ui-demo.git

# 예: C:\Users\사용자명\Projects\ 에 받는 경우
cd C:\Users\사용자명\Projects
git clone https://github.com/lee0508/drug-system-ui-demo.git

# 클론 후 폴더 진입
cd drug-system-ui-demo
```

> ✅ `drug-system-ui-demo/` 폴더가 생성되면 성공입니다.

---

## 5. 패키지 설치

```bash
# drug-system-ui-demo 폴더 안에서 실행
npm install
```

설치 완료 시 `node_modules/` 폴더가 생성됩니다.
설치 시간: 약 1~3분 (인터넷 속도에 따라 다름)

> ⚠️ 에러 발생 시 → [문제 해결](#8-문제-해결) 섹션 참고

---

## 6. 개발 서버 실행

```bash
npm run dev
```

정상 실행 시 다음과 같이 출력됩니다:

```
▲ Next.js 14.x.x
- Local:   http://localhost:3000
- Network: http://192.168.x.x:3000

✓ Ready in 2.1s
```

**브라우저 주소창**에 입력:

```
http://localhost:3000
```

---

## 7. 화면 구성 안내

| URL | 화면 |
|-----|------|
| `http://localhost:3000` | 시스템 메인 (전체 구조도) |
| `http://localhost:3000/public/ui-demo.html` | 정적 UI 개요도 |
| `http://localhost:3000/subjects` | 대상자 관리 |
| `http://localhost:3000/cases` | 사례 목록 |
| `http://localhost:3000/intake` | 접수/초기개입 |
| `http://localhost:3000/stats` | 통계 대시보드 |
| `http://localhost:3000/centers` | 센터 관리 |
| `http://localhost:3000/admin/users` | 권한 관리 |
| `http://localhost:3000/support` | 업무지원 |
| `http://localhost:3000/closing` | 마감 관리 |

---

## 8. 문제 해결

### ❌ `npm install` 중 에러

```bash
# npm 캐시 삭제 후 재시도
npm cache clean --force
npm install
```

### ❌ `node: command not found`

Node.js가 설치되지 않았거나 PATH가 설정되지 않은 상태입니다.
→ [2. Node.js 설치](#2-nodejs-설치-미설치-시) 섹션으로 이동

### ❌ `Error: EADDRINUSE: address already in use :::3000`

3000 포트가 이미 사용 중입니다. 다른 포트로 실행:

```bash
# Windows
set PORT=3001 && npm run dev

# macOS / Linux
PORT=3001 npm run dev
```

→ `http://localhost:3001` 로 접속

### ❌ `git clone` 시 인증 오류

저장소가 Private인 경우 GitHub 계정 로그인이 필요합니다.
담당자(weeslee)에게 저장소 접근 권한 요청 또는 아래 방법 사용:

```bash
# GitHub Personal Access Token 사용
git clone https://<TOKEN>@github.com/lee0508/drug-system-ui-demo.git
```

### ❌ Windows에서 한글 경로 오류

프로젝트 폴더 경로에 한글이 포함되면 오류가 발생할 수 있습니다.
→ `C:\Projects\drug-system-ui-demo` 처럼 **영문 경로**를 사용하세요.

### ❌ `npm run dev` 후 빈 페이지

브라우저 캐시 문제일 수 있습니다.
→ `Ctrl + Shift + R` (강제 새로고침) 또는 시크릿 창에서 접속

---

## 9. 코드 업데이트 (최신 소스 받기)

```bash
# 프로젝트 폴더 안에서
git pull origin main

# 의존성 변경이 있는 경우
npm install
```

---

## 10. 개발 서버 종료

터미널에서 `Ctrl + C` 입력

---

## 11. 운영체제별 빠른 설치 순서

### Windows (명령 프롬프트 / PowerShell)

```cmd
REM 1. Node.js 설치: nodejs.org → LTS 다운로드
REM 2. Git 설치: git-scm.com → Download

REM 3. 소스 받기
cd C:\Projects
git clone https://github.com/lee0508/drug-system-ui-demo.git
cd drug-system-ui-demo

REM 4. 패키지 설치
npm install

REM 5. 실행
npm run dev
```

### macOS (터미널)

```bash
# 1. Homebrew 설치 (없는 경우)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 2. Node.js / Git 설치
brew install node git

# 3. 소스 받기
cd ~/Projects
git clone https://github.com/lee0508/drug-system-ui-demo.git
cd drug-system-ui-demo

# 4. 패키지 설치
npm install

# 5. 실행
npm run dev
```

### Linux / Ubuntu (터미널)

```bash
# 1. Node.js 20 설치
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git

# 2. 소스 받기
cd ~/projects
git clone https://github.com/lee0508/drug-system-ui-demo.git
cd drug-system-ui-demo

# 3. 패키지 설치
npm install

# 4. 실행
npm run dev
```

---

## 12. 네트워크 내 다른 기기에서 접속하기

같은 와이파이 네트워크 안에서 다른 기기(스마트폰, 태블릿 등)로 확인할 때:

```bash
# 내 IP 확인
# Windows:
ipconfig
# macOS/Linux:
ifconfig | grep "inet "

# 실행 시 네트워크 접속 허용
npm run dev -- --hostname 0.0.0.0
```

→ 다른 기기에서 `http://[내IP]:3000` 으로 접속

---

## 문의

- **GitHub**: https://github.com/lee0508/drug-system-ui-demo
- **담당**: Weeslee (위즐리앤컴퍼니)
