#!/usr/bin/env bash
set -euo pipefail

# ============================================================
# 특정 MD → PDF 변환 스크립트 (WSL/Ubuntu용)
# 대상 폴더: /mnt/c/xampp/htdocs/drug-system-ui-demo
# 출력 폴더: (대상 폴더)/_export/pdf
#
# 사용법:
#   ./md_convert_all.sh                          # 기본 목록 전체 변환
#   ./md_convert_all.sh DEVELOPMENT_PLAN.md      # 특정 파일 1개
#   ./md_convert_all.sh REQUIREMENTS.md DEPLOYMENT.md  # 복수 지정
#
# 기본 변환 목록 (인수 없을 때):
#   - DEVELOPMENT_PLAN.md  : 시스템 개발 계획서
#   - REQUIREMENTS.md      : 시스템 요구사항 분석서
#   - DEPLOYMENT.md        : 배포 가이드
#   - README.md            : 프로젝트 개요
#
# 필요 패키지:
#   sudo apt-get install -y pandoc texlive-xetex texlive-fonts-recommended \
#       texlive-lang-cjk fonts-noto-cjk
# ============================================================

SRC_DIR="/mnt/c/xampp/htdocs/drug-system-ui-demo"
OUT_DIR="${SRC_DIR}/_export/pdf"

# ✅ 기본 변환 목록 (인수 없을 때 사용)
DEFAULT_FILES=(
  "DEVELOPMENT_PLAN.md"
  "REQUIREMENTS.md"
  "DEPLOYMENT.md"
  "README.md"
)

# ✅ 인수가 있으면 인수를, 없으면 기본 목록을 사용
if [[ $# -gt 0 ]]; then
  TARGET_FILES=("$@")
else
  TARGET_FILES=("${DEFAULT_FILES[@]}")
fi

# ✅ PDF 변환 옵션 (xelatex + 한글 폰트)
# lang=ko-KR 제거: polyglossia 활성화 시 Hangul 폰트 충돌 발생
# 대신 CJKmainfont 변수로 한글 처리 (fontspec 방식)
PANDOC_PDF_OPTS=(
  "--from=markdown"
  "--to=pdf"
  "--pdf-engine=xelatex"
  "-V" "mainfont=NanumGothic"
  "-V" "CJKmainfont=NanumGothic"
  "-V" "monofont=NanumGothicCoding"
  "-V" "geometry:margin=2.5cm"
  "-V" "fontsize=11pt"
  "-V" "colorlinks=true"
  "-V" "linkcolor=blue"
)

# ============================================================
echo "============================================================"
echo "MD → PDF 변환 시작"
echo "SRC_DIR : ${SRC_DIR}"
echo "OUT_DIR : ${OUT_DIR}"
echo "대상 파일: ${#TARGET_FILES[@]}개"
echo "============================================================"

# 0) 대상 폴더 존재 확인
if [[ ! -d "${SRC_DIR}" ]]; then
  echo "❌ 오류: SRC_DIR 폴더가 존재하지 않습니다: ${SRC_DIR}"
  exit 1
fi

# 1) pandoc 설치 확인
if ! command -v pandoc >/dev/null 2>&1; then
  echo "❌ pandoc이 설치되어 있지 않습니다."
  echo "  sudo apt-get update && sudo apt-get install -y pandoc"
  exit 1
fi

# 2) xelatex 설치 확인
if ! command -v xelatex >/dev/null 2>&1; then
  echo "❌ xelatex이 설치되어 있지 않습니다."
  echo "  sudo apt-get install -y texlive-xetex texlive-fonts-recommended texlive-lang-cjk"
  exit 1
fi

# 3) 출력 폴더 생성
mkdir -p "${OUT_DIR}"

# 4) 파일별 변환
success_count=0
fail_count=0
skip_count=0

for fname in "${TARGET_FILES[@]}"; do
  src="${SRC_DIR}/${fname}"
  base="${fname%.md}"
  out_pdf="${OUT_DIR}/${base}.pdf"

  echo ""
  echo "------------------------------------------------------------"
  echo "▶ ${fname}"

  # 파일 존재 확인
  if [[ ! -f "${src}" ]]; then
    echo "  ⚠️  파일 없음 - 건너뜀: ${src}"
    ((skip_count++)) || true
    continue
  fi

  echo "  입력: ${src}"
  echo "  출력: ${out_pdf}"

  if pandoc "${src}" -o "${out_pdf}" "${PANDOC_PDF_OPTS[@]}" 2>&1; then
    echo "  ✅ PDF 변환 성공"
    ((success_count++)) || true
  else
    echo "  ❌ PDF 변환 실패"
    ((fail_count++)) || true
  fi
done

# 5) 결과 요약
echo ""
echo "============================================================"
echo "변환 완료"
echo "  성공: ${success_count}개"
echo "  실패: ${fail_count}개"
echo "  건너뜀(파일 없음): ${skip_count}개"
echo "결과 폴더: ${OUT_DIR}"
echo "============================================================"
echo ""
echo "Windows 탐색기에서 확인:"
echo "  $(echo "${OUT_DIR}" | sed 's|/mnt/c|C:|' | tr '/' '\\')"
