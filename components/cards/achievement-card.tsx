import type { Achievement } from "@/lib/types";
import { GlowCard } from "@/components/ui/glow-card";
import { getAchievementIcon, CheckIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

type AchievementCardProps = {
  achievement: Achievement;
  unlocked: boolean;
};

export function AchievementCard({ achievement, unlocked }: AchievementCardProps) {
  const Icon = getAchievementIcon(achievement.id);
  return (
    <GlowCard
      className={cn(
        "p-5 h-full",
        !unlocked && "opacity-50 grayscale-[0.4]",
      )}
      hover={unlocked}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border",
            unlocked
              ? "border-primary/40 bg-gradient-to-br from-primary/25 to-mint/20 text-primary shadow-glow-sm"
              : "border-border-glow bg-background-deep/40 text-text-secondary",
          )}
        >
          <Icon className="h-5 w-5" />
          {unlocked && (
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-mint text-background">
              <CheckIcon className="h-3 w-3" />
            </span>
          )}
        </span>
        <div>
          <h3
            className={cn(
              "text-sm font-semibold",
              unlocked ? "text-text-primary" : "text-text-secondary",
            )}
          >
            {achievement.title}
          </h3>
          <p className="mt-1 text-xs text-text-secondary leading-relaxed">
            {achievement.description}
          </p>
        </div>
      </div>
    </GlowCard>
  );
}
