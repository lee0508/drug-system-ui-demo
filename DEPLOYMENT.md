# 마약류중독자관리시스템 UI 데모 — 배포 가이드

> 작성일: 2026-03-03
> 대상 플랫폼: GCP Cloud Run, GCP Compute Engine, 임대형 VPS(Ubuntu), 로컬 개발

---

## 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [권장 서버 사양](#2-권장-서버-사양)
3. [공통 사전 요건](#3-공통-사전-요건)
4. [로컬 개발 환경 실행](#4-로컬-개발-환경-실행)
5. [프로덕션 빌드 생성](#5-프로덕션-빌드-생성)
6. [GCP Cloud Run 배포 (권장)](#6-gcp-cloud-run-배포-권장)
7. [GCP Compute Engine 배포](#7-gcp-compute-engine-배포)
8. [임대형 VPS 서버 배포 (Ubuntu)](#8-임대형-vps-서버-배포-ubuntu)
9. [Nginx 리버스 프록시 설정](#9-nginx-리버스-프록시-설정)
10. [HTTPS 인증서 설정 (Lets Encrypt)](#10-https-인증서-설정-lets-encrypt)
11. [PM2로 프로세스 관리](#11-pm2로-프로세스-관리)
12. [환경 변수 관리](#12-환경-변수-관리)
13. [배포 후 확인 체크리스트](#13-배포-후-확인-체크리스트)
14. [문제 해결 (Troubleshooting)](#14-문제-해결-troubleshooting)

---

## 1. 프로젝트 개요

| 항목 | 내용 |
| --- | --- |
| 프레임워크 | Next.js 14 (App Router) |
| 언어 | TypeScript |
| 상태 관리 | React Context (in-memory, 별도 DB 없음) |
| 외부 API | 없음 (mockData 기반 순수 프론트엔드) |
| 최소 Node.js | v18.17.0 이상 |
| 권장 Node.js | v20 LTS 또는 v22 LTS |
| 기본 포트 | 3000 (변경 가능) |

### 주요 라우트

| 경로 | 화면 |
| --- | --- |
| `/` | 개요(모듈) |
| `/intake` | 접수/초기개입 |
| `/cases` | 사례 목록 |
| `/cases/[id]` | 케이스 상세 |
| `/isp/[caseId]` | ISP 수립 |
| `/integrations` | 연계관리 |
| `/stats` | 통계 대시보드 |

---

## 2. 권장 서버 사양

> 이 프로젝트는 **순수 프론트엔드(in-memory 상태)**로 DB·외부 API가 없으므로,
> 일반 Next.js 앱보다 서버 자원 소모가 적습니다.

---

### 2-A. 개발 환경 서버 사양

개발자 로컬 PC 또는 개발 전용 서버에서 `npm run dev`를 실행하는 환경입니다.

#### 개발 PC (로컬) 최소 사양

| 항목 | 최소 | 권장 |
| --- | --- | --- |
| CPU | 2코어 이상 | 4코어 이상 |
| 메모리 | 4 GB RAM | 8 GB RAM 이상 |
| 디스크 | 5 GB 여유 공간 | 20 GB SSD 여유 |
| Node.js | v18.17.0 | v20 LTS (권장) |
| OS | Windows 10 / macOS 12 / Ubuntu 20.04 | Ubuntu 22.04 LTS |

#### 개발 전용 서버 (팀 공유 dev 서버)

| 항목 | 사양 |
| --- | --- |
| CPU | 2 vCPU |
| 메모리 | 2 GB RAM |
| 디스크 | 30 GB SSD |
| OS | Ubuntu 22.04 LTS |
| 포트 | 3000 (방화벽 팀 내부 IP만 허용) |

#### 개발 환경 소프트웨어 스택

| 소프트웨어 | 버전 | 역할 |
| --- | --- | --- |
| Node.js | v20 LTS | 런타임 |
| npm | v10 이상 | 패키지 관리 |
| Git | 2.x 이상 | 소스 관리 |
| VS Code | 최신 | 에디터 (권장) |

> 개발 환경에서는 Nginx, PM2, HTTPS 설정 **불필요**합니다.
> `npm run dev`만으로 Hot Reload 개발이 가능합니다.

---

### 2-B. 실 서비스(프로덕션) 서버 사양

실제 사용자가 접속하는 운영 서버 환경입니다.

#### 규모별 최소/권장 사양

| 규모 | CPU | 메모리 | 디스크 | 네트워크 | 동시 사용자 |
| --- | --- | --- | --- | --- | --- |
| **소규모** (기관 내부용) | 2 vCPU | 2 GB RAM | 40 GB SSD | 100 Mbps | ~30명 |
| **중규모** (부서 단위) | 4 vCPU | 4 GB RAM | 80 GB SSD | 1 Gbps | ~100명 |
| **대규모** (전국 서비스) | 8 vCPU | 8 GB RAM | 160 GB SSD | 1 Gbps | ~500명 |
| **Cloud Run** (GCP) | 자동 (최대 4 vCPU) | 자동 (512 MB~8 GB) | 불필요 | 자동 | 무제한 스케일 |

#### 프로덕션 필수 소프트웨어 스택

| 소프트웨어 | 버전 | 역할 |
| --- | --- | --- |
| OS | Ubuntu 22.04 LTS | 서버 운영체제 |
| Node.js | v20 LTS | Next.js 런타임 |
| npm | v10 이상 | 패키지 관리 |
| Nginx | 1.24 이상 | 리버스 프록시 / HTTPS 종단 |
| PM2 | 5.x | 프로세스 데몬화 / 자동 재시작 |
| Certbot | 최신 | Let's Encrypt SSL 인증서 |

#### GCP 인스턴스 타입 추천

| 인스턴스 | vCPU | 메모리 | 월 비용 (서울) | 적합 용도 |
| --- | --- | --- | --- | --- |
| `e2-micro` | 0.25 | 1 GB | 약 $6 | 개발/테스트 전용 |
| `e2-small` | 0.5 | 2 GB | 약 $13 | 소규모 운영 (기관 내부) |
| `e2-medium` | 1 | 4 GB | 약 $27 | 중규모 운영 |
| `n2-standard-2` | 2 | 8 GB | 약 $70 | 대규모 / 고가용성 |

#### 임대형 VPS 추천 상품

| 업체 | 상품명 | CPU | RAM | 디스크 | 월 비용 |
| --- | --- | --- | --- | --- | --- |
| 카페24 | 클라우드 Standard S1 | 1 vCPU | 1 GB | 30 GB SSD | ₩11,000 |
| 가비아 | 클라우드 서버 A1 | 2 vCPU | 2 GB | 50 GB SSD | ₩22,000 |
| AWS EC2 | t3.small | 2 vCPU | 2 GB | 20 GB EBS | 약 $16 |
| AWS EC2 | t3.medium | 2 vCPU | 4 GB | 20 GB EBS | 약 $33 |
| Vultr | Cloud Compute 2GB | 1 vCPU | 2 GB | 55 GB SSD | $12 |

#### 빌드 후 디스크 용량 참고

```text
node_modules/    약 180 MB  (npm ci --omit=dev 시 약 80 MB)
.next/           약 30~60 MB
소스 코드         약 1 MB
─────────────────────────────────────────
합계 (빌드 후)    약 120~250 MB
```

---

### 2-C. 개발 vs 프로덕션 환경 비교

| 항목 | 개발 환경 | 프로덕션 환경 |
| --- | --- | --- |
| 실행 명령 | `npm run dev` | `pm2 start ecosystem.config.js` |
| 빌드 필요 | 불필요 (자동) | 필요 (`npm run build` 선행) |
| Hot Reload | 지원 | 미지원 |
| Nginx | 불필요 | 필수 (80/443 프록시) |
| HTTPS | 불필요 | 필수 (Certbot) |
| PM2 | 불필요 | 필수 (프로세스 유지) |
| 권장 RAM | 4 GB 이상 | 2 GB 이상 |
| 권장 디스크 | 5 GB 여유 | 40 GB SSD |

---

## 3. 공통 사전 요건

### Node.js 설치

```bash
# Ubuntu/Debian (NodeSource 공식 저장소 이용)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 버전 확인
node -v   # v20.x.x 이상
npm -v    # 10.x.x 이상
```

### 프로젝트 파일 준비

```bash
# Git을 사용하는 경우
git clone <your-repo-url> drug-system-ui-demo
cd drug-system-ui-demo

# 또는 ZIP 파일 업로드 후 압축 해제
unzip drug-system-ui-demo.zip
cd drug-system-ui-demo
```

---

## 4. 로컬 개발 환경 실행

```bash
cd drug-system-ui-demo

# 의존성 설치
npm install

# 개발 서버 실행 (Hot Reload 지원)
npm run dev
```

브라우저에서 접속: <http://localhost:3000>

### 포트 변경 (선택)

```bash
# 특정 포트 지정
npm run dev -- -p 8080
```

---

## 5. 프로덕션 빌드 생성

```bash
cd drug-system-ui-demo

# 의존성 설치
npm install

# 프로덕션 빌드
npm run build

# 빌드 결과 확인 (.next/ 디렉토리 생성됨)
ls -la .next/

# 프로덕션 서버 실행
npm run start
# → http://localhost:3000
```

> **빌드 결과물**: `.next/` 디렉토리
> **배포 필수 파일**: `package.json`, `package-lock.json`, `.next/`, `public/`(있을 경우), `next.config.js`

---

## 6. GCP Cloud Run 배포 (권장)

**Cloud Run은 컨테이너 기반 서버리스 플랫폼으로, 인프라 관리 없이 자동 스케일링이 됩니다.**

### 6-1. 사전 준비

```bash
# Google Cloud SDK 설치 (로컬 PC)
# https://cloud.google.com/sdk/docs/install

# SDK 초기화 및 로그인
gcloud init
gcloud auth login

# 프로젝트 설정
gcloud config set project YOUR_PROJECT_ID
```

### 6-2. Dockerfile 생성

프로젝트 루트에 `Dockerfile` 파일을 생성합니다.

```dockerfile
# ---------- 빌드 스테이지 ----------
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---------- 실행 스테이지 ----------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# 필요한 파일만 복사
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public

# 프로덕션 의존성만 설치
RUN npm ci --omit=dev

EXPOSE 3000

CMD ["npm", "run", "start"]
```

### 6-3. .dockerignore 생성

```text
node_modules
.next
.git
*.md
.env*.local
```

### 6-4. Cloud Run 배포

```bash
# 1. Container Registry에 이미지 빌드 및 푸시
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/drug-system-ui-demo

# 2. Cloud Run에 배포
gcloud run deploy drug-system-ui-demo \
  --image gcr.io/YOUR_PROJECT_ID/drug-system-ui-demo \
  --platform managed \
  --region asia-northeast3 \
  --allow-unauthenticated \
  --port 3000 \
  --memory 512Mi \
  --cpu 1

# 3. 배포된 URL 확인
gcloud run services describe drug-system-ui-demo \
  --platform managed \
  --region asia-northeast3 \
  --format 'value(status.url)'
```

> 배포 완료 후 `https://drug-system-ui-demo-xxxx-du.a.run.app` 형태의 URL이 발급됩니다.

### 6-5. 커스텀 도메인 연결 (선택)

```bash
# Cloud Run에 도메인 매핑
gcloud beta run domain-mappings create \
  --service drug-system-ui-demo \
  --domain your-domain.com \
  --region asia-northeast3
```

### 6-6. Cloud Run 비용 참고

| 항목 | 무료 한도 (월) |
| --- | --- |
| 요청 수 | 200만 건 |
| CPU | 180,000 vCPU·초 |
| 메모리 | 360,000 GB·초 |

> 데모/소규모 운영 시 **무료 티어 내에서 운영 가능**합니다.

---

## 7. GCP Compute Engine 배포

**VM 인스턴스에 직접 Node.js를 설치하고 운영하는 방식입니다.**

### 7-1. VM 인스턴스 생성

```bash
# e2-small 권장 (개발/테스트는 e2-micro)
gcloud compute instances create drug-ui-server \
  --zone=asia-northeast3-a \
  --machine-type=e2-small \
  --image-family=ubuntu-2204-lts \
  --image-project=ubuntu-os-cloud \
  --boot-disk-size=40GB \
  --tags=http-server,https-server

# 방화벽 규칙 (포트 80, 443 허용)
gcloud compute firewall-rules create allow-http-https \
  --allow tcp:80,tcp:443 \
  --target-tags=http-server,https-server
```

### 7-2. VM 접속 및 환경 설정

```bash
# SSH 접속
gcloud compute ssh drug-ui-server --zone=asia-northeast3-a

# VM 내부에서 실행
sudo apt-get update
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs nginx

# Node.js 버전 확인
node -v
```

### 7-3. 프로젝트 배포

```bash
# 프로젝트 디렉토리 생성
sudo mkdir -p /var/www/drug-system-ui-demo
sudo chown $USER:$USER /var/www/drug-system-ui-demo

# 파일 복사 (로컬에서 실행)
gcloud compute scp --recurse \
  /path/to/drug-system-ui-demo/* \
  drug-ui-server:/var/www/drug-system-ui-demo/ \
  --zone=asia-northeast3-a

# VM에서 빌드
cd /var/www/drug-system-ui-demo
npm install
npm run build
```

이후 **[11. PM2 프로세스 관리](#11-pm2로-프로세스-관리)** 및 **[9. Nginx 설정](#9-nginx-리버스-프록시-설정)** 섹션을 따릅니다.

---

## 8. 임대형 VPS 서버 배포 (Ubuntu)

**카페24, 가비아, AWS EC2, Vultr, Linode 등 Ubuntu 22.04 기준입니다.**

### 8-1. 서버 초기 설정

```bash
# 서버 SSH 접속
ssh root@YOUR_SERVER_IP

# 패키지 업데이트
sudo apt-get update && sudo apt-get upgrade -y

# 필수 도구 설치
sudo apt-get install -y curl git nginx ufw

# 방화벽 설정
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status
```

### 8-2. Node.js 설치

```bash
# NodeSource를 통한 Node.js 20 LTS 설치
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 버전 확인
node -v   # v20.x.x
npm -v    # 10.x.x
```

### 8-3. 배포용 사용자 생성 (보안 권장)

```bash
# 배포 전용 사용자 생성
sudo adduser deploy
sudo usermod -aG sudo deploy

# deploy 사용자로 전환
su - deploy
```

### 8-4. 프로젝트 업로드

#### 방법 A: SCP로 파일 업로드

```bash
# 로컬 PC에서 실행
scp -r /path/to/drug-system-ui-demo deploy@YOUR_SERVER_IP:~/
```

#### 방법 B: Git 클론

```bash
# 서버에서 실행
cd ~
git clone <your-repo-url> drug-system-ui-demo
```

#### 방법 C: ZIP 파일 업로드 후 해제

```bash
# 로컬에서 업로드
scp drug-system-ui-demo.zip deploy@YOUR_SERVER_IP:~/

# 서버에서 해제
sudo apt-get install -y unzip
unzip drug-system-ui-demo.zip
```

### 8-5. 빌드 및 실행

```bash
cd ~/drug-system-ui-demo

# 의존성 설치
npm install

# 프로덕션 빌드
npm run build

# 빌드 확인
ls -la .next/
```

---

## 9. Nginx 리버스 프록시 설정

**Next.js 앱(포트 3000)을 Nginx가 80/443 포트로 중계합니다.**

### 9-1. Nginx 설정 파일 생성

```bash
sudo nano /etc/nginx/sites-available/drug-system-ui-demo
```

아래 내용을 입력합니다:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    # 도메인이 없는 경우: server_name _;

    # 요청 크기 제한
    client_max_body_size 10M;

    # 프록시 설정
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
    }

    # Next.js 정적 파일 직접 서빙 (성능 최적화)
    location /_next/static/ {
        alias /home/deploy/drug-system-ui-demo/.next/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 9-2. 설정 활성화

```bash
# 심볼릭 링크 생성
sudo ln -s /etc/nginx/sites-available/drug-system-ui-demo \
           /etc/nginx/sites-enabled/

# 기본 설정 비활성화 (선택)
sudo rm -f /etc/nginx/sites-enabled/default

# 설정 문법 검사
sudo nginx -t

# Nginx 재시작
sudo systemctl restart nginx
sudo systemctl enable nginx

# 상태 확인
sudo systemctl status nginx
```

---

## 10. HTTPS 인증서 설정 (Lets Encrypt)

**도메인이 있을 경우 무료 SSL 인증서를 발급받습니다.**

```bash
# Certbot 설치
sudo apt-get install -y certbot python3-certbot-nginx

# 인증서 발급 (도메인 소유 확인 자동)
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# 자동 갱신 확인
sudo certbot renew --dry-run
```

Certbot이 Nginx 설정을 자동으로 수정하여 HTTPS(443)를 활성화합니다.

> 인증서는 **90일마다 자동 갱신**됩니다 (cron/systemd timer 자동 등록됨).

---

## 11. PM2로 프로세스 관리

**PM2는 Node.js 프로세스 데몬화, 자동 재시작, 로그 관리를 제공합니다.**

### 11-1. PM2 설치

```bash
sudo npm install -g pm2
```

### 11-2. ecosystem.config.js 생성

프로젝트 루트에 파일을 생성합니다:

```javascript
module.exports = {
  apps: [
    {
      name: "drug-system-ui-demo",
      script: "node_modules/.bin/next",
      args: "start",
      cwd: "/home/deploy/drug-system-ui-demo",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      // 자동 재시작 설정
      watch: false,
      max_memory_restart: "512M",
      // 로그 설정
      out_file: "/home/deploy/logs/drug-ui-out.log",
      error_file: "/home/deploy/logs/drug-ui-error.log",
      merge_logs: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss",
    },
  ],
};
```

### 11-3. PM2 실행

```bash
# 로그 디렉토리 생성
mkdir -p ~/logs

# PM2로 앱 시작
cd ~/drug-system-ui-demo
pm2 start ecosystem.config.js

# 상태 확인
pm2 status
pm2 logs drug-system-ui-demo

# 서버 재부팅 후 자동 시작 등록
pm2 startup systemd -u deploy --hp /home/deploy
# (출력되는 sudo 명령어를 복사하여 실행)
pm2 save
```

### 11-4. PM2 주요 명령어

```bash
pm2 status                          # 전체 프로세스 상태
pm2 logs drug-system-ui-demo        # 실시간 로그
pm2 restart drug-system-ui-demo     # 재시작
pm2 stop drug-system-ui-demo        # 중지
pm2 delete drug-system-ui-demo      # 삭제
pm2 reload drug-system-ui-demo      # 무중단 재시작 (권장)
```

---

## 12. 환경 변수 관리

현재 이 프로젝트는 별도 환경 변수 없이 동작하지만, 향후 확장 시를 위한 가이드입니다.

### .env.local 파일 생성 (개발용)

```bash
# 프로젝트 루트에 생성
touch .env.local

# 예시 내용
NEXT_PUBLIC_APP_TITLE="마약류중독자관리시스템"
NEXT_PUBLIC_VERSION="1.0.0"
```

### 프로덕션 환경 변수 설정

```bash
# PM2 ecosystem.config.js의 env 섹션에 추가
env: {
  NODE_ENV: "production",
  PORT: 3000,
  NEXT_PUBLIC_APP_TITLE: "마약류중독자관리시스템",
}
```

> `NEXT_PUBLIC_` 접두사가 있는 변수만 브라우저에 노출됩니다.

---

## 13. 배포 후 확인 체크리스트

```bash
# 1. Node.js 프로세스 실행 중 여부
pm2 status
# → drug-system-ui-demo: online

# 2. 포트 3000 리스닝 확인
ss -tlnp | grep 3000
# → 0.0.0.0:3000 ... LISTEN

# 3. Nginx 상태
sudo systemctl status nginx
# → Active: active (running)

# 4. 로컬 응답 확인
curl -I http://localhost:3000
# → HTTP/1.1 200 OK

# 5. 외부 접속 확인 (도메인 또는 IP)
curl -I http://your-domain.com
# → HTTP/1.1 200 OK

# 6. HTTPS 확인 (인증서 설치 후)
curl -I https://your-domain.com
# → HTTP/2 200

# 7. PM2 에러 로그 확인
pm2 logs drug-system-ui-demo --err --lines 50
```

### 화면별 접속 테스트

| URL | 정상 응답 |
| --- | --- |
| `http://your-domain.com/` | 개요 화면 로드 |
| `http://your-domain.com/intake` | 접수 화면 로드 |
| `http://your-domain.com/cases` | 사례 목록 로드 |
| `http://your-domain.com/stats` | 통계 화면 로드 |

---

## 14. 문제 해결 (Troubleshooting)

### 빌드 실패: TypeScript 오류

```bash
# TypeScript 타입 패키지 수동 설치
npm install --save-dev @types/react @types/node typescript

# 재빌드
npm run build
```

### 포트 충돌: EADDRINUSE

```bash
# 3000번 포트를 사용 중인 프로세스 확인
lsof -i :3000
# 또는
ss -tlnp | grep 3000

# 해당 프로세스 종료
kill -9 <PID>

# 다른 포트로 실행
PORT=3001 npm run start
```

### Nginx 502 Bad Gateway

```bash
# Next.js 앱이 실행 중인지 확인
pm2 status
curl http://localhost:3000  # 직접 테스트

# Nginx 에러 로그 확인
sudo tail -f /var/log/nginx/error.log

# 앱 재시작
pm2 restart drug-system-ui-demo
```

### PM2 시작 시 Cannot find module 오류

```bash
# node_modules 재설치
cd ~/drug-system-ui-demo
rm -rf node_modules .next
npm install
npm run build
pm2 restart drug-system-ui-demo
```

### GCP Cloud Run: 컨테이너 시작 실패

```bash
# 로컬에서 Docker 빌드 테스트
docker build -t drug-system-ui-demo .
docker run -p 3000:3000 drug-system-ui-demo

# Cloud Run 로그 확인
gcloud logging read "resource.type=cloud_run_revision \
  AND resource.labels.service_name=drug-system-ui-demo" \
  --limit=50
```

---

## 배포 방식 비교 요약

| 방식 | 난이도 | 비용 | 스케일링 | 권장 상황 |
| --- | --- | --- | --- | --- |
| **GCP Cloud Run** | 중 | 종량제 (소량 무료) | 자동 | 트래픽 변동이 크거나 인프라 관리 최소화 원할 때 |
| **GCP Compute Engine** | 중 | 고정 (월 $13~70) | 수동 | GCP 환경 내 전체 제어 원할 때 |
| **임대형 VPS** | 중 | 고정 (월 ₩11,000~30,000) | 수동 | 기존 서버 활용, 비용 절감 원할 때 |
| **로컬 개발** | 낮 | 없음 | - | 개발/테스트 전용 |

---

*이 문서는 `drug-system-ui-demo` v0.1.0 기준으로 작성되었습니다.*
