import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { GlowCard } from "@/components/ui/glow-card";

type StatCardProps = {
  label: string;
  value: ReactNode;
  hint?: string;
  icon: ReactNode;
  tone?: "primary" | "mint" | "neutral";
  className?: string;
};

const toneStyles: Record<NonNullable<StatCardProps["tone"]>, string> = {
  primary:
    "from-primary/20 to-primary/5 border-primary/30 text-primary",
  mint: "from-mint/20 to-mint/5 border-mint/30 text-mint",
  neutral: "from-white/5 to-white/0 border-border-glow text-text-primary",
};

export function StatCard({
  label,
  value,
  hint,
  icon,
  tone = "primary",
  className,
}: StatCardProps) {
  return (
    <GlowCard className={cn("p-5 sm:p-6", className)} hover>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-text-secondary">
            {label}
          </p>
          <p className="mt-2 text-3xl sm:text-4xl font-semibold text-text-primary tracking-tight">
            {value}
          </p>
          {hint && (
            <p className="mt-1.5 text-xs text-text-secondary">{hint}</p>
          )}
        </div>
        <span
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-xl border bg-gradient-to-br shadow-glow-sm",
            toneStyles[tone],
          )}
        >
          {icon}
        </span>
      </div>
    </GlowCard>
  );
}
