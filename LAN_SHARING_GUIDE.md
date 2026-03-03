# 사내 내부망 공유 가이드

**목적**: 사무실 내 한 컴퓨터(서버 역할)에서 실행 후, 같은 와이파이/내부망의 다른 PC에서 접속
**작성일**: 2026-03-03

---

## 구조 개요

```
[서버 컴퓨터]                    [접속하는 컴퓨터들]
npm run start:network   ←──────  http://192.168.x.x:3000
(항상 켜둬야 함)                  크롬/엣지에서 주소 입력만 하면 됨
```

---

## STEP 1 — 서버 컴퓨터 준비

> 프로젝트가 설치된 컴퓨터에서 실행합니다.

### 1-1. 소스 설치 (처음 1회)

```bash
git clone https://github.com/lee0508/drug-system-ui-demo.git
cd drug-system-ui-demo
npm install
```

### 1-2. 프로덕션 빌드 (처음 1회, 업데이트 시마다)

```bash
npm run build
```

완료까지 약 1~3분 소요됩니다.

### 1-3. 네트워크 공유 모드로 실행

```bash
npm run start:network
```

정상 실행 시 출력:

```
▲ Next.js 14.x.x
- Local:     http://localhost:3000
- Network:   http://192.168.1.45:3000   ← 이 주소를 동료에게 알려주세요
```

> ✅ `Network:` 줄에 표시된 IP 주소가 **동료들이 접속할 주소**입니다.
> ✅ 이 창(터미널)을 **닫지 않아야** 다른 사람이 접속할 수 있습니다.

---

## STEP 2 — 서버 컴퓨터 IP 주소 확인

```cmd
ipconfig
```

출력 예시:

```
이더넷 어댑터 이더넷:
   IPv4 주소 . . . . : 192.168.1.45   ← 이 숫자가 서버 IP
   서브넷 마스크 . . : 255.255.255.0
   기본 게이트웨이 . : 192.168.1.1

무선 LAN 어댑터 Wi-Fi:
   IPv4 주소 . . . . : 192.168.1.78   ← Wi-Fi 연결 시 이 IP
```

> 유선(이더넷)이면 이더넷 IP, 무선(WiFi)이면 Wi-Fi IP를 사용합니다.

---

## STEP 3 — Windows 방화벽 허용 (최초 1회)

`npm run start:network` 실행 시 Windows 방화벽 허용 팝업이 뜨면 **"액세스 허용"** 클릭합니다.

팝업이 안 뜨거나 다른 컴퓨터에서 접속이 안 될 경우, **수동으로 방화벽 규칙 추가**:

### 방법 A — 명령 프롬프트 (관리자 권한)

```cmd
netsh advfirewall firewall add rule name="Drug System Demo Port 3000" dir=in action=allow protocol=TCP localport=3000
```

### 방법 B — Windows 방화벽 설정 UI

```
제어판 → Windows Defender 방화벽
→ 고급 설정 → 인바운드 규칙 → 새 규칙
→ 포트 → TCP → 특정 로컬 포트: 3000
→ 연결 허용 → 다음 → 다음 → 이름: "Drug System 3000"
→ 마침
```

---

## STEP 4 — 다른 컴퓨터에서 접속

같은 사내 네트워크에 연결된 모든 컴퓨터에서:

**크롬 / 엣지 주소창에 입력:**

```
http://192.168.1.45:3000
```

> `192.168.1.45` 부분을 **서버 컴퓨터의 실제 IP**로 바꾸세요.

### 접속 가능 기기

| 기기 | 조건 | 접속 방법 |
|------|------|----------|
| 사무실 PC | 같은 유선 LAN | `http://서버IP:3000` |
| 노트북 | 같은 Wi-Fi | `http://서버IP:3000` |
| 스마트폰 | 같은 Wi-Fi | 브라우저에 주소 입력 |
| 태블릿 | 같은 Wi-Fi | 브라우저에 주소 입력 |

---

