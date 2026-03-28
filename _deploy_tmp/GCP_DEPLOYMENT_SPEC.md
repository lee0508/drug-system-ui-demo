# GCP 무료 VM 배포 사양서

**프로젝트**: 마약류중독자관리시스템 UI 데모 (Next.js 14)
**목적**: GCP Always Free Tier e2-micro VM을 이용한 임시 테스트 서버 구성
**작성일**: 2026-03-03

---

## 1. GCP 무료 VM 사양 (Always Free)

> GCP Always Free는 **매월 자동 갱신**, 별도 만료 없음 (단, 결제 계정 등록 필수)

| 항목 | 사양 |
|------|------|
| **인스턴스 유형** | `e2-micro` |
| **vCPU** | 2 vCPU (burstable — 공유 코어) |
| **메모리** | 1 GB RAM |
| **부팅 디스크** | 30 GB HDD (Standard Persistent Disk) |
| **가용 리전** | `us-central1` / `us-west1` / `us-east1` (이 3개만 무료) |
| **외부 IP** | 정적 외부 IP 1개 (VM 연결 시 무료) |
| **네트워크 아웃바운드** | 월 1 GB 무료 (초과 시 과금) |
| **비용** | **$0 / 월** (Always Free 한도 내) |

### ⚠️ 주의사항

- 리전은 반드시 **`us-central1`, `us-west1`, `us-east1` 중 하나** 선택 (아시아 리전은 무료 아님)
- 디스크 유형: **Standard(HDD)** 선택 (SSD는 과금)
- 외부 IP를 VM에 **연결하지 않고 예약만** 하면 과금 발생 → VM 실행 중에만 연결 유지
- `next build` 중 RAM 1 GB 초과 가능성 있음 → 빌드는 **로컬에서 수행 후 배포** 권장

---

## 2. 운영체제

| 항목 | 선택값 |
|------|--------|
| **OS** | Ubuntu 22.04 LTS (Jammy Jellyfish) |
| **이미지** | `ubuntu-2204-lts` (GCP 공식 제공) |
| **이유** | Node.js 20 LTS 공식 지원, apt 패키지 안정성, 보안 패치 5년 지원 |

---

## 3. 필수 소프트웨어

### 3-1. 런타임

| 소프트웨어 | 버전 | 용도 | 설치 방법 |
|-----------|------|------|----------|
| **Node.js** | 20 LTS (20.x) | Next.js 실행 엔진 (최소 요구: 18.17+) | NodeSource PPA |
| **npm** | 10.x (Node.js 동봉) | 패키지 관리 | Node.js 설치 시 포함 |

### 3-2. 프로세스 관리

| 소프트웨어 | 버전 | 용도 |
|-----------|------|------|
| **PM2** | 최신 (5.x) | Next.js 프로세스 데몬화, 자동 재시작, 로그 관리 |

### 3-3. 웹 서버 / 리버스 프록시

| 소프트웨어 | 버전 | 용도 |
|-----------|------|------|
| **Nginx** | 1.18+ (apt 기본) | HTTP 80 → localhost:3000 프록시, 정적 파일 캐싱 |

### 3-4. 배포 도구

| 소프트웨어 | 버전 | 용도 |
|-----------|------|------|
| **Git** | 2.x (apt 기본) | 소스코드 배포 |

### 3-5. 선택 사항 (권장)

