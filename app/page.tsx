import Link from "next/link";
import { GlowCard } from "@/components/ui/glow-card";
import { GameCard } from "@/components/cards/game-card";
import { SkillCard } from "@/components/cards/skill-card";
import { games } from "@/lib/games";
import {
  ArrowRightIcon,
  BrainIcon,
  SparklesIcon,
  ChartIcon,
  BadgeIcon,
  CheckIcon,
} from "@/components/ui/icons";

const skillSet = [
  "Память",
  "Внимание",
  "Логика",
  "Скорость реакции",
  "Когнитивный контроль",
  "Креативность",
  "Ассоциативное мышление",
] as const;

const features = [
  {
    icon: BrainIcon,
    title: "Научно обоснованные парадигмы",
    text: "Corsi, change detection, Go/No-Go, Stroop, Raven, дивергентное мышление — внутри каждой игры.",
  },
  {
    icon: SparklesIcon,
    title: "Короткие сессии",
    text: "3–5 минут в день. Никаких длинных протоколов — фокус и прогресс.",
  },
  {
    icon: ChartIcon,
    title: "Прогресс и достижения",
    text: "Очки, уровни, streak, лучшие результаты, 9 достижений. История в localStorage.",
  },
  {
    icon: BadgeIcon,
    title: "Без воды и обещаний",
    text: "Мы не обещаем рост IQ. Только честные эффекты ближнего переноса (near-transfer) и научная база.",
  },
];

export default function HomePage() {
  return (
    <>
      <Hero />
      <Problem />
      <Features />
      <SkillsSection />
      <GamesSection />
      <ScienceSection />
      <CtaSection />
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-32 h-[480px] bg-radial-glow opacity-90"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 grid-bg opacity-50 mask-fade-b"
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-28 sm:pb-32">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-text-mint">
            <span className="h-1.5 w-1.5 rounded-full bg-mint animate-pulse-glow" />
            HIB · Cognitive Training
          </span>
          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-text-primary text-balance">
            Короткие научные тренировки для{" "}
            <span className="gradient-text">вашего интеллекта</span>
          </h1>
          <p className="mt-6 text-lg text-text-secondary leading-relaxed text-balance max-w-2xl">
            Human Intelligence Boost — веб-сервис когнитивных мини-игр для
            памяти, внимания, логики, скорости реакции и креативности. По 3–5
            минут в день, без регистрации и подписок.
          </p>
          <div className="mt-9 flex flex-col sm:flex-row items-center gap-3">
            <Link href="/training" className="btn-primary px-7 py-3.5 text-base">
              Начать тренировку
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <Link href="/research" className="btn-ghost px-7 py-3.5 text-base">
              Научная основа
            </Link>
          </div>
          <ul className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-text-secondary">
            {[
              "5 тренировок",
              "9 достижений",
              "Прогресс в браузере",
              "Только наука",
            ].map((t) => (
              <li key={t} className="inline-flex items-center gap-1.5">
                <CheckIcon className="h-3.5 w-3.5 text-mint" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Problem() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-8 items-start">
          <div className="lg:col-span-2">
            <p className="text-[11px] uppercase tracking-[0.18em] text-primary">
              Зачем это нужно
            </p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-text-primary text-balance">
              Внимание — главный ресурс XXI века
            </h2>
          </div>
          <div className="lg:col-span-3 space-y-4 text-text-secondary leading-relaxed">
            <p>
              Современный человек ежедневно переключается между десятками задач,
              каналов и стимулов. Рабочая память, внимание и когнитивный
              контроль работают в режиме постоянной перегрузки. Со временем это
              сказывается на концентрации, скорости реакции и качестве решений.
            </p>
            <p>
              HIB не обещает «прокачать IQ» — это запрещено современным
              консенсусом когнитивной науки. Сервис даёт другое: сфокусированные
              3–5-минутные тренировки, построенные на валидизированных
              экспериментальных парадигмах, чтобы поддерживать и тренировать
              базовые когнитивные навыки.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.18em] text-primary">
            Что внутри
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-text-primary text-balance">
            Тренажёр, который не врёт
          </h2>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <GlowCard key={f.title} className="p-5 h-full">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-primary/30 bg-gradient-to-br from-primary/20 to-mint/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-semibold text-text-primary">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                  {f.text}
                </p>
              </GlowCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function SkillsSection() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.18em] text-primary">
            Навыки
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-text-primary text-balance">
            Семь когнитивных функций в этом проекте
          </h2>
          <p className="mt-3 text-text-secondary">
            Каждая игра тренирует одну или несколько функций. Прогресс
            отображается в «Шкале прогресса», а данные хранятся локально в браузере.
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {skillSet.map((s) => (
            <SkillCard key={s} skill={s} />
          ))}
        </div>
      </div>
    </section>
  );
}

function GamesSection() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-[11px] uppercase tracking-[0.18em] text-primary">
              Тренировки
            </p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-text-primary text-balance">
              Пять упражнений на 3–7 минут
            </h2>
            <p className="mt-3 text-text-secondary">
              От зрительной памяти и когнитивного контроля до креативных
              ассоциаций. Каждая игра — это валидизированная парадигма с
              понятной механикой.
            </p>
          </div>
          <Link
            href="/training"
            className="text-sm font-medium text-primary hover:text-text-primary transition-colors inline-flex items-center gap-1.5"
          >
            Все тренировки
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((g) => (
            <GameCard key={g.id} game={g} size="compact" />
          ))}
        </div>
      </div>
    </section>
  );
}

