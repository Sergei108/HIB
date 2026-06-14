# Грабли HIB — что не забыть

> Известные баги и тонкости, на которые уже натыкались. **Прочитать перед любым рефакторингом.**

## 1. `lib/utils.ts` — НЕ добавлять clsx

В `lib/utils.ts` есть свой `cn` через рекурсивный flatten. **Не ставить `clsx` из npm** — лишняя зависимость. Если кто-то предлагает — отвечать «у нас свой, работает».

Проверка:
```bash
cd hib
grep -rn "from [\"']clsx[\"']" --include="*.tsx" --include="*.ts" .
# должно быть пусто
```

## 2. SSR + localStorage

`localStorage` и `window` существуют **только на клиенте**. Любой доступ — оборачивать:

```tsx
// ❌ нельзя
const data = localStorage.getItem("hib-user-progress");

// ✅ правильно
const [mounted, setMounted] = useState(false);
useEffect(() => {
  setMounted(true);
  const data = localStorage.getItem("hib-user-progress");
}, []);
```

В `lib/storage.ts` все функции проверяют `typeof window !== "undefined"`. Не ломать эту защиту.

## 3. Tailwind-цвета — только через CSS-переменные

В `tailwind.config.ts` цвета должны быть `var(--*)`, не hex:

```ts
// ❌ сломает тему
colors: {
  primary: "#22D3EE",
}

// ✅ правильно
colors: {
  primary: "var(--primary)",
}
```

Палитру описывать в `app/globals.css`:
```css
:root {
  --primary: #22D3EE;
  --text-primary: #F8FAFC;
  --background: #020617;
}
:root[data-theme="light"] {
  --primary: #0F766E;
  --text-primary: #0F172A;
  --background: #FFFFFF;
}
```

Если меняешь `tailwind.config.ts` — проверять в **обоих** темах (светлой и тёмной).

## 4. Default тема — всегда тёмная

В `components/layout/theme-provider.tsx`:
```tsx
// при пустом localStorage:
applyTheme("dark");  // ← НЕ matchMedia('prefers-color-scheme')
```

**Не восстанавливать `prefers-color-scheme` молча.** Светлая ОС = светлый сайт — ломает хай-тек-эстетику с бирюзовыми glow.

## 5. Streak — двойная логика (локальная + UTC)

В `lib/storage.ts` (`updateStreak`) сравнение дат **двухступенчатое**:
1. `isSameDay(last, now)` — по локальной таймзоне браузера (`getFullYear/getMonth/getDate`)
2. `dayDiff(now, last)` — через `Date.UTC(...)` для разницы в днях

Это сделано намеренно: «сегодня» определяется по локальной таймзоне пользователя, а разница между днями — по UTC, чтобы избежать DST-артефактов. **Не упрощать до `toDateString()` (нестабильно) и не заменять на чистый UTC (сломает «сегодня» для пользователя в +03).**

Если меняешь — обязательно проверь на границе суток в нескольких таймзонах.

## 6. Reaction Focus — ref-паттерн

В `components/games/reaction-focus.tsx`:
- `visualRef` — ref для актуального визуального состояния («idle» / «wait» / «go» / «result»)
- `goStartRef` — ref с timestamp момента показа Go
- `clearTimers()` в `useEffect`-return — иначе таймеры утекают между раундами

**Не заменять на обычный `useState` + `setTimeout` напрямую** — будут race conditions и двойные срабатывания.

## 7. ZIP для Beget — НЕ `Compress-Archive`, НЕ `tar -a`

Подробно — `references/deploy-beget.md`. Коротко:
- **PowerShell `Compress-Archive`** создаёт мусорный `404.html` рядом с папкой `404/`, Beget путает файл и папку, всё падает в 404.
- **`tar -a -c -f out.zip`** в Git Bash на Windows создаёт **tar-архив с расширением `.zip`**, а не настоящий ZIP. Beget-файловый менеджер не распакует его через «Распаковать ZIP», а покажет ошибку формата.
- **`tar -cvf out.zip`** без `-a` создаёт tar без расширения вообще, `unzip` не прочтёт.

**Решение:** `System.IO.Compression.ZipFile.CreateFromDirectory` через PowerShell (скрипт `build-zip.sh`), либо Проводник Windows, либо `7z a out.zip out/`.

## 8. Git push при мобильном интернете — дробить коммиты

`git push` пакета 1+ МБ через мобильный интернет валится с HTTP 408. **Дробить на 3-25 файлов в коммите.** Подробно: `feedback-git-push-on-slow-internet`.

## 9. `output: "export"` + `basePath` + `trailingSlash`

Эти три настройки в `next.config.mjs` **связаны**:
- `output: "export"` — статический экспорт
- `basePath: "/hib"` — для деплоя в подпапку
- `trailingSlash: true` — Beget/nginx требует `/training/`, а не `/training`
- `images: { unoptimized: true }` — без этого статика не соберётся

**Не менять одно без другого.** Если нужен деплой в корень — снимать `basePath` + менять все ссылки в коде с `/hib/` на `/`.

## 10. Логотип — `<Link>`, не `<a>`

В `components/layout/header.tsx` логотип — это `<Link href="/">`, не `<a href="/">`. Иначе при `basePath` ссылка ломается.

## 11. Достижения — `checkAchievements` вызывается из `addGameResult`

Не вызывать `checkAchievements` руками из компонента. Это побочный эффект, который должен сработать при сохранении результата. Иначе разблокировки могут не срабатывать.

## 12. LocalStorage key — единственный

`hib-user-progress` — один ключ на всё. При росте можно разбить на `hib-user-progress-stats`, `hib-user-progress-creative`, и т.д. Но для MVP один ключ — это OK.

## 13. SSR-гидратация

Любой компонент, использующий `localStorage`/`window`, должен иметь:
```tsx
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);
if (!mounted) return <Skeleton />;  // или null
```

Иначе будет ошибка гидратации: сервер рендерит пустоту, клиент — данные.

## 14. `next start` не работает с `output: "export"`

Проект собирается как статический экспорт (`output: "export"` в `next.config.mjs`). `next start` поверх этого **падает**:

```
Error: "next start" does not work with "output: export" configuration.
Use "npx serve@latest out" instead.
```

**Решение для проверок:** `npx serve out -l 3000` (скрипт `check-pages.sh` уже это делает).

**Не пытаться:** `npx next start`, `npx next dev` для проверки прода-сборки (dev-режим компилирует по запросу, медленно и не показывает реальную картину).

## 15. `basePath` влияет только на ссылки, не на структуру `out/`

`basePath: "/hib"` в `next.config.mjs` добавляет `/hib/` ко всем `<Link href>` и `useRouter().push` в сгенерированном HTML. **Но реальные файлы в `out/` лежат в корне**, а не в `out/hib/`:

```
out/
├── index.html         ← не out/hib/index.html
├── training/
│   └── index.html
└── games/
    └── memory-grid/
        └── index.html
```

**Реальный URL:** `https://sk108projects.ru/hib/` (nginx/Beget проксирует `/hib/*` на `out/*`).

**Локальная проверка:** `http://localhost:3000/`, **НЕ** `http://localhost:3000/hib/`. `serve` обслуживает `out/` от корня.

**Если нужен деплой в корень своего домена (без `/hib/`):**
1. Снять `basePath` в `next.config.mjs`
2. Пересобрать
3. Проверить, что ссылки в HTML теперь без `/hib/`
