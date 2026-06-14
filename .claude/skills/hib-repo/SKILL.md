---
name: hib-repo
description: Работа с репозиторием HIB (Human Intelligence Boost) — запуск, правка кода, обновление README, проверка ошибок, подготовка ZIP и публикация на GitHub/Beget. Использовать при любых задачах в этом проекте.
---

# hib-repo

Помощник для работы с репозиторием **HIB (Human Intelligence Boost)** — когнитивные тренировки на Next.js 14 + Tailwind + TypeScript + localStorage. Без backend, статический экспорт, деплой на Beget.

Репозиторий: https://github.com/Sergei108/HIB
Корень проекта: `hib/` (рядом с `info/`, `Project/`, `memory.md`)
Прод: https://sk108projects.ru/hib/

## Когда вызывать

- Любая правка в проекте HIB (тексты, цвета, логика, дизайн)
- Запуск dev-сервера, проверка билда
- Обновление README, CHANGELOG
- Подготовка ZIP и деплой на Beget
- Создание PR-описания для GitHub
- Генерация скриншотов через Playwright
- Создание новой игры / достижения / страницы
- Поиск и исправление багов
- Рефакторинг

## Принципы

1. **Помощник с подтверждением.** Никаких деструктивных операций (push в main, force, удаление файлов, изменение `basePath`, очистка `localStorage`) без явного «да» от Сергея.
2. **Сначала план — потом код.** Перед значимыми правками показать, что меняется, в каких файлах, какие риски.
3. **Сначала проверки — потом рапорт.** `npm run lint` + `npm run build` + `check-pages.sh` должны пройти, иначе рапорт «готово» — ложь.
4. **Все тексты — на русском.** Интерфейс пользователя всегда по-русски, кроме названий игр (Memory Grid, Stroop и т.п.).
5. **Все цвета — через `var(--*)`.** См. `references/pitfalls.md` → Tailwind.
6. **localStorage — только на клиенте.** Никогда на сервере, всегда с `mounted`-флагом.
7. **Свой `cn`, не ставить clsx.**
8. **Default тема — тёмная.** Без `prefers-color-scheme`.

## Структура скилла

```
.claude/skills/hib-repo/
├── SKILL.md                    # ← ты здесь
├── references/
│   ├── architecture.md         # структура проекта, где что лежит
│   ├── commands.md             # шпаргалка по командам
│   ├── deploy-beget.md         # пошаговый деплой на Beget
│   └── pitfalls.md             # известные баги и тонкости
├── templates/
│   ├── pr-description.md       # шаблон PR-описания
│   └── changelog-entry.md      # шаблон записи в CHANGELOG
└── scripts/
    ├── check-pages.sh          # проверка 8 страниц на 200
    └── build-zip.sh            # сборка ZIP для Beget (tar, не Compress-Archive)
```

## Типичные сценарии

### Сценарий 1: внести правку в код

1. **Понять, что меняется.** Прочитать задачу, при необходимости — `info/iteration*.md`, `Project/Project.md`, `memory.md`.
2. **Найти нужные файлы.** См. `references/architecture.md` → «Где править».
3. **Проверить `references/pitfalls.md`** — нет ли граблей в этой зоне.
4. **Показать план:** какие файлы, какие изменения, какие риски.
5. **Ждать подтверждения.**
6. **Внести правки.**
7. **Проверить:**
   - `cd hib && npm run lint` — 0 warnings
   - `cd hib && npm run build` — успешно
   - `bash .claude/skills/hib-repo/scripts/check-pages.sh` — все 10 маршрутов 200
8. **Рапорт:** что сделано, какие файлы, как проверить вручную.

### Сценарий 2: добавить новую игру

