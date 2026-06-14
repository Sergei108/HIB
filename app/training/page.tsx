import type { Metadata } from "next";
import { games } from "@/lib/games";
import { GameCard } from "@/components/cards/game-card";
import { GlowCard } from "@/components/ui/glow-card";
import { SparklesIcon, ClockIcon, ChartIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Тренировки — HIB",
  description:
    "Пять научных когнитивных тренировок: Memory Grid, Stroop Test, Reaction Focus, Logic Sequences, Creative Association.",
};

export default function TrainingPage() {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-radial-glow opacity-70"
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-text-mint">
            <SparklesIcon className="h-3.5 w-3.5" />
            HIB · Тренировки
          </span>
          <h1 className="mt-5 text-4xl sm:text-5xl font-bold tracking-tight text-text-primary text-balance">
            Выберите тренировку
          </h1>
          <p className="mt-4 text-lg text-text-secondary leading-relaxed max-w-2xl">
            Пять сфокусированных упражнений на 3–7 минут. Каждая карточка —
            кликабельна: нажмите, чтобы начать.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: ClockIcon,
              title: "3–7 минут",
              text: "Короткие сессии легко встроить в день",
            },
            {
              icon: SparklesIcon,
              title: "Без регистрации",
              text: "Никаких аккаунтов, подписок и email",
            },
            {
              icon: ChartIcon,
              title: "Прогресс в браузере",
              text: "История хранится в localStorage",
            },
          ].map((b) => {
            const Icon = b.icon;
            return (
              <GlowCard key={b.title} className="p-5">
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-primary/30 bg-gradient-to-br from-primary/20 to-mint/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">
                      {b.title}
                    </p>
                    <p className="mt-0.5 text-xs text-text-secondary">
                      {b.text}
                    </p>
                  </div>
                </div>
              </GlowCard>
            );
          })}
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((g) => (
            <GameCard key={g.id} game={g} size="compact" />
          ))}
        </div>
      </div>
    </div>
  );
}
