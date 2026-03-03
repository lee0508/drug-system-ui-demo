# Weeslee GCP 멀티 프로젝트 운영 전략

**회사**: Weeslee (위즐리앤컴퍼니)
**목적**: 복수의 공공/업무 시스템 UI 데모를 GCP Free Tier 단일 VM에서 운영
**작성일**: 2026-03-03

---

## 1. 전체 구조 개요

```
인터넷
  │
  ▼
Cloudflare (무료 DNS + CDN + SSL)
  │
  ├── drug.weeslee.app   →  GCP e2-micro  :3001  (마약류중독자관리시스템)
  ├── ems.weeslee.app    →  GCP e2-micro  :3002  (응급의료시스템)
  ├── welfare.weeslee.app →  GCP e2-micro  :3003  (사회복지시스템)
  └── [code].weeslee.app →  GCP e2-micro  :30XX  (신규 프로젝트)
                │
             Nginx (가상호스트 라우팅)
                │
         각 PM2 프로세스 (Next.js)
```

**핵심 원칙**: VM 1대 + 도메인 1개 + Nginx 가상호스트 → 프로젝트 무제한 추가

---

## 2. 임시 도메인 명명 규칙

### 2-1. 추천 도메인 구조

```
[시스템코드].demo.weeslee.app
```

| 시스템 | 도메인 | 포트 |
|--------|--------|------|
| 마약류중독자관리시스템 | `drug.demo.weeslee.app` | 3001 |
| 응급의료시스템 | `ems.demo.weeslee.app` | 3002 |
| 사회복지통합시스템 | `welfare.demo.weeslee.app` | 3003 |
| 노인돌봄시스템 | `elderly.demo.weeslee.app` | 3004 |
| 정신건강시스템 | `mental.demo.weeslee.app` | 3005 |
| 지역자원관리 | `resource.demo.weeslee.app` | 3006 |

### 2-2. 도메인 코드 기준표

| 분류 | 코드 예시 |
|------|----------|
| 복지/보건 | `drug`, `welfare`, `mental`, `elderly`, `health` |
| 행정 | `admin`, `portal`, `stats`, `report` |
| 공공안전 | `ems`, `fire`, `police` |
| 교육/훈련 | `edu`, `training`, `cert` |
| 공통 기반 | `auth`, `common`, `api` |

---

## 3. 도메인 확보 방법

### Option A — 유료 도메인 등록 (추천 ⭐)

| 도메인 | 연간 비용 | 등록처 |
|--------|----------|--------|
| `weeslee.app` | ~$14/년 | Google Domains, Namecheap |
| `weeslee.dev` | ~$12/년 | Google Domains |
| `weeslee.kr` | ~₩22,000/년 | 후이즈, 가비아 |

→ 한 번 등록하면 모든 서브도메인 무료 (`*.weeslee.app`)

### Option B — 완전 무료 임시 도메인

| 방법 | 형식 | SSL | 용도 |
|------|------|-----|------|
| **nip.io** | `drug.[GCP_IP].nip.io` | ✅ Let's Encrypt | 도메인 없을 때 즉시 사용 |
| **sslip.io** | `drug.[GCP_IP].sslip.io` | ✅ Let's Encrypt | nip.io 대체 |
| **DuckDNS** | `weeslee-drug.duckdns.org` | ✅ Let's Encrypt | 무료 서브도메인 |

> nip.io 예시: GCP IP가 `34.100.200.50` 이면
> `drug.34-100-200-50.nip.io` 로 바로 사용 가능 (DNS 설정 불필요)

---

## 4. 비용 분석

### 현재 구성 (VM 1대, 프로젝트 여러개)

| 항목 | 월 비용 |
|------|--------|
| GCP e2-micro VM | **$0** (Always Free) |
| 30 GB HDD | **$0** (Always Free) |
| 외부 IP | **$0** (VM 연결 시) |
| Cloudflare DNS / CDN / SSL | **$0** (Free Plan) |
| 도메인 (`weeslee.app`) | **$1.17/월** ($14/년 ÷ 12) |
| **합계** | **~$1.17 / 월** |

### 프로젝트 추가 비용

| 프로젝트 추가 | 비용 |
|--------------|------|
| Nginx 가상호스트 1개 추가 | $0 |
| PM2 프로세스 1개 추가 | $0 |
| 서브도메인 추가 | $0 |
| **추가 비용** | **$0** |

---

## 5. VM 용량 계획

### e2-micro 1대에서 운영 가능한 프로젝트 수

| 자원 | 전체 | 프로젝트당 | 최대 프로젝트 수 |
|------|------|-----------|----------------|
| RAM 1 GB | 1,024 MB | ~120 MB (Next.js standby) | **~6개** |
| 디스크 30 GB | ~25 GB (OS 제외) | ~400 MB | ~60개 |
| 포트 | 65535 | 1개 | 무제한 |

> **6개 이상** 필요 시 → e2-small ($15/월) 또는 VM 추가 검토

### 메모리 절약 팁
- 사용하지 않는 프로젝트는 `pm2 stop [name]`으로 중지
- 요청 있을 때만 `pm2 start`
- Next.js `output: 'standalone'` 빌드로 메모리 ~20% 절감

---

## 6. Nginx 가상호스트 설정 (멀티 프로젝트)