1. **Согласовать дизайн:** механика, кол-во раундов, формула очков, какие когнитивные функции тренирует.
2. **Создать файлы:**
   - `hib/components/games/<game-id>.tsx` — client component
   - `hib/app/games/<game-id>/page.tsx` — маршрут (может быть тривиальная обёртка)
   - Запись в `hib/lib/games.ts` (метаданные + длинное описание)
   - Функция скоринга в `hib/lib/scoring.ts`
   - Задачи/слова/стимулы (если нужны) — отдельный файл в `hib/lib/`
3. **Добавить карточку** в `hib/app/training/page.tsx` (уже использует `lib/games.ts`, должно подхватиться автоматически).
4. **Опционально:** достижение в `lib/achievements.ts` (если есть «особый» момент).
5. **Использовать `addGameResult` из `lib/storage.ts`** — он автоматически обновляет:
   - `totalScore` (добавляет `result.score`)
   - `level` (через `calculateLevel` по 5-уровневой шкале 0–199 / 200–499 / 500–899 / 900–1399 / 1400+)
   - `currentStreak` (двухступенчатая логика: isSameDay по локальной таймзоне, dayDiff через Date.UTC)
   - `unlockedAchievements` (через `checkAchievements` сразу после `addGameResult`)
   - `lastTrainingDate = now.toISOString()`
   - **Не вызывать `checkAchievements` руками** — `addGameResult` это делает сам
6. **Проверить:** `lint` + `build` + `check-pages.sh` + ручная проверка в браузере.
7. **Скриншоты** для README в `screenshots/`.
8. **CHANGELOG.md** + описание PR + обновить `memory.md` если архитектурное решение.

### Сценарий 3: обновить README

1. Прочитать текущий `hib/README.md`.
2. Определить, что добавить: новые скриншоты, новые фичи, новая версия.
3. Если меняются скриншоты — сначала снять новые (Playwright, см. ниже).
4. **Не переписывать с нуля** — править существующий, сохранять стиль и структуру.
5. **Обновить секции:**
   - «Скриншоты» — заменить PNG
   - «Фичи» — если добавилась новая
   - «Стек» — если менялись зависимости
   - «Версия» — если новая итерация
6. Проверить: `npm run build` (README не влияет, но для полноты).

### Сценарий 4: подготовить деплой на Beget

Подробно: `references/deploy-beget.md`. Краткий чек-лист:

1. `cd hib && npm run build` — собрать `out/`
2. `bash .claude/skills/hib-repo/scripts/build-zip.sh` — собрать ZIP через `tar`
3. `unzip -l <zip> | grep "0 files"` — НЕ ДОЛЖНО БЫТЬ результатов
4. Показать Сергею путь к ZIP, попросить залить на Beget через файловый менеджер
5. **Сергей заливает сам** (в инструкциях проекта это явно — не делаем за него)

### Сценарий 5: создать PR-описание

1. Использовать шаблон `templates/pr-description.md`
2. Заполнить:
   - Контекст — зачем, источник задачи
   - Что изменилось — список файлов/фич с галочками
   - Тип — bug fix / new feature / refactor
   - Чек-лист проверки — отметить выполненное
   - Скриншоты — если UI-изменения
3. Сохранить в `info/iteration{N+1}.md` или в описание PR на GitHub
4. **Не пушить без подтверждения** — даже если PR готов

### Сценарий 6: снять скриншоты через Playwright

1. `cd hib && npm run dev &` — поднять dev-сервер
2. Подождать ~5 секунд
3. Использовать `mcp__playwright__browser_*`:
   - `browser_navigate` → `http://localhost:3000/hib/`
   - `browser_take_screenshot` → `home.png` (fullPage: true)
   - Повторить для всех 10 маршрутов
   - Снять в обеих темах (тёмная + светлая): переключить через `browser_evaluate` → `document.documentElement.setAttribute('data-theme', 'light')`
4. **Сохранить в `screenshots/`** в **корне репо** (не в `hib/`!):
   - Тёмная: `home.png`, `training.png`, `dashboard.png`, `research.png`, `about.png`, `memory-grid.png`, `stroop.png`, `reaction.png`, `logic.png`, `creative.png`
   - Светлая: `light-home.png`, `light-training.png`, ...
