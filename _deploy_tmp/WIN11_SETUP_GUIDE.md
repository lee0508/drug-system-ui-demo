# Windows 11 설치 및 사내 공유 가이드

**대상**: 사내 Windows 11 컴퓨터에 설치 후 내부망 공유
**난이도**: 초보자도 가능 (명령어 복사+붙여넣기만 하면 됨)
**작성일**: 2026-03-03

---

## 전체 흐름

```
① Node.js 설치        (5분)
② Git 설치            (3분)
③ 소스코드 받기        (2분)
④ 패키지 설치          (2분)
⑤ 빌드                (3분)
⑥ 서버 실행            (1분)
⑦ 방화벽 허용          (1분)
⑧ IP 확인 후 동료 공유  (1분)
```

**총 소요시간: 약 18분 (최초 1회)**

---

## STEP 1 — Node.js 설치

### 1-1. 설치 파일 다운로드

1. 크롬/엣지 열기
2. 주소창에 입력: `https://nodejs.org`
3. 초록색 **"LTS"** 버튼 클릭 (현재 20.x.x LTS)

   > ⚠️ "Current" 버튼이 아닌 반드시 **"LTS"** 클릭

4. `.msi` 파일 다운로드 완료 대기

### 1-2. 설치 실행

1. 다운로드한 `node-v20.x.x-x64.msi` 더블클릭
2. **"Next"** 계속 클릭 (기본값 유지)
3. 마지막 **"Finish"** 클릭

### 1-3. 설치 확인

1. 키보드 `Windows키 + R` → `cmd` 입력 → Enter
2. 검은 창(명령 프롬프트)에 아래 입력:

   ```cmd
   node -v
   ```

   결과: `v20.x.x` 출력되면 ✅ 성공

   ```cmd
   npm -v
   ```

   결과: `10.x.x` 출력되면 ✅ 성공

---

## STEP 2 — Git 설치

### 2-1. 설치 파일 다운로드

1. 크롬/엣지에서: `https://git-scm.com`
2. **"Download for Windows"** 클릭
3. 자동으로 `.exe` 파일 다운로드 시작

### 2-2. 설치 실행

1. 다운로드한 `Git-x.x.x-64-bit.exe` 더블클릭
2. "이 앱이 변경할 수 있도록 허용할까요?" → **"예"** 클릭
3. 모든 화면에서 **"Next"** 클릭 (기본값 유지)
4. **"Install"** → **"Finish"** 클릭

### 2-3. 설치 확인

명령 프롬프트(cmd)에서:

```cmd
git --version
```

결과: `git version 2.x.x` 출력되면 ✅ 성공

> ⚠️ 설치 후 cmd 창이 열려있던 경우 **닫고 다시 열어야** 인식됩니다.

---

## STEP 3 — 소스코드 받기

### 3-1. 프로젝트 폴더 만들기

명령 프롬프트(cmd)에서:

```cmd
cd C:\
mkdir Projects
cd Projects
```

### 3-2. 소스코드 다운로드

```cmd
git clone https://github.com/lee0508/drug-system-ui-demo.git
```

완료 시 `drug-system-ui-demo` 폴더가 생성됩니다.

### 3-3. 프로젝트 폴더로 이동

```cmd
cd drug-system-ui-demo
```

> 이후 모든 명령어는 **이 폴더 안에서** 실행합니다.

---

## STEP 4 — 패키지 설치

```cmd
npm install
```

- 완료까지 약 1~3분 소요
- `added XXX packages` 메시지 나오면 ✅ 성공
- `node_modules` 폴더가 생성됩니다

---

## STEP 5 — 빌드 (최초 1회)

```cmd
npm run build
```

- 완료까지 약 1~3분 소요
- `✓ Compiled successfully` 메시지 나오면 ✅ 성공
- `.next` 폴더가 생성됩니다

---

## STEP 6 — 서버 실행 (사내 공유 모드)

```cmd
npm run start:network
```

정상 실행 시 출력:

```
▲ Next.js 14.x.x
- Local:     http://localhost:3000
- Network:   http://192.168.1.45:3000
```

> 📌 **`Network:` 줄의 IP 주소**를 메모하세요. 동료들이 이 주소로 접속합니다.
> 📌 이 창(명령 프롬프트)을 **닫지 마세요**. 닫으면 서버가 꺼집니다.

---

## STEP 7 — Windows 11 방화벽 허용

### 방법 A — 팝업창 허용 (자동, 가장 쉬움)

서버 실행 후 아래 팝업창이 뜨면:

```
┌─────────────────────────────────────────────────┐
│  Windows Defender 방화벽에서 이 앱의 일부 기능을  │
│  차단했습니다.                                   │
│                                                  │
│  [ 액세스 허용 ]    [ 취소 ]                     │
└─────────────────────────────────────────────────┘
```

→ **"액세스 허용"** 클릭 ✅

### 방법 B — 수동 설정 (팝업이 안 뜬 경우)

1. `Windows키` → **"방화벽"** 검색
2. **"Windows Defender 방화벽"** 클릭
3. 왼쪽 메뉴 **"고급 설정"** 클릭
4. 왼쪽 **"인바운드 규칙"** 클릭
5. 오른쪽 **"새 규칙..."** 클릭
6. 아래 순서대로 설정:

   | 단계 | 선택 |
   |------|------|
   | 규칙 종류 | **포트** 선택 → 다음 |
   | 프로토콜 | **TCP** 선택 |
   | 포트 | **특정 로컬 포트**: `3000` 입력 → 다음 |
   | 작업 | **연결 허용** → 다음 |
   | 프로필 | 도메인/개인/공용 모두 체크 → 다음 |
   | 이름 | `Drug System Demo` 입력 → **마침** |

