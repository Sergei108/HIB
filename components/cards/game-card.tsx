import Link from "next/link";
import type { GameInfo } from "@/lib/types";
import { GlowCard } from "@/components/ui/glow-card";
import { getGameIcon, ChevronRightIcon, ClockIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

type GameCardProps = {
  game: GameInfo;
  size?: "default" | "compact";
};

const difficultyClass: Record<string, string> = {
  Лёгкая: "text-mint border-mint/30",
  Средняя: "text-primary border-primary/30",
  Высокая: "text-amber-300 border-amber-300/30",
};

export function GameCard({ game, size = "default" }: GameCardProps) {
  const Icon = getGameIcon(game.id);
  const isCompact = size === "compact";
  return (
    <Link
      href={game.path}
      className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl"
    >
      <GlowCard
        hover
        className={cn(
          "h-full",
          isCompact ? "p-5" : "p-6 sm:p-7",
        )}
      >
        <div className="relative flex flex-col h-full">
          <div className="flex items-start justify-between gap-3 mb-4">
            <span
              className={cn(
                "flex items-center justify-center rounded-xl border border-primary/30 bg-gradient-to-br text-primary shadow-glow-sm",
                isCompact ? "h-11 w-11" : "h-12 w-12",
                game.accent,
              )}
            >
              <Icon
                className={cn(
                  isCompact ? "h-5 w-5" : "h-6 w-6",
                )}
              />
            </span>
            <span
              className={cn(
                "rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] font-medium",
                difficultyClass[game.difficulty] || difficultyClass.Средняя,
              )}
            >
              {game.difficulty}
            </span>
          </div>
          <h3
            className={cn(
              "font-semibold text-text-primary tracking-tight",
              isCompact ? "text-lg" : "text-xl",
            )}
          >
            {game.title}
          </h3>
          <p
            className={cn(
              "mt-1.5 text-text-secondary leading-snug",
              isCompact ? "text-sm" : "text-sm",
            )}
          >
            {game.subtitle}
          </p>
          <p
            className={cn(
              "mt-3 text-text-secondary/90 leading-relaxed",
              isCompact ? "text-sm" : "text-sm",
            )}
          >
            {isCompact ? game.shortDescription : game.description}
          </p>
          <div className="mt-5 flex flex-wrap gap-1.5">
            {game.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-md border border-border-glow bg-background-deep/40 px-2 py-1 text-[11px] text-text-mint"
              >
                {skill}
              </span>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-border-glow pt-4">
            <span className="inline-flex items-center gap-1.5 text-xs text-text-secondary">
              <ClockIcon className="h-3.5 w-3.5" />
              {game.duration}
            </span>
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-transform group-hover:translate-x-0.5">
              Начать
              <ChevronRightIcon className="h-4 w-4" />
            </span>
          </div>
        </div>
      </GlowCard>
    </Link>
  );
}