## STEP 5 — 서버를 항상 켜두기 (PM2 사용)

터미널 창을 닫아도 서버가 계속 실행되도록 PM2 설치:

### PM2 설치 (서버 컴퓨터에서 1회)

```bash
npm install -g pm2
npm install -g pm2-windows-startup
```

### PM2로 서버 실행

```bash
cd drug-system-ui-demo
pm2 start npm --name "drug-system" -- run start:network
pm2 save
```

### Windows 부팅 시 자동 시작 등록

```bash
pm2-startup install
pm2 save
```

### PM2 관리 명령어

```bash
pm2 list              # 실행 중인 프로세스 확인
pm2 stop drug-system  # 서버 중지
pm2 restart drug-system  # 서버 재시작
pm2 logs drug-system  # 로그 확인
```

> ✅ PM2 사용 시 컴퓨터를 재시작해도 서버가 **자동으로 켜집니다**.

---

## 자주 묻는 질문

### Q. IP 주소가 바뀌면 어떻게 하나요?

사내 공유기에서 **DHCP 고정 IP** 설정을 하거나,
Windows 네트워크 설정에서 **고정 IP**를 지정합니다.

**Windows 고정 IP 설정:**

```
설정 → 네트워크 및 인터넷 → 이더넷(또는 Wi-Fi)
→ IP 할당: 수동 → IPv4 켜기
→ IP 주소: 192.168.1.45 (원하는 주소)
→ 서브넷 마스크: 255.255.255.0
→ 게이트웨이: 192.168.1.1 (공유기 주소)
→ DNS: 8.8.8.8
→ 저장
```

### Q. 숫자 IP 대신 이름으로 접속할 수 없나요?

각 접속 PC의 `hosts` 파일에 별명을 추가하면 됩니다.

```
# C:\Windows\System32\drivers\etc\hosts 파일 (관리자 권한으로 편집)
192.168.1.45    drug-demo
```

저장 후 브라우저에서:
```
http://drug-demo:3000
```

### Q. 접속이 안 됩니다.

체크리스트:

```
[ ] 서버 컴퓨터에서 npm run start:network 실행 중인가?
[ ] 서버 컴퓨터와 내 컴퓨터가 같은 네트워크인가?
[ ] IP 주소를 정확히 입력했는가? (http:// 포함)
[ ] Windows 방화벽에서 3000 포트가 허용됐는가?
[ ] 회사 보안 솔루션(방화벽)이 포트를 차단하고 있지 않은가?
```

보안 솔루션으로 막힌 경우 IT 담당자에게 **포트 3000 오픈 요청**이 필요합니다.

### Q. 80번 포트(기본 포트)를 쓸 수 없나요?

80번 포트 사용 시 `http://192.168.1.45` (포트번호 없이) 접속 가능합니다.

```bash
# 관리자 권한으로 실행해야 함
npm run build
npx next start -H 0.0.0.0 -p 80
```

> Windows에서 80 포트는 관리자 권한이 필요합니다. XAMPP Apache가 실행 중이면 충돌 발생 → 먼저 Apache를 중지하세요.

---

## 빠른 공유 절차 (요약 카드)

```
┌─────────────────────────────────────────────────────────┐
│  서버 컴퓨터 (한 번만 설치)                               │
│                                                         │
│  1. git clone https://github.com/lee0508/drug-system-   │
│         ui-demo.git                                     │
│  2. cd drug-system-ui-demo                              │
│  3. npm install                                         │
│  4. npm run build                                       │
│  5. npm run start:network                               │
│  6. ipconfig 로 IP 확인 → 동료에게 공유                 │
│                                                         │
│  방화벽: "액세스 허용" 클릭 or 포트 3000 수동 허용       │
├─────────────────────────────────────────────────────────┤
│  동료 컴퓨터 (설치 불필요)                               │
│                                                         │
│  크롬/엣지 주소창 입력:                                  │
│  http://[서버IP]:3000                                   │
└─────────────────────────────────────────────────────────┘
```