### 방법 C — 명령어로 한 번에 (관리자 권한 필요)

`Windows키` → **"명령 프롬프트"** 오른쪽 클릭 → **"관리자 권한으로 실행"**

```cmd
netsh advfirewall firewall add rule name="Drug System Demo Port 3000" dir=in action=allow protocol=TCP localport=3000
```

`확인` 메시지 나오면 ✅ 완료

---

## STEP 8 — 내 IP 주소 확인

명령 프롬프트에서:

```cmd
ipconfig
```

출력 예시:

```
이더넷 어댑터 이더넷:
   IPv4 주소 . . . . : 192.168.1.45   ← 유선 연결 시 이 IP 사용
   서브넷 마스크 . . : 255.255.255.0
   기본 게이트웨이 . : 192.168.1.1

무선 LAN 어댑터 Wi-Fi:
   IPv4 주소 . . . . : 192.168.1.78   ← 무선 연결 시 이 IP 사용
```

**동료에게 알려줄 접속 주소:**

```
http://192.168.1.45:3000
(위에서 확인한 IP + :3000)
```

---

## STEP 9 — 동료 컴퓨터에서 접속

동료는 **아무것도 설치할 필요 없습니다.**

크롬 또는 엣지 주소창에 입력:

```
http://192.168.1.45:3000
```

> `192.168.1.45` 부분을 서버 PC의 실제 IP로 바꾸세요.

---

## IP 주소 고정하기 (권장)

공유기 DHCP로 IP가 바뀌면 매번 IP를 다시 알려야 합니다.
아래 방법으로 고정 IP를 설정하면 **항상 같은 주소**를 사용할 수 있습니다.

### Windows 11 고정 IP 설정

1. `Windows키` → **"설정"** (⚙️)
2. 왼쪽 **"네트워크 및 인터넷"**
3. 연결 방식에 따라:
   - 유선: **"이더넷"** 클릭
   - 무선: **"Wi-Fi"** → 연결된 네트워크 이름 클릭
4. **"IP 할당"** 옆 **"편집"** 클릭
5. 드롭다운 → **"수동"** 선택
6. **"IPv4"** 토글 켜기
7. 아래 값 입력:

   | 항목 | 입력값 | 설명 |
   |------|--------|------|
   | IP 주소 | `192.168.1.200` | 원하는 고정 IP (200번대 권장) |
   | 서브넷 마스크 | `255.255.255.0` | 변경 없음 |
   | 게이트웨이 | `192.168.1.1` | 공유기 주소 (보통 이 값) |
   | 기본 설정 DNS | `8.8.8.8` | Google DNS |
   | 대체 DNS | `8.8.4.4` | Google DNS 보조 |

8. **"저장"** 클릭

> ⚠️ 공유기 주소(게이트웨이)가 다를 수 있습니다. `ipconfig`의 **"기본 게이트웨이"** 값을 확인하세요.

---

## 서버 자동 실행 설정 (PC 재시작 후에도 유지)

매번 cmd 창을 열고 명령어를 입력하지 않아도 되도록 PM2를 설정합니다.

### PM2 설치

```cmd
npm install -g pm2
npm install -g pm2-windows-startup
```

### PM2로 서버 등록

```cmd
cd C:\Projects\drug-system-ui-demo
pm2 start npm --name "drug-system" -- run start:network
pm2-startup install
pm2 save
```

### Windows 시작 프로그램 등록 (추가 방법)

또는 배치 파일로 시작프로그램에 등록:

1. 아래 내용으로 `start-drug-system.bat` 파일 만들기:

   ```bat
   @echo off
   cd C:\Projects\drug-system-ui-demo
   npm run start:network
   ```

2. `Windows키 + R` → `shell:startup` → Enter
3. 위 `.bat` 파일을 이 폴더로 복사

---

## 문제 해결

### ❌ `npm : 이 시스템에서 스크립트를 실행할 수 없습니다`

PowerShell 실행 정책 문제입니다.

```powershell
# PowerShell을 관리자 권한으로 실행 후:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

→ `Y` 입력 후 Enter

### ❌ 다른 컴퓨터에서 접속 불가

1. 서버 PC에서 `npm run start:network` 실행 중인지 확인
2. 방화벽 포트 3000 허용 확인 (STEP 7)
3. 같은 네트워크(같은 공유기)인지 확인
4. 회사 보안 솔루션이 막는 경우 → IT 담당자에게 **포트 3000 허용** 요청

### ❌ `node_modules` 설치 중 에러

```cmd
npm cache clean --force
npm install
```

### ❌ 빌드 실패

```cmd
# 빌드 캐시 삭제 후 재시도
rmdir /s /q .next
npm run build
```

---

## 한눈에 보는 명령어 순서

```cmd
:: 최초 1회 설치
cd C:\Projects
git clone https://github.com/lee0508/drug-system-ui-demo.git
cd drug-system-ui-demo
npm install
npm run build

:: 서버 실행 (매번)
npm run start:network

:: 내 IP 확인
ipconfig

:: 동료에게 알려줄 주소
:: http://[IPv4주소]:3000
```

---

## 동료에게 공유할 메시지 템플릿

```
안녕하세요,
마약류중독자관리시스템 UI 데모를 공유합니다.

접속 주소: http://192.168.1.45:3000
(같은 사무실 네트워크에서만 접속 가능)

크롬 또는 엣지에서 위 주소를 입력하시면 됩니다.
별도 설치 없이 바로 접속하실 수 있습니다.
```

> `192.168.1.45` 부분을 실제 서버 IP로 바꿔서 공유하세요.
