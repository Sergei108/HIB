"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Главная" },
  { href: "/training", label: "Тренировки" },
  { href: "/dashboard", label: "Прогресс" },
  { href: "/research", label: "Наука" },
  { href: "/about", label: "О проекте" },
];

export function MainNav() {
  const pathname = usePathname();
  return (
    <nav className="hidden md:flex items-center gap-1">
      {links.map((link) => {
        const active =
          link.href === "/"
            ? pathname === "/"
            : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`relative rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-300 ${
              active
                ? "text-text-primary"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {active && (
              <span className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/15 to-mint/10 border border-primary/30 shadow-glow-sm" />
            )}
            <span className="relative">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