function ScienceSection() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <GlowCard className="p-8 sm:p-12" hover={false} strong>
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-primary">
                Научный подход
              </p>
              <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-text-primary text-balance">
                Честно о ближнем и дальнем переносе (near- и far-transfer)
              </h2>
              <p className="mt-4 text-text-secondary leading-relaxed">
                Каждая игра HIB построена на признанной экспериментальной
                парадигме — это инструменты, которыми когнитивная психология
                измеряет память, внимание, торможение, индуктивное
                рассуждение и креативность с 1930-х годов.
              </p>
              <p className="mt-4 text-text-secondary leading-relaxed">
                Мета-анализы подтверждают: тренировка улучшает работу в самих
                задачах (near-transfer, ближний перенос). Far-transfer (дальний
                перенос) на общий IQ не
                подтверждается — и HIB это не обещает. Вместо магии —
                сфокусированная практика и научная база.
              </p>
              <div className="mt-7">
                <Link href="/research" className="btn-ghost px-6 py-2.5">
                  Открыть научный раздел
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { title: "Stroop, 1935", text: "Когнитивный контроль" },
                { title: "Corsi, 1972", text: "Рабочая память" },
                { title: "Mednick, 1962", text: "Ассоциативная теория креативности" },
                { title: "Miyake, 2000", text: "Исполнительные функции" },
                { title: "Carpenter, 1990", text: "Fluid reasoning (Raven)" },
                { title: "Simons, 2016", text: "Консенсус по brain training" },
              ].map((b) => (
                <div
                  key={b.title}
                  className="rounded-xl border border-border-glow bg-background-deep/40 p-4"
                >
                  <p className="text-xs text-primary font-mono">{b.title}</p>
                  <p className="mt-1.5 text-sm text-text-primary leading-snug">
                    {b.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </GlowCard>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text-primary text-balance">
          Готовы к первой тренировке?
        </h2>
        <p className="mt-4 text-text-secondary max-w-xl mx-auto">
          Выберите упражнение и проведите 3–5 минут с пользой. Прогресс
          сохранится локально — никаких аккаунтов.
        </p>
        <div className="mt-8 flex items-center justify-center">
          <Link href="/training" className="btn-primary px-8 py-3.5 text-base">
            Начать тренировку
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
