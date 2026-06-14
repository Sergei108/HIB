"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Главная" },
  { href: "/training", label: "Тренировки" },
  { href: "/dashboard", label: "Прогресс" },
  { href: "/research", label: "Наука" },
  { href: "/about", label: "О проекте" },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label="Меню"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="relative z-50 flex h-10 w-10 items-center justify-center rounded-lg border border-border-glow bg-background-deep/60 backdrop-blur-md transition-all hover:border-primary/60"
      >
        <span className="sr-only">Меню</span>
        <span className="relative block h-4 w-5">
          <span
            className={`absolute left-0 top-0 h-0.5 w-5 rounded bg-text-primary transition-all duration-300 ${
              open ? "translate-y-1.5 rotate-45" : ""
            }`}
          />
          <span
            className={`absolute left-0 top-1.5 h-0.5 w-5 rounded bg-text-primary transition-all duration-300 ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`absolute left-0 top-3 h-0.5 w-5 rounded bg-text-primary transition-all duration-300 ${
              open ? "-translate-y-1.5 -rotate-45" : ""
            }`}
          />
        </span>
      </button>
      {open && (
        <div
          className="fixed inset-0 top-16 z-40 bg-background/80 backdrop-blur-xl"
          onClick={() => setOpen(false)}
        >
          <nav
            className="mx-4 mt-4 rounded-2xl glass-strong p-4 flex flex-col gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            {links.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-xl px-4 py-3 text-base font-medium transition-all ${
                    active
                      ? "text-text-primary bg-gradient-to-r from-primary/15 to-mint/10 border border-primary/30"
                      : "text-text-secondary hover:text-text-primary hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </div>
  );
}
