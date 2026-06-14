import type { GameResult } from "@/lib/types";
import { GlowCard } from "@/components/ui/glow-card";
import { getGameIcon, ClockIcon } from "@/components/ui/icons";
import { formatDate, formatReactionTime } from "@/lib/utils";

type LastSessionCardProps = {
  result: GameResult;
};

export function LastSessionCard({ result }: LastSessionCardProps) {
  const Icon = getGameIcon(result.gameId);
  return (
    <GlowCard className="p-4 sm:p-5" hover>
      <div className="flex items-center gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-primary/30 bg-gradient-to-br from-primary/20 to-mint/10 text-primary">
          <Icon className="h-5 w-5" />
        </span>
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-medium text-text-primary">
            {result.gameTitle}
          </p>
          <p className="text-xs text-text-secondary">
            {formatDate(result.completedAt)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold gradient-text">
            {result.score}
          </p>
          {typeof result.reactionTimeMs === "number" && (
            <p className="text-[11px] text-text-secondary inline-flex items-center gap-1">
              <ClockIcon className="h-3 w-3" />
              {formatReactionTime(result.reactionTimeMs)}
            </p>
          )}
        </div>
      </div>
    </GlowCard>
  );
}
