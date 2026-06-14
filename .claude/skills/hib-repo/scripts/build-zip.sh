#!/bin/bash
# Сборка ZIP для деплоя на Beget.
# ВАЖНО: использует tar, не PowerShell Compress-Archive (тот ломает папку 404/).
# Запускать из корня репо (НЕ из hib/).

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/../../../.." && pwd)"
HIB_DIR="$REPO_ROOT/hib"
OUT_DIR="$HIB_DIR/out"
DATE=$(date +%Y-%m-%d)
ZIP_NAME="hib-deploy-$DATE.zip"
ZIP_PATH="$REPO_ROOT/$ZIP_NAME"

# Экспортируем пути в Windows-формате для PowerShell
export HIB_DIR
export ZIP_PATH

# 1. Проверить, что билд есть
if [ ! -d "$OUT_DIR" ]; then
  echo "❌ $OUT_DIR не найден. Сначала:"
  echo "  cd $HIB_DIR && npm run build"
  exit 1
fi

# 2. Посчитать файлы и размер
FILE_COUNT=$(find "$OUT_DIR" -type f | wc -l)
SIZE=$(du -sh "$OUT_DIR" | cut -f1)
echo "Содержимое $OUT_DIR: $FILE_COUNT файлов, $SIZE"

# 3. Запаковать в настоящий ZIP через .NET API (PowerShell на Windows)
#    `tar -a -c -f` в Git Bash создаёт tar-архив с расширением .zip — не ZIP!
#    PowerShell Compress-Archive ломает папку 404/ (см. feedback-zip-on-windows).
#    Решение: System.IO.Compression.ZipFile.CreateFromDirectory.
#    Передаём пути через ENV, чтобы избежать проблем с кириллицей/слэшами.
if command -v powershell.exe >/dev/null 2>&1; then
  HIB_DIR_WIN=$(cygpath -w "$HIB_DIR")
  ZIP_PATH_WIN=$(cygpath -w "$ZIP_PATH")
  powershell.exe -NoProfile -Command "
    Add-Type -AssemblyName System.IO.Compression.FileSystem;
    [System.IO.Compression.ZipFile]::CreateFromDirectory(
      (Join-Path \$env:HIB_DIR 'out'),
      \$env:ZIP_PATH,
      [System.IO.Compression.CompressionLevel]::Optimal, \$false)
  " > /dev/null
  if [ ! -f "$ZIP_PATH" ]; then
    echo "❌ PowerShell не создал ZIP — что-то пошло не так"
    exit 1
  fi
else
  echo "❌ powershell.exe не найден. На этой платформе используйте zip/7z вручную"
  exit 1
fi

# 4. Проверить результат
ZIP_SIZE=$(du -sh "$ZIP_PATH" | cut -f1)
echo ""
echo "ZIP создан: $ZIP_PATH"
echo "Размер: $ZIP_SIZE"
echo ""

# 5. Проверка целостности
echo "Проверка целостности (первые 20 файлов):"
unzip -l "$ZIP_PATH" | head -20

# 6. Красные флаги
if unzip -l "$ZIP_PATH" | grep -q "0 files"; then
  echo ""
  echo "❌ ОШИБКА: в архиве есть записи '0 files' — что-то пошло не так!"
  exit 1
fi

if unzip -l "$ZIP_PATH" | grep -qE "^\s*[0-9]+\s+.*\s+404\.html\s*$"; then
  if unzip -l "$ZIP_PATH" | grep -qE "^\s*[0-9]+\s+.*\s+404/index\.html\s*$"; then
    echo ""
    echo "❌ ОШИБКА: в архиве есть И 404.html, И 404/index.html — это мусор от Compress-Archive!"
    echo "   Пересоберите через tar или Проводник Windows."
    exit 1
  fi
fi

echo ""
echo "✅ Готово к деплою"
echo "Следующий шаг: залить $ZIP_PATH на Beget в public_html/hib/"