5. **Перезаписать существующие** (не накапливать варианты с датами). В `memory.md` упомянуть только если менялся дизайн.
6. `kill %1` — погасить dev-сервер
7. Использовать в `hib/README.md` (если обновляется)

## Безопасные операции (можно без подтверждения)

- Чтение файлов
- Запуск `npm run lint`, `npm run build`, `npm run dev`
- Запуск `check-pages.sh`, `build-zip.sh`
- Локальные правки в файлах (Edit, Write)
- Создание новых файлов в `hib/`, `info/`, `screenshots/`
- `git add <конкретные_файлы>`, `git commit` (если явно попросили)
- `git status`, `git log`, `git diff`

## Деструктивные операции (только с подтверждением)

- `git push` (особенно в main, особенно при больших пакетах)
- `git push --force`, `git reset --hard`
- Удаление файлов и папок
- Изменение `basePath`, `output`, `trailingSlash` в `next.config.mjs`
- Изменение `package.json` (добавление/удаление зависимостей)
- Очистка `localStorage` пользователя (если тестируем на проде)
- `npm install`/`npm uninstall` (меняет `package-lock.json`)
- Публикация релизов на GitHub
- Заливка на Beget (Сергей делает сам)

## Чек-лист «готово к рапорту»

Перед тем как сказать «сделано»:

- [ ] `npm run lint` — 0 warnings
- [ ] `npm run build` — успешно, 10 страниц
- [ ] `bash .claude/skills/hib-repo/scripts/check-pages.sh` — все 10 маршрутов 200
- [ ] Проверено в тёмной теме
- [ ] Проверено в светлой теме (если менялись цвета/UI)
- [ ] Проверено на мобильном (DevTools, iPhone 12)
- [ ] Свежие скриншоты — если менялся UI
- [ ] CHANGELOG обновлён (если новая фича)
- [ ] README обновлён (если новая фича или скриншоты)
- [ ] `memory.md` обновлён (если архитектурное решение)
- [ ] Список изменённых файлов — в финальном рапорте

## Связанные артефакты

- `memory.md` — главный лог проекта (в корне репо, не в `hib/`)
- `info/iteration*.md` — отчёты по итерациям
- `Project/Project.md` — исходное ТЗ
- `hib/DEPLOY.md` — инструкция по деплою (для Сергея)
- `hib/README.md` — README для GitHub

## Ключевые нюансы (не забыть!)

- **ZIP для Beget — только `tar` или Проводник.** PowerShell `Compress-Archive` ломает `404/`.
- **Git push при мобильном интернете — дробить на 3-25 файлов**, иначе HTTP 408.
- **Tailwind-цвета — только `var(--*)`**, иначе тема не переключается. Полный список токенов в `:root` и `:root[data-theme="light"]` — `app/globals.css` (включает `--btn-primary-text`, `--body-gradient-1/2/3`, `--card-bg*` помимо основной палитры).
- **Default тема — тёмная**, без `prefers-color-scheme`.
- **Streak — двухступенчатая логика**: `isSameDay` по локальной таймзоне + `dayDiff` через `Date.UTC()`. Не упрощать.
- **Reaction Focus — ref-паттерн + clearTimers** в `useEffect`-return.
- **Свой `cn` в `lib/utils.ts`**, clsx не ставить.
- **localStorage — только на клиенте**, с `mounted`-флагом.
- **basePath: "/hib"** в `next.config.mjs` для деплоя в подпапку.
- **`.gitignore` уже исключает** `node_modules/`, `.next/`, `out/` — можно не пушить.
- **`addGameResult` обновляет всё сам**: level, streak, achievements, lastTrainingDate. Не дублировать логику в компоненте.

Если что-то из этого нарушено — остановиться и обсудить с Сергеем.
