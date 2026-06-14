import Link from "next/link";
import { MainNav } from "@/components/layout/main-nav";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="absolute inset-0 bg-background/60 backdrop-blur-xl border-b border-border-glow" />
      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-primary/40 bg-gradient-to-br from-primary/20 to-mint/20 shadow-glow-sm">
            <span className="text-base font-bold gradient-text">H</span>
            <span className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-glow" />
          </span>
          <span className="hidden sm:flex flex-col leading-none">
            <span className="text-sm font-semibold tracking-wide text-text-primary">
              Human Intelligence Boost
            </span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-text-secondary">
              HIB · Cognitive Training
            </span>
          </span>
        </Link>
        <MainNav />
        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
