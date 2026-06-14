import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative border-t border-border-glow">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/40 bg-gradient-to-br from-primary/20 to-mint/20">
                <span className="text-base font-bold gradient-text">H</span>
              </span>
              <div>
                <div className="text-sm font-semibold text-text-primary">
                  Human Intelligence Boost
                </div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-text-secondary">
                  HIB
                </div>
              </div>
            </div>
            <p className="mt-4 text-sm text-text-secondary leading-relaxed max-w-sm">
              Короткие научные тренировки для памяти, внимания, логики и
              креативности. По 3–5 минут в день.
            </p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.18em] text-text-secondary mb-4">
              Навигация
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/training"
                  className="text-text-primary/80 hover:text-primary transition-colors"
                >
                  Тренировки
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-text-primary/80 hover:text-primary transition-colors"
                >
                  Прогресс и достижения
                </Link>
              </li>
              <li>
                <Link
                  href="/research"
                  className="text-text-primary/80 hover:text-primary transition-colors"
                >
                  Научная основа
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-text-primary/80 hover:text-primary transition-colors"
                >
                  О проекте
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.18em] text-text-secondary mb-4">
              Дисклеймер
            </h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              HIB — образовательный сервис. Не является медицинским
              инструментом, не диагностирует и не лечит когнитивные нарушения.
              Финальный проект курса по Claude Code университета ZEROCODER в 2026.
            </p>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-border-glow flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-text-secondary">
            © 2026 Human Intelligence Boost
          </p>
          <p className="text-xs text-text-secondary">
            Сделано с вниманием к науке и деталям
          </p>
        </div>
      </div>
    </footer>
  );
}
