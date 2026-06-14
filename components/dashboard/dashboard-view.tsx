"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GlowCard } from "@/components/ui/glow-card";
import { StatCard } from "@/components/cards/stat-card";
import { AchievementCard } from "@/components/cards/achievement-card";
import { LastSessionCard } from "@/components/cards/last-session-card";
import { GameCard } from "@/components/cards/game-card";
import {
  BrainIcon,
  FlameIcon,
  ChartIcon,
  BadgeIcon,
  ArrowRightIcon,
  SparklesIcon,
  FeatherIcon,
} from "@/components/ui/icons";
import { achievements as allAchievements } from "@/lib/achievements";
import { games } from "@/lib/games";
import { levelRange, levelTitle, calculateLevel } from "@/lib/levels";
import {
  getProgress,
  getRecentResults,
  getBestResults,
  getRecentCreativeEntries,
  resetProgress,
} from "@/lib/storage";
import type { UserProgress } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function DashboardView() {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setProgress(getProgress());
  }, []);

  if (!mounted || !progress) {
    return <DashboardSkeleton />;
  }

  const hasAny = progress.results.length > 0 || progress.creativeEntries.length > 0;

  if (!hasAny) {
    return <EmptyState />;
  }

  const recent = getRecentResults(5);
  const best = getBestResults();
  const creative = getRecentCreativeEntries(3);
  const level = calculateLevel(progress.totalScore);
  const range = levelRange(level);
  const nextLevelScore = level >= 5 ? null : (level === 1 ? 200 : level === 2 ? 500 : level === 3 ? 900 : 1400);
  const progressPct = (() => {
    if (level >= 5) return 100;
    if (!range.max) return 100;
    return Math.min(100, Math.max(0, ((progress.totalScore - range.min) / (range.max - range.min + 1)) * 100));
  })();

  function handleReset() {
    if (typeof window === "undefined") return;
    const ok = window.confirm("Сбросить весь прогресс? Это действие необратимо.");
    if (!ok) return;
    const fresh = resetProgress();
    setProgress(fresh);
  }

  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-radial-glow opacity-60"
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-text-mint">
              <BadgeIcon className="h-3.5 w-3.5" />
              {levelTitle(level)} · Уровень {level}
            </span>
            <h1 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight text-text-primary text-balance">
              Ваш прогресс
            </h1>
            <p className="mt-3 text-text-secondary max-w-2xl">
              История тренировок, лучшие результаты, достижения и творческие
              ответы. Данные хранятся локально в этом браузере.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/training" className="btn-primary px-5 py-2.5 text-sm">
              К тренировкам
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={handleReset}
              className="btn-ghost px-4 py-2.5 text-sm"
            >
              Сбросить
            </button>
          </div>
        </div>

        <div className="mt-10">
          <GlowCard className="p-5 sm:p-6" hover={false}>
            <div className="flex items-center justify-between mb-2 text-sm">
              <span className="text-text-secondary">
                До уровня {Math.min(5, level + 1)}
              </span>
              <span className="text-text-secondary">
                {progress.totalScore}
                {nextLevelScore ? ` / ${nextLevelScore}` : " · максимум"}
              </span>
            </div>
            <div className="h-2 rounded-full bg-background-deep/60 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-mint transition-all duration-700"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </GlowCard>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Всего очков"
            value={progress.totalScore}
            hint={`за ${progress.completedSessions} сессий`}
            icon={<BrainIcon className="h-5 w-5" />}
            tone="primary"
          />
          <StatCard
            label="Уровень"
            value={level}
            hint={levelTitle(level)}
            icon={<BadgeIcon className="h-5 w-5" />}
            tone="mint"
          />
          <StatCard
            label="Streak"
            value={progress.currentStreak}
            hint="дней подряд"
            icon={<FlameIcon className="h-5 w-5" />}
            tone="primary"
          />
          <StatCard
            label="Тренировок"
            value={progress.completedSessions}
            hint="с момента старта"
            icon={<ChartIcon className="h-5 w-5" />}
            tone="neutral"
          />
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SectionTitle title="Последние тренировки" />
            {recent.length === 0 ? (
              <p className="text-text-secondary text-sm">Пока нет результатов.</p>
            ) : (
              <div className="space-y-3">
                {recent.map((r) => (
                  <LastSessionCard key={r.id} result={r} />
                ))}
              </div>
            )}

            <div className="mt-10">
              <SectionTitle title="Лучшие результаты по играм" />
              {best.length === 0 ? (
                <p className="text-text-secondary text-sm">Сыграйте хотя бы раз.</p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {best.map((r) => {
                    const g = games.find((x) => x.id === r.gameId);
                    if (!g) return null;
                    return (
                      <GlowCard key={r.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-text-primary">
                              {g.title}
                            </p>
                            <p className="text-xs text-text-secondary">
                              {formatDate(r.completedAt)}
                            </p>
                          </div>
                          <p className="text-2xl font-bold gradient-text">
                            {r.score}
                          </p>
                        </div>
                      </GlowCard>
                    );
                  })}
                </div>
              )}
            </div>

            {creative.length > 0 && (
              <div className="mt-10">
                <SectionTitle
                  title="Творческие ответы"
                  icon={<FeatherIcon className="h-4 w-4 text-primary" />}
                />
                <div className="space-y-3">
                  {creative.map((c) => (
                    <GlowCard key={c.id} className="p-5" hover>
                      <div className="mb-2 flex flex-wrap gap-2">
                        {c.words.map((w) => (
                          <span
                            key={w}
                            className="rounded-md border border-border-glow bg-primary/5 px-2 py-0.5 text-xs text-text-mint"
                          >
                            {w}
                          </span>
                        ))}
                      </div>
                      <p className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap line-clamp-4">
                        {c.answer}
                      </p>
                      <p className="mt-2 text-[11px] text-text-secondary">
                        {formatDate(c.createdAt)} · {c.answer.length} символов
                      </p>
                    </GlowCard>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <SectionTitle
              title="Достижения"
              icon={<SparklesIcon className="h-4 w-4 text-mint" />}
              hint={`${progress.unlockedAchievements.length} / ${allAchievements.length}`}
            />
            <div className="space-y-3">
              {allAchievements.map((a) => (
                <AchievementCard
                  key={a.id}
                  achievement={a}
                  unlocked={progress.unlockedAchievements.includes(a.id)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16">
          <SectionTitle title="Что дальше" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {games.map((g) => (
              <GameCard key={g.id} game={g} size="compact" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({
  title,
  icon,
  hint,
}: {
  title: string;
  icon?: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="inline-flex items-center gap-2 text-lg font-semibold text-text-primary">
        {icon}
        {title}
      </h2>
      {hint && (
        <span className="text-xs text-text-secondary">{hint}</span>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-24 text-center">
      <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/20 to-mint/10 text-primary shadow-glow-sm">
        <BrainIcon className="h-8 w-8" />
      </div>
      <h1 className="mt-6 text-3xl sm:text-4xl font-bold tracking-tight text-text-primary">
        Здесь появится ваш прогресс
      </h1>
      <p className="mt-4 text-text-secondary">
        Вы ещё не проходили тренировки. Начните первую сессию, чтобы HIB начал
        отслеживать ваш прогресс.
      </p>
      <div className="mt-8 flex justify-center">
        <Link href="/training" className="btn-primary px-7 py-3.5 text-base">
          Перейти к тренировкам
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
      <div className="h-10 w-64 rounded-lg bg-background-deep/40 animate-pulse" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-32 rounded-2xl border border-border-glow bg-background-deep/40 animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}
