import type { GameInfo } from "@/lib/types";
import { GlowCard } from "@/components/ui/glow-card";
import { getGameIcon, ClockIcon, ArrowRightIcon, BookIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

type GameIntroProps = {
  game: GameInfo;
  onStart: () => void;
  startLabel?: string;
};

const difficultyClass: Record<string, string> = {
  Лёгкая: "text-mint border-mint/30",
  Средняя: "text-primary border-primary/30",
  Высокая: "text-amber-300 border-amber-300/30",
};

export function GameIntro({ game, onStart, startLabel = "Начать" }: GameIntroProps) {
  const Icon = getGameIcon(game.id);
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <GlowCard className="p-6 sm:p-10" hover={false} strong>
        <div className="flex flex-col items-center text-center">
          <span
            className={cn(
              "mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/40 bg-gradient-to-br text-primary shadow-glow",
              game.accent,
            )}
          >
            <Icon className="h-8 w-8" />
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary">
            {game.title}
          </h1>
          <p className="mt-2 text-text-secondary max-w-xl">{game.subtitle}</p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {game.skills.map((s) => (
              <span
                key={s}
                className="rounded-full border border-border-glow bg-background-deep/40 px-3 py-1 text-xs text-text-mint"
              >
                {s}
              </span>
            ))}
          </div>

          <p className="mt-8 max-w-2xl text-text-secondary leading-relaxed">
            {game.description}
          </p>

          <div className="mt-8 grid w-full max-w-md grid-cols-2 gap-3">
            <div className="rounded-xl border border-border-glow bg-background-deep/40 p-4">
              <p className="text-[10px] uppercase tracking-[0.18em] text-text-secondary">
                Длительность
              </p>
              <p className="mt-1.5 inline-flex items-center gap-1.5 text-base font-medium text-text-primary">
                <ClockIcon className="h-4 w-4 text-primary" />
                {game.duration}
              </p>
            </div>
            <div className="rounded-xl border border-border-glow bg-background-deep/40 p-4">
              <p className="text-[10px] uppercase tracking-[0.18em] text-text-secondary">
                Сложность
              </p>
              <p
                className={cn(
                  "mt-1.5 inline-flex items-center rounded-full border px-2.5 py-0.5 text-sm",
                  difficultyClass[game.difficulty] || difficultyClass.Средняя,
                )}
              >
                {game.difficulty}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onStart}
            className="btn-primary mt-10 px-8 py-3.5 text-base"
          >
            {startLabel}
            <ArrowRightIcon className="h-4 w-4" />
          </button>
        </div>
      </GlowCard>

      {game.longDescription && (
        <GlowCard className="p-6 sm:p-8" hover>
          <div className="inline-flex items-center gap-2 text-text-mint">
            <BookIcon className="h-4 w-4" />
            <span className="text-[11px] uppercase tracking-[0.18em]">
              Подробное описание
            </span>
          </div>
          <h2 className="mt-2 text-xl font-semibold text-text-primary">
            Научная база упражнения
          </h2>
          <p className="mt-4 text-sm text-text-secondary leading-relaxed whitespace-pre-line">
            {game.longDescription}
          </p>
        </GlowCard>
      )}
    </div>
  );
}
