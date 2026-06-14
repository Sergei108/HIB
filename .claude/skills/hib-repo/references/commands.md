# Команды HIB — шпаргалка

> Все команды выполняются из `hib/` (не из корня репо).

## Разработка

```bash
cd hib
npm install              # если node_modules нет
npm run dev              # dev-сервер на http://localhost:3000/hib/
npm run lint             # ESLint, должен быть чистый
npm run build            # production build → out/
```

После `npm run dev` открывать **http://localhost:3000/hib/** (из-за `basePath: "/hib"`), не корень.

## Проверка страниц

Быстрая проверка, что все 10 публичных маршрутов отдают 200:

```bash
bash ../.claude/skills/hib-repo/scripts/check-pages.sh
```

Скрипт поднимает `npx serve` поверх `out/` на 3000, curl-ит каждый путь, выводит таблицу, гасит сервер.

**Почему `npx serve`, а не `next start`:** проект использует `output: "export"` (статический экспорт), `next start` с ним не работает — падает с `EADDRINUSE` или `does not work with output: export`. `serve` — стандартный HTTP-сервер для статики, рекомендованный самим Next.js.

**Требования:** порт 3000 должен быть свободен. Скрипт сам проверяет и выдаст ошибку, если занят.

## Сборка статического экспорта

```bash
cd hib
npm run build
# результат: hib/out/ — готов к деплою
```

`out/` содержит готовый сайт со всем basePath, trailingSlash, unoptimized images.

## Сборка ZIP для Beget

**Не использовать `tar -a` (создаёт tar, а не ZIP) и `PowerShell Compress-Archive` (ломает `404/`).**

```bash
bash ../.claude/skills/hib-repo/scripts/build-zip.sh
```

Скрипт внутри использует `System.IO.Compression.ZipFile` (PowerShell .NET API).

Проверка целостности перед заливкой:

```bash
unzip -l ../hib-deploy-YYYY-MM-DD.zip | head -30
unzip -l ../hib-deploy-YYYY-MM-DD.zip | grep "0 files"   # ← НЕ ДОЛЖНО БЫТЬ ТАКИХ СТРОК
```

## Деплой на Beget (кратко)

1. Собрать ZIP (см. выше)
2. Зайти в файловый менеджер Beget → `public_html/hib/`
3. Загрузить ZIP → распаковать через веб-интерфейс
4. Удалить ZIP после распаковки
5. Проверить https://sk108projects.ru/hib/

Подробно: `references/deploy-beget.md`.

## GitHub: коммит и пуш

```bash
cd "C:/Users/User/Documents/MyClaudeProjects/FinalProjectСС.HIB(MVP)"
git status
git add <файлы>            # НЕ используй git add . (может зацепить out/ и node_modules/)
git commit -m "..."
git push origin main
```

**При мобильном интернете — дробить на 3-25 файлов в коммите**, иначе HTTP 408. Подробно: `feedback-git-push-on-slow-internet`.

## Скриншоты через Playwright

Скрипта screenshots.js **нет** — снимать вручную через `mcp__playwright__browser_*`:

```bash
# 1. Поднять dev-сервер в фоне
cd hib && npm run dev &

# 2. Использовать mcp__playwright__browser_navigate, browser_take_screenshot
# 3. Сохранять в screenshots/ в корне репо

# 4. Загасить
kill %1
```

Подробно — SKILL.md → сценарий 6.

## Проверка типичных багов

```bash
# SSR + localStorage — ищем прямой доступ
cd hib
grep -rn "localStorage" --include="*.tsx" --include="*.ts" components/ app/

# clsx (не должен быть)
grep -rn "from \"clsx\"\|from 'clsx'" --include="*.tsx" --include="*.ts" .

# Tailwind-цвета — должны быть var(--*)
grep -n "#[0-9A-Fa-f]\{6\}" tailwind.config.ts
```

## Зависимости

В `package.json` минимум. **Не добавлять clsx, classnames, lodash** — для `cn` есть свой в `lib/utils.ts`.

Если нужно что-то добавить:
```bash
cd hib
npm install <package>      # обычная зависимость
npm install -D <package>   # dev-зависимость
```

После — обновить README, секция «Стек».