| 소프트웨어 | 용도 |
|-----------|------|
| **Certbot** (Let's Encrypt) | HTTPS SSL 인증서 자동 발급/갱신 |
| **UFW** | 방화벽 규칙 관리 (GCP 방화벽 외 추가 레이어) |

---

## 4. 포트 및 방화벽 규칙

### GCP VPC 방화벽 규칙 (생성 필요)

| 규칙 이름 | 방향 | 프로토콜 | 포트 | 소스 | 용도 |
|----------|------|---------|------|------|------|
| `allow-http` | Ingress | TCP | 80 | 0.0.0.0/0 | 웹 접속 |
| `allow-https` | Ingress | TCP | 443 | 0.0.0.0/0 | HTTPS (SSL 적용 시) |
| `allow-ssh` | Ingress | TCP | 22 | 내 IP | SSH 접속 |

> Next.js 포트(3000)는 외부에 직접 노출하지 않음 → Nginx가 80 → 3000 프록시

---

## 5. 소프트웨어 설치 순서 (VM 접속 후)

```bash
# 1. 시스템 업데이트
sudo apt update && sudo apt upgrade -y

# 2. Node.js 20 LTS 설치 (NodeSource PPA)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 버전 확인
node -v   # v20.x.x
npm -v    # 10.x.x

# 3. PM2 전역 설치
sudo npm install -g pm2

# 4. Nginx 설치
sudo apt install -y nginx

# 5. Nginx 자동 시작 등록
sudo systemctl enable nginx
sudo systemctl start nginx

# 6. Git 설치 (이미 설치된 경우 생략)
sudo apt install -y git
```

---

## 6. 배포 절차

### 6-1. 로컬에서 빌드 (e2-micro RAM 부족 대비)

```bash
# Windows 로컬에서
cd c:\xampp\htdocs\drug-system-ui-demo
npm run build

# .next/ 폴더가 생성됨
```

### 6-2. 서버에 파일 전송

```bash
# .next/, public/, app/, components/, lib/, package.json 전송
# (node_modules 제외 → 서버에서 npm ci 실행)

# scp 예시 (로컬 → 서버)
scp -r .next public app components lib package.json next.config.js \
    username@<GCP_EXTERNAL_IP>:/home/username/drug-system/
```

### 6-3. 서버에서 의존성 설치 및 실행

```bash
cd ~/drug-system

# 프로덕션 의존성만 설치
npm ci --omit=dev

# PM2로 Next.js 시작
pm2 start npm --name "drug-system" -- start

# 서버 재시작 시 자동 실행 등록
pm2 startup
pm2 save
```

### 6-4. Nginx 리버스 프록시 설정

```nginx
# /etc/nginx/sites-available/drug-system
server {
    listen 80;
    server_name <GCP_EXTERNAL_IP>;   # 또는 도메인명

    location / {
        proxy_pass         http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# 설정 적용
sudo ln -s /etc/nginx/sites-available/drug-system /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 7. 디스크 사용량 예측

| 항목 | 예상 크기 |
|------|----------|
| Ubuntu 22.04 OS | ~4 GB |
| Node.js 20 + npm | ~200 MB |
| PM2 | ~50 MB |
| Nginx | ~10 MB |
| 프로젝트 소스 + `.next/` 빌드 | ~200 MB |
| node_modules (프로덕션) | ~150 MB |
| **합계** | **~4.6 GB** |
| **여유 공간 (30 GB 기준)** | **~25 GB** |

---

## 8. 성능 예측 (e2-micro 기준)

| 항목 | 예측 |
|------|------|
| 동시 접속자 | ~5~10명 (데모 목적) |
| 페이지 로드 (첫 요청) | 1~3초 (Cold start) |
| 페이지 로드 (이후) | < 500ms (캐시) |
| `npm run build` 소요 시간 | 3~8분 (RAM 한계로 느림) → 로컬 빌드 권장 |

> e2-micro는 공유 코어로 CPU 버스트 제한이 있음. **실제 사용자 테스트 목적**으로는 충분하나 부하테스트는 부적합.

---

## 9. GCP VM 생성 체크리스트

```
[ ] GCP 콘솔 접속 → Compute Engine → VM 인스턴스 만들기
[ ] 머신 구성: e2-micro 선택
[ ] 리전: us-central1 (또는 us-west1, us-east1)
[ ] 부팅 디스크: Ubuntu 22.04 LTS, 30 GB, Standard(HDD)
[ ] 방화벽: HTTP 트래픽 허용 체크, HTTPS 트래픽 허용 체크
[ ] VM 생성 완료 후 외부 IP 확인
[ ] SSH 접속 확인
[ ] 소프트웨어 설치 (섹션 5)
[ ] 배포 완료 (섹션 6)
[ ] 브라우저에서 http://<외부IP> 접속 확인
```

---

## 10. 비용 요약

| 항목 | 월 비용 |
|------|--------|
| e2-micro VM (us-central1) | **$0** |
| 30 GB HDD | **$0** |
| 외부 IP (VM 연결 상태) | **$0** |
| 아웃바운드 트래픽 (1 GB 이하) | **$0** |
| **합계** | **$0 / 월** |

> ※ 트래픽이 월 1 GB 초과 시 초과분만 과금 (~$0.08/GB)
> ※ GCP 결제 계정(신용카드) 등록 필수 — 무료 한도 내에서는 청구 없음
