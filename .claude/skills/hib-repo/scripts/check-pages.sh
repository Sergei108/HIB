#!/bin/bash
# Проверка, что все 10 маршрутов HIB отдают 200.
# Использует npx serve поверх готового out/ (не next start, тот не работает с output:export).
# Запускать из корня репо (НЕ из hib/).

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/../../../.." && pwd)"
HIB_DIR="$REPO_ROOT/hib"
OUT_DIR="$HIB_DIR/out"
PORT=3000
# basePath: "/hib" в next.config.mjs влияет только на ссылки в HTML.
# Сами файлы в out/ лежат в корне (out/index.html, не out/hib/index.html).
# Поэтому проверяем на http://localhost:$PORT/, а не /hib/.
BASE="http://localhost:$PORT"

# 1. Проверить, что out/ существует (нужен готовый билд)
if [ ! -d "$OUT_DIR" ]; then
  echo "❌ $OUT_DIR не найден. Сначала:"
  echo "  cd $HIB_DIR && npm run build"
  exit 1
fi

# 2. Проверить, что порт свободен
if netstat -ano 2>/dev/null | grep -q ":$PORT.*LISTENING"; then
  echo "❌ Порт $PORT занят. Освободите его и повторите:"
  echo "  netstat -ano | grep :$PORT"
  exit 1
fi

# 3. Поднять npx serve поверх out/
#    --no-clipboard, --no-port-switching — чтобы не было сюрпризов
#    --single — для SPA-fallback (на 404 отдаёт /index.html, как Beget/nginx)
cd "$HIB_DIR"
npx --yes serve out -l $PORT --no-clipboard --no-port-switching > /tmp/hib-serve.log 2>&1 &
DEV_PID=$!
echo "Сервер запущен (PID $DEV_PID) на http://localhost:$PORT"

# 4. Подождать готовности (макс 15с — serve поднимается за 2-3с)
echo "Ждём готовности..."
for i in {1..15}; do
  if curl -s -o /dev/null -w "%{http_code}" "$BASE/" 2>/dev/null | grep -q "200"; then
    echo "Готов"
    break
  fi
  if [ "$i" -eq 15 ]; then
    echo "❌ Таймаут 15с — сервер не поднялся. Лог:"
    tail -20 /tmp/hib-serve.log
    kill $DEV_PID 2>/dev/null || true
    exit 1
  fi
  sleep 1
done

# 5. Проверить все 10 маршрутов
ROUTES=(
  "/"
  "/training/"
  "/dashboard/"
  "/research/"
  "/about/"
  "/games/memory-grid/"
  "/games/stroop-test/"
  "/games/reaction-focus/"
  "/games/logic-sequences/"
  "/games/creative-association/"
)

cleanup() {
  kill $DEV_PID 2>/dev/null || true
  wait $DEV_PID 2>/dev/null || true
}
trap cleanup EXIT

echo ""
echo "Маршрут                                       | Код | Время"
echo "----------------------------------------------|-----|------"
PASS=0
FAIL=0
for route in "${ROUTES[@]}"; do
  result=$(curl -s -o /dev/null -w "%{http_code}|%{time_total}" "$BASE$route")
  code=$(echo "$result" | cut -d'|' -f1)
  time=$(echo "$result" | cut -d'|' -f2)
  printf "%-46s | %s | %ss\n" "$route" "$code" "$time"
  if [ "$code" = "200" ]; then
    PASS=$((PASS+1))
  else
    FAIL=$((FAIL+1))
  fi
done

echo ""
echo "Итого: $PASS ✓  $FAIL ✗"

# 6. Проверить, что CSS/JS грузятся
echo ""
echo "Проверка ассетов:"
INDEX_HTML=$(curl -s "$BASE/")
CSS_HREF=$(echo "$INDEX_HTML" | grep -oE '/hib/_next/static/css/[^"]+\.css' | head -1)
JS_HREF=$(echo "$INDEX_HTML" | grep -oE '/hib/_next/static/chunks/[^"]+\.js' | head -1)
if [ -n "$CSS_HREF" ]; then
  CSS_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE${CSS_HREF#/hib}")
  echo "  CSS ($CSS_HREF): $CSS_CODE"
fi
if [ -n "$JS_HREF" ]; then
  JS_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE${JS_HREF#/hib}")
  echo "  JS  ($JS_HREF): $JS_CODE"
fi

# 7. Exit code
[ $FAIL -eq 0 ]
