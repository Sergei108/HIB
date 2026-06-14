# Архитектура HIB

> Репозиторий: `Sergei108/HIB`. Корень проекта: `hib/`.

## Стек

- **Next.js 14.2.18** (App Router, `output: "export"`, `basePath: "/hib"`)
- **React 18.3** + **TypeScript 5.5**
- **Tailwind CSS 3.4** (цвета через CSS-переменные — обязательно)
- **localStorage** для прогресса (без backend)
- Шрифт: **Inter** через `next/font/google`
- Без shadcn/ui, без Supabase, без авторизации

## Маршруты (10 страниц)

| Путь | Файл | Назначение |
|---|---|---|
| `/` | `app/page.tsx` | Главная — hero, 5 секций, CTA на тренировки |
| `/training` | `app/training/page.tsx` | 5 кликабельных карточек игр |
| `/dashboard` | `app/dashboard/page.tsx` | Статистика, прогресс, достижения |
| `/research` | `app/research/page.tsx` | Научная база + источники |
| `/about` | `app/about/page.tsx` | Миссия, стек, roadmap, дисклеймер |
| `/games/memory-grid` | `app/games/memory-grid/page.tsx` | 5 раундов, 3×3 → 4×4 |
| `/games/stroop-test` | `app/games/stroop-test/page.tsx` | 20 вопросов, 6 цветов, клавиши 1–6 |
| `/games/reaction-focus` | `app/games/reaction-focus/page.tsx` | 10 попыток Go/No-Go, Space |
| `/games/logic-sequences` | `app/games/logic-sequences/page.tsx` | 10 из 12 задач, 4 варианта |
| `/games/creative-association` | `app/games/creative-association/page.tsx` | 3 слова, textarea |

**Итого 10 страниц** (1 главная + 4 инфо + 5 игр).

## Ключевые папки

```
hib/
├── app/                              # 10 маршрутов (1 главная + 4 инфо + 5 игр)
│   ├── layout.tsx                    # Header + Footer + main
│   ├── globals.css                   # glass, gradient, glow, animation + тема
│   ├── icon.svg                      # favicon (градиентный "H")
│   ├── training/, dashboard/, research/, about/
│   └── games/                        # 5 игр
├── components/
│   ├── layout/                       # header, footer, main-nav, mobile-menu, page-container, theme-provider, theme-toggle
│   ├── cards/                        # game-card, stat-card, skill-card, achievement-card, last-session-card
│   ├── games/                        # game-intro, game-result + 5 игр
│   ├── dashboard/dashboard-view.tsx  # client component с localStorage
│   └── ui/                           # icons.tsx, glow-card.tsx
├── lib/                              # вся бизнес-логика
│   ├── types.ts                      # GameId, GameResult, CreativeEntry, UserProgress
│   ├── games.ts                      # 5 игр с описаниями (для UI)
│   ├── levels.ts                     # 5 уровней + STORAGE_KEY
│   ├── scoring.ts                    # 5 функций подсчёта очков
│   ├── storage.ts                    # safe localStorage + streak + addGameResult
│   ├── achievements.ts               # 9 достижений + checkAchievements
│   ├── research.ts                   # научные блоки + источники
│   ├── logic-questions.ts            # 12 задач
│   ├── creative-words.ts             # 44 русских слова
│   └── utils.ts                      # cn (свой), shuffle, formatDate
├── tailwind.config.ts                # cyan/mint/teal палитра через var(--*)
├── next.config.mjs                   # basePath: "/hib", output: "export"
├── tsconfig.json                     # paths: @/* → ./*
├── .gitignore                        # node_modules/, .next/, out/
├── CHANGELOG.md                      # история версий (Keep a Changelog)
└── README.md                         # полный README
```

## Где править, что хочется изменить

| Задача | Файл |
|---|---|
| Тексты на странице игры | `lib/games.ts` (массив `games`) |
| Научные блоки | `lib/research.ts` (массив `researchSections`) |
| Очки в играх | `lib/scoring.ts` (5 функций) |
| Достижения | `lib/achievements.ts` (массив + `checkAchievements`) |
| Уровни | `lib/levels.ts` |
| Цвета | `tailwind.config.ts` (только через `var(--*)`!) |
| Тема/палитра | `app/globals.css` → `:root`, `:root[data-theme="light"]` |
| Header / Footer | `components/layout/header.tsx`, `footer.tsx` |
| Карточка игры | `components/cards/game-card.tsx` |
| Новая игра | новый `components/games/*.tsx` + новая запись в `lib/games.ts` + новый маршрут в `app/games/` |

## Поток данных

```
Игра завершена
   ↓ addGameResult() (lib/storage.ts)
   ↓ + addCreativeEntry() для Creative
localStorage["hib-user-progress"]
   ↓ UserProgress { level, totalScore, streak, results[], creativeEntries[], achievements[] }
   ↓ useEffect + mounted флаг
Dashboard / Achievements
```

`addGameResult` автоматически:
1. Добавляет запись в `results[]`
2. Пересчитывает `totalScore`
3. Пересчитывает `level` (по 5-уровневой шкале)
4. Обновляет `streak` (UTC-сравнение дат)
5. Вызывает `checkAchievements`

## localStorage

- **Единственный ключ:** `hib-user-progress`
- **Всё в одном объекте** (для простоты MVP)
- Доступ только на клиенте: `typeof window !== "undefined"` + флаг `mounted` в `useState`
- При росте лучше разбить на несколько ключей

## Скриншоты

Папка `screenshots/` в **корне репо** (не в `hib/`) для README:
- Тёмная тема: `home.png`, `training.png`, `dashboard.png`, `research.png`, `about.png`, +5 игр
- Светлая тема: `light-*.png`
- Обновлять при изменении UI — перезаписывать, не накапливать
- Снимать через `mcp__playwright__browser_*` (см. SKILL.md → сценарий 6)
