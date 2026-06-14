import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type GlowCardProps = {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  strong?: boolean;
  as?: "div" | "article" | "section";
};

export function GlowCard({
  children,
  className = "",
  hover = true,
  strong = false,
  as: Tag = "div",
}: GlowCardProps) {
  return (
    <Tag
      className={cn(
        "relative rounded-2xl overflow-hidden",
        strong ? "glass-strong" : "glass",
        hover && "card-hover",
        className,
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, rgba(34,211,238,0.06), transparent 70%)",
        }}
      />
      <div className="relative">{children}</div>
    </Tag>
  );
}
