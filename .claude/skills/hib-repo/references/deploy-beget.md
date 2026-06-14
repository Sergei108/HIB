# Деплой HIB на Beget

> Сервер: **sk108projects.ru/hib/**, тариф Blog, статический экспорт.

## Зачем этот файл

Деплой HIB — самое узкое место проекта. **PowerShell `Compress-Archive` ломает папку `404/`**, и после распаковки на Beget подстраницы падают в 404. Полная история — в `feedback-zip-on-windows` и в `memory.md` (`hib-development-process` → пункт 12).

## Предусловия

- `hib/next.config.mjs` содержит `basePath: "/hib"`, `output: "export"`, `trailingSlash: true`, `images: { unoptimized: true }` — **не менять без необходимости**
- Если нужен деплой в корень другого домена — временно снять `basePath`, потом вернуть
- Доступ в файловый менеджер Beget (логин/пароль)

## Шаги

### 1. Собрать билд

```bash
cd "C:/Users/User/Documents/MyClaudeProjects/FinalProjectСС.HIB(MVP)/hib"
npm run build
```

Должна появиться папка `hib/out/` с 60+ файлами:
- `out/index.html`, `out/404.html`, `out/404/index.html`
- `out/.htaccess` (для Beget — Next.js генерит автоматически)
- `out/_next/static/...`
- `out/training/index.html`, `out/dashboard/index.html`, ...
- `out/games/memory-grid/index.html`, ...

### 2. Упаковать ZIP — **только через `tar` или Проводник Windows!**

**❌ Не делать так:**
```powershell
Compress-Archive -Path out -DestinationPath ../hib-deploy.zip   # ← ЛОМАЕТ 404/
```

**✅ Делать так (Git Bash на Windows):**
```bash
cd "C:/Users/User/Documents/MyClaudeProjects/FinalProjectСС.HIB(MVP)/hib"
powershell.exe -NoProfile -Command "
  Add-Type -AssemblyName System.IO.Compression.FileSystem;
  [System.IO.Compression.ZipFile]::CreateFromDirectory('out', '../hib-deploy-2026-06-14.zip', [System.IO.Compression.CompressionLevel]::Optimal, \$false)
"
```

Или ещё проще — использовать скрипт:
```bash
bash ../.claude/skills/hib-repo/scripts/build-zip.sh
```

Он внутри делает то же самое через .NET API.

Или через Проводник: правой кнопкой по `out/` → «Сжать в ZIP-файл».

**❌ НЕ делать:**
```bash
tar -a -c -f out.zip -C . out    # Создаёт tar-архив с расширением .zip, не настоящий ZIP!
Compress-Archive -Path out -DestinationPath ../hib-deploy.zip   # ← ЛОМАЕТ 404/
```

### 3. Проверить целостность архива

```bash
unzip -l ../hib-deploy-2026-06-14.zip | head -20
unzip -l ../hib-deploy-2026-06-14.zip | grep "0 files"   # ← ПУСТОЙ ВЫВОД = ОК
```

Если в выводе есть строки вроде `0 files` или размер файла `0 byt...` для папок — архив битый, пересобрать.

**Красный флаг:** если в корне ZIP есть `404.html` **рядом** с `404/index.html` — это мусор от `Compress-Archive`, пересобрать.

### 4. Залить на Beget

1. Открыть https://sk108projects.ru/ → панель управления
2. Файловый менеджер → `public_html/hib/`
3. **Удалить старые файлы** (если деплой не первый):
   - ⚠️ Перед удалением: скилл должен показать план («удалит ~60 файлов в `out/`, ОК?») и ждать подтверждения
   - Никогда не удалять `public_html/hib/.htaccess` Beget-уровня (если он там есть) — это не наш, его создавал хостинг
   - Удалять только содержимое `public_html/hib/out/`
4. Загрузить ZIP в `public_html/hib/`
5. Правой кнопкой по ZIP → «Распаковать»
6. Удалить ZIP после распаковки
7. Проверить, что `public_html/hib/out/` — это **папки** (иконка папки, не файла). Если папка выглядит как файл 0 байт — пересобрать ZIP

**Внимание:** Beget распаковывает ZIP с сохранением структуры. Если в ZIP лежит `out/index.html`, на сервере будет `public_html/hib/out/index.html`. Это OK — основной `index.html` Beget ищет по `DirectoryIndex`, и наш `out/index.html` будет отдаваться по запросу `/hib/`.

**Если хочется без `out/` в URL** — пересобрать билд без `basePath` и залить содержимое `out/` напрямую в `public_html/`.

### 5. Проверить работоспособность

Открыть в браузере (в режиме инкогнито, чтобы избежать кеша):
- https://sk108projects.ru/hib/ — главная
- https://sk108projects.ru/hib/training/ — тренировки
- https://sk108projects.ru/hib/dashboard/ — дашборд
- https://sk108projects.ru/hib/research/ — научная база
- https://sk108projects.ru/hib/about/ — о проекте
- https://sk108projects.ru/hib/games/memory-grid/ — игра
- https://sk108projects.ru/hib/games/stroop-test/ — игра
- https://sk108projects.ru/hib/games/reaction-focus/ — игра
- https://sk108projects.ru/hib/games/logic-sequences/ — игра
- https://sk108projects.ru/hib/games/creative-association/ — игра

Все должны отдавать 200. Если какая-то 404 — скорее всего, битый ZIP, пересобрать через `tar`.

### 6. Проверить тему

Переключить тумблер темы в шапке. Должны меняться:
- Фон (тёмный ↔ светлый)
- Цвет текста
- Glow-эффекты

Если фон поменялся, а текст остался белым на белом — повторять не надо, это баг `tailwind.config.ts` (см. `pitfalls.md` → Tailwind).

## Откат

Если новый деплой сломал сайт:
1. Файловый менеджер → `public_html/hib/out/`
2. Залить предыдущий ZIP (например, `hib-deploy-2026-06-12.zip`)
3. Распаковать
4. Проверить

**Всегда хранить последний рабочий ZIP** в корне проекта рядом с актуальным.