```nginx
# /etc/nginx/sites-available/weeslee-demo

# ─── 마약류중독자관리시스템 ───────────────────────────────
server {
    listen 80;
    server_name drug.demo.weeslee.app;

    location / {
        proxy_pass         http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# ─── 응급의료시스템 ──────────────────────────────────────
server {
    listen 80;
    server_name ems.demo.weeslee.app;

    location / {
        proxy_pass         http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# ─── 신규 프로젝트 추가 시 블록 복사 후 이름/포트만 변경 ──
```

### SSL 적용 (Let's Encrypt — 와일드카드)

```bash
# Cloudflare API 토큰 방식 (와일드카드 *.demo.weeslee.app 한번에 적용)
sudo apt install -y certbot python3-certbot-dns-cloudflare

# Cloudflare API 토큰 저장
echo "dns_cloudflare_api_token = YOUR_CF_API_TOKEN" \
  | sudo tee /etc/letsencrypt/cloudflare.ini
sudo chmod 600 /etc/letsencrypt/cloudflare.ini

# 와일드카드 인증서 발급
sudo certbot certonly \
  --dns-cloudflare \
  --dns-cloudflare-credentials /etc/letsencrypt/cloudflare.ini \
  -d "*.demo.weeslee.app" \
  -d "demo.weeslee.app"

# Nginx에 SSL 적용 (각 server 블록에 추가)
# listen 443 ssl;
# ssl_certificate /etc/letsencrypt/live/demo.weeslee.app/fullchain.pem;
# ssl_certificate_key /etc/letsencrypt/live/demo.weeslee.app/privkey.pem;
```

---

## 7. PM2 멀티 프로젝트 관리

```bash
# 각 프로젝트 시작 (포트 지정)
PORT=3001 pm2 start npm --name "drug-system"    -- start
PORT=3002 pm2 start npm --name "ems-system"     -- start
PORT=3003 pm2 start npm --name "welfare-system" -- start

# 전체 상태 확인
pm2 list

# 재시작
pm2 restart drug-system

# 로그 확인
pm2 logs drug-system --lines 50

# 서버 재부팅 후 자동 시작 등록
pm2 startup
pm2 save
```

### PM2 설정 파일 (`ecosystem.config.js`) — 추천

```javascript
// /home/ubuntu/ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "drug-system",
      cwd:  "/home/ubuntu/projects/drug-system",
      script: "npm",
      args:   "start",
      env:    { PORT: 3001, NODE_ENV: "production" },
    },
    {
      name: "ems-system",
      cwd:  "/home/ubuntu/projects/ems-system",
      script: "npm",
      args:   "start",
      env:    { PORT: 3002, NODE_ENV: "production" },
    },
    // 신규 프로젝트 추가 시 블록 추가
  ],
};
```

```bash
# ecosystem 파일로 전체 시작
pm2 start ecosystem.config.js
```

---

## 8. 프로젝트 추가 절차 (신규 시스템 배포 시)

```
1. 로컬에서 npm run build 실행
2. 빌드 결과물 서버 전송 (scp)
3. /home/ubuntu/projects/[새시스템]/ 에 배치
4. ecosystem.config.js 에 항목 추가
5. Nginx 설정에 server 블록 추가
6. Cloudflare에 A 레코드 추가 ([코드].demo.weeslee.app → GCP IP)
7. pm2 restart ecosystem.config.js --update-env
8. sudo nginx -t && sudo systemctl reload nginx
9. 브라우저 접속 확인
```

---

## 9. 디렉토리 구조 (서버 기준)

```
/home/ubuntu/
├── ecosystem.config.js          ← PM2 전체 설정
└── projects/
    ├── drug-system/             ← 마약류중독자관리시스템
    │   ├── .next/
    │   ├── public/
    │   ├── package.json
    │   └── ...
    ├── ems-system/              ← 응급의료시스템
    ├── welfare-system/          ← 사회복지시스템
    └── [신규 프로젝트]/
```

---

## 10. Cloudflare DNS 설정

GCP 외부 IP가 `34.100.200.50` 인 경우:

| 유형 | 이름 | 값 | 프록시 |
|------|------|-----|--------|
| A | `drug.demo` | `34.100.200.50` | ✅ (Cloudflare CDN 경유) |
| A | `ems.demo` | `34.100.200.50` | ✅ |
| A | `welfare.demo` | `34.100.200.50` | ✅ |
| A | `*.demo` | `34.100.200.50` | ✅ (와일드카드) |

> ✅ Cloudflare 프록시 ON 시: DDoS 방어 + 무료 SSL 자동 적용

---

## 11. 운영 대시보드 (간단한 현황 확인)

```bash
# 전체 프로젝트 상태
pm2 list

# 메모리 사용량 실시간
pm2 monit

# Nginx 상태
sudo systemctl status nginx

# 디스크
df -h /

# CPU/메모리
free -m && top -bn1 | head -20
```

---

## 12. 확장 기준

| 조건 | 조치 |
|------|------|
| RAM 사용률 > 80% 지속 | e2-small로 업그레이드 ($15/월) |
| 프로젝트 수 > 6개 | VM 추가 또는 e2-small 전환 |
| 외부 공개 데모 필요 | Cloudflare Access로 IP 제한 + 비밀번호 보호 |
| 실 사용자 트래픽 | Cloud Run 또는 GKE 검토 |
