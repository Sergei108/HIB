import { ReactNode } from "react";
import Link from "next/link";
import { GlowCard } from "@/components/ui/glow-card";
import { SparkIcon, ArrowRightIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

export type ResultStat = {
  label: string;
  value: ReactNode;
  hint?: string;
};

type GameResultProps = {
  title: string;
  subtitle?: string;
  score: number;
  scoreLabel?: string;
  stats?: ResultStat[];
  newAchievements?: { id: string; title: string; description: string }[];
  primaryAction: { label: string; onClick?: () => void; href?: string };
  secondaryAction?: { label: string; href: string };
  tertiaryAction?: { label: string; href: string };
  children?: ReactNode;
};

export function GameResultView({
  title,
  subtitle,
  score,
  scoreLabel = "Очки",
  stats = [],
  newAchievements = [],
  primaryAction,
  secondaryAction,
  tertiaryAction,
  children,
}: GameResultProps) {
  return (
    <GlowCard className="p-6 sm:p-10" hover={false} strong>
      <div className="text-center">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/40 bg-gradient-to-br from-primary/25 to-mint/15 text-primary shadow-glow mb-5">
          <SparkIcon className="h-7 w-7" />
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-text-secondary max-w-xl mx-auto">
            {subtitle}
          </p>
        )}

        <div className="mt-7 inline-flex flex-col items-center rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/15 to-mint/10 px-10 py-6 shadow-glow-sm">
          <p className="text-[10px] uppercase tracking-[0.18em] text-text-secondary">
            {scoreLabel}
          </p>
          <p className="mt-1 text-5xl sm:text-6xl font-bold gradient-text">
            {score}
          </p>
        </div>

        {stats.length > 0 && (
          <div className="mt-7 grid w-full max-w-2xl mx-auto grid-cols-2 sm:grid-cols-3 gap-3">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-border-glow bg-background-deep/40 p-4"
              >
                <p className="text-[10px] uppercase tracking-[0.18em] text-text-secondary">
                  {s.label}
                </p>
                <p className="mt-1.5 text-lg font-semibold text-text-primary">
                  {s.value}
                </p>
                {s.hint && (
                  <p className="text-[11px] text-text-secondary mt-0.5">
                    {s.hint}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {newAchievements.length > 0 && (
          <div className="mt-7 text-left">
            <p className="text-[10px] uppercase tracking-[0.18em] text-text-secondary mb-3">
              Новые достижения
            </p>
            <div className="space-y-2">
              {newAchievements.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center gap-3 rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 to-mint/5 p-3"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-mint/20 text-mint">
                    <SparkIcon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">
                      {a.title}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {a.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {children}

        <div
          className={cn(
            "mt-9 flex flex-col sm:flex-row items-center justify-center gap-3",
          )}
        >
          {primaryAction.href ? (
            <Link href={primaryAction.href} className="btn-primary px-7 py-3">
              {primaryAction.label}
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          ) : (
            <button
              type="button"
              onClick={primaryAction.onClick}
              className="btn-primary px-7 py-3"
            >
              {primaryAction.label}
              <ArrowRightIcon className="h-4 w-4" />
            </button>
          )}
          {secondaryAction && (
            <Link href={secondaryAction.href} className="btn-ghost px-7 py-3">
              {secondaryAction.label}
            </Link>
          )}
        </div>
        {tertiaryAction && (
          <div className="mt-3 flex items-center justify-center">
            <Link
              href={tertiaryAction.href}
              className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              {tertiaryAction.label}
            </Link>
          </div>
        )}
      </div>
    </GlowCard>
  );
}
