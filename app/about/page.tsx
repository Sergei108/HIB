import type { Metadata } from "next";
import Link from "next/link";
import { GlowCard } from "@/components/ui/glow-card";
import {
  SparklesIcon,
  ArrowRightIcon,
  BrainIcon,
  ChartIcon,
  BookIcon,
  TargetIcon,
} from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "О проекте — HIB",
  description:
    "О Human Intelligence Boost: миссия, целевая аудитория, технологический стек и планы развития.",
};

const stack = [
  "Next.js 14 (App Router)",
  "React 18",
  "TypeScript",
  "Tailwind CSS",
  "localStorage",
  "Без backend",
];

const audience = [
  {
    icon: BrainIcon,
    title: "Тем, кто хочет фокуса",
    text: "Тем, кто замечает, что внимание рассеивается, а задачи требуют переключения чаще, чем глубокой работы.",
  },
  {
    icon: ChartIcon,
    title: "Тем, кто тренирует ум",
    text: "Тем, кто ценит научный подход и не любит «таблетки для мозга» без доказательной базы.",
  },
  {
    icon: TargetIcon,
    title: "Тем, кому важен прогресс",
    text: "Тем, кто любит видеть динамику — очки, уровни, достижения, история тренировок.",
  },
];

const roadmap = [
  {
    title: "Уже в проекте",
    items: [
      "5 тренировок на 3–7 минут",
      "9 достижений",
      "Прогресс и уровни в localStorage",
      "Адаптивная сложность в части игр",
      "Творческий дневник Creative Association",
    ],
  },
  {
    title: "В следующих версиях",
    items: [
      "Аккаунты и облачное хранение (Supabase)",
      "Графики прогресса и тренды",
      "Уведомления о новых достижениях",
      "AI-рекомендации тренировок",
      "Экспорт прогресса и творческого дневника",
    ],
  },
];

export default function AboutPage() {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-radial-glow opacity-60"
      />
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-text-mint">
            <SparklesIcon className="h-3.5 w-3.5" />
            HIB · О проекте
          </span>
          <h1 className="mt-5 text-4xl sm:text-5xl font-bold tracking-tight text-text-primary text-balance">
            Короткие тренировки для ума, которые не врут
          </h1>
          <p className="mt-4 text-lg text-text-secondary leading-relaxed max-w-2xl">
            Human Intelligence Boost — это веб-сервис коротких научных
            когнитивных тренировок на русском языке. Никаких подписок, аккаунтов
            и обещаний «вырасти IQ за неделю». Только проверенные парадигмы и
            честный near-transfer (ближний перенос).
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {audience.map((a) => {
            const Icon = a.icon;
            return (
              <GlowCard key={a.title} className="p-6 h-full">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-primary/30 bg-gradient-to-br from-primary/20 to-mint/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <h2 className="mt-4 text-lg font-semibold text-text-primary">
                  {a.title}
                </h2>
                <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                  {a.text}
                </p>
              </GlowCard>
            );
          })}
        </div>

        <div className="mt-12">
          <GlowCard className="p-6 sm:p-8" hover={false} strong>
            <h2 className="text-2xl font-semibold text-text-primary">Миссия</h2>
            <p className="mt-3 text-text-secondary leading-relaxed">
              Сделать сфокусированные когнитивные тренировки доступными,
              честными и научно грамотными. Не обещать чудес — давать
              инструмент для ежедневной практики и прозрачно объяснять, что
              именно тренируется и какие эффекты подтверждены.
            </p>
            <ul className="mt-5 grid gap-2 sm:grid-cols-2 text-sm text-text-secondary">
              <li className="inline-flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
                Валидизированные парадигмы в основе каждой игры
              </li>
              <li className="inline-flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-mint" />
                Прозрачные источники на странице /research
              </li>
              <li className="inline-flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
                Данные только в браузере пользователя
              </li>
              <li className="inline-flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-mint" />
                Дисклеймер: это не медицинский инструмент
              </li>
            </ul>
          </GlowCard>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <GlowCard className="p-6 sm:p-8" hover={false}>
            <h2 className="text-2xl font-semibold text-text-primary">
              Что входит в MVP
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-text-secondary">
              <li>· 5 тренировок: Memory Grid, Stroop Test, Reaction Focus, Logic Sequences, Creative Association</li>
              <li>· 9 достижений и 5 уровней прогресса</li>
              <li>· Шкала прогресса со статистикой, историей и творческим дневником</li>
              <li>· Адаптивная сложность в части игр</li>
              <li>· Полностью русский интерфейс, hi-tech тёмный дизайн</li>
            </ul>
          </GlowCard>
          <GlowCard className="p-6 sm:p-8" hover={false}>
            <h2 className="text-2xl font-semibold text-text-primary">Технологический стек</h2>
            <ul className="mt-4 space-y-2 text-sm text-text-secondary">
              {stack.map((s) => (
                <li key={s}>· {s}</li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-text-secondary leading-relaxed">
              Всё хранится локально в браузере через localStorage. Без
              регистрации, без backend, без Supabase в MVP.
            </p>
          </GlowCard>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {roadmap.map((r) => (
            <GlowCard key={r.title} className="p-6 sm:p-8" hover={false}>
              <h3 className="text-lg font-semibold text-text-primary">
                {r.title}
              </h3>
              <ul className="mt-4 space-y-2 text-sm text-text-secondary">
                {r.items.map((i) => (
                  <li key={i} className="inline-flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 rounded-full bg-mint" />
                    {i}
                  </li>
                ))}
              </ul>
            </GlowCard>
          ))}
        </div>

        <div className="mt-14">
          <GlowCard className="p-6 sm:p-8" hover={false} strong>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-text-primary inline-flex items-center gap-2">
                  <BookIcon className="h-5 w-5 text-primary" />
                  Финальный проект курса по Claude Code университета ZEROCODER в 2026
                </h3>
                <p className="mt-2 text-sm text-text-secondary max-w-xl">
                  HIB — это финальный проект курса по вайб-кодингу в Claude
                  Code.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/training" className="btn-primary px-6 py-3">
                  К тренировкам
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
                <Link href="/research" className="btn-ghost px-6 py-3">
                  Научная основа
                </Link>
              </div>
            </div>
          </GlowCard>
        </div>
      </div>
    </div>
  );
}
