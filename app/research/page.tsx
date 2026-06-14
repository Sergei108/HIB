import type { Metadata } from "next";
import Link from "next/link";
import { GlowCard } from "@/components/ui/glow-card";
import { researchSections, researchSources } from "@/lib/research";
import { BrainIcon, ArrowRightIcon, ChartIcon, BookIcon } from "@/components/ui/icons";

const skillLink = [
  { game: "Memory Grid", skill: "рабочая и зрительная память" },
  { game: "Stroop Test", skill: "внимание и когнитивный контроль" },
  { game: "Reaction Focus", skill: "реакция и тормозной контроль" },
  { game: "Logic Sequences", skill: "логическое и абстрактное мышление" },
  { game: "Creative Association", skill: "креативность и ассоциативное мышление" },
];

const myths = [
  {
    myth: "Brain training (Lumosity) повышает IQ",
    fact: "Null far-transfer. FTC оштрафовал Lumosity на $2M за вводящую в заблуждение рекламу",
  },
  {
    myth: "Шахматы делают умнее",
    fact: "Эффект g=0.34 исчезает при активном контроле",
  },
  {
    myth: "Музыкальная школа повышает IQ",
    fact: "При активном контроле g≈0; корреляция через SES семьи",
  },
  {
    myth: "Омега-3 улучшает память у здоровых",
    fact: "Null (Cochrane)",
  },
  {
    myth: "Гинкго билоба защищает от деменции",
    fact: "Null (GEM trial, JAMA 2008)",
  },
  {
    myth: "Мы используем только 10% мозга",
    fact: "Миф; вся кора активна",
  },
];

export const metadata: Metadata = {
  title: "Научная основа — HIB",
  description:
    "Научные парадигмы, лежащие в основе тренировок Human Intelligence Boost: рабочая память, эффект Струпа, Go/No-Go, fluid reasoning, дивергентное мышление.",
};

export default function ResearchPage() {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-radial-glow opacity-60"
      />
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-text-mint">
            <BrainIcon className="h-3.5 w-3.5" />
            HIB · Наука
          </span>
          <h1 className="mt-5 text-4xl sm:text-5xl font-bold tracking-tight text-text-primary text-balance">
            Научная основа HIB
          </h1>
          <p className="mt-4 text-lg text-text-secondary leading-relaxed max-w-2xl">
            Каждая тренировка построена на признанной экспериментальной
            парадигме. Эта страница — карта понятий и источников, на которые
            опирается проект.
          </p>
        </div>

        <div className="mt-10">
          <GlowCard className="p-6 sm:p-7" hover={false} strong>
            <div className="grid gap-6 sm:grid-cols-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-primary">
                  Near-transfer (ближний перенос)
                </p>
                <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                  Подтверждается: тренировка улучшает работу в самих задачах
                  и близких к ним (g ≈ 0.25–0.30).
                </p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-primary">
                  Far-transfer (дальний перенос)
                </p>
                <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                  Не подтверждается: упражнения не «прокачивают» общий IQ
                  или защищают от деменции (Simons et al., 2016).
                </p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-primary">
                  Креативность
                </p>
                <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                  Исключение: тренировка дивергентного мышления показывает
                  устойчивые эффекты (g ≈ 0.29–0.53).
                </p>
              </div>
            </div>
          </GlowCard>
        </div>

        <div className="mt-12">
          <GlowCard className="p-6 sm:p-8" hover={false} strong>
            <h2 className="text-2xl font-semibold text-text-primary">
              Связь упражнений HIB с навыками
            </h2>
            <p className="mt-2 text-sm text-text-secondary leading-relaxed">
              Краткая карта: какая игра тренирует какой навык.
            </p>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border-glow">
                    <th className="text-left py-3 pr-4 font-semibold text-text-primary">
                      Упражнение
                    </th>
                    <th className="text-left py-3 font-semibold text-text-primary">
                      Навык
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {skillLink.map((row) => (
                    <tr
                      key={row.game}
                      className="border-b border-border-glow/50 last:border-0"
                    >
                      <td className="py-3 pr-4 text-text-primary font-medium">
                        {row.game}
                      </td>
                      <td className="py-3 text-text-secondary">
                        {row.skill}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlowCard>
        </div>

        <div className="mt-12">
          <GlowCard className="p-6 sm:p-8" hover={false} strong>
            <h2 className="text-2xl font-semibold text-text-primary">
              Что это такое
            </h2>
            <p className="mt-3 text-text-secondary leading-relaxed">
              <strong className="text-text-primary">Интеллект</strong> — это не
              одна штука в мозге, а статистический конструкт. Все когнитивные
              тесты положительно коррелируют между собой (феномен «положительного
              многообразия»), и эта общая дисперсия называется{" "}
              <strong className="text-text-primary">g-фактором</strong> (Спирмен,
              1904). Он объясняет ~40–50% различий между людьми по батарее
              когнитивных тестов.
            </p>
            <p className="mt-3 text-text-secondary leading-relaxed">
              Современный рабочий стандарт — модель{" "}
              <strong className="text-text-primary">CHC</strong> (Cattell–Horn–Carroll,
              1993): трёхуровневая иерархия с g на вершине, 16+ широкими
              способностями в середине (fluid reasoning, crystallized knowledge,
              working memory, processing speed и др.) и 80+ узкими внизу.
            </p>
          </GlowCard>
        </div>

        <div className="mt-6">
          <GlowCard className="p-6 sm:p-8" hover>
            <h2 className="text-2xl font-semibold text-text-primary">
              Две главные оси
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-border-glow bg-background-deep/40 p-5">
                <p className="text-[11px] uppercase tracking-[0.18em] text-primary">
                  Fluid (Gf)
                </p>
                <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                  Способность решать новые задачи, абстрактно мыслить. Пик
                  ~20–25 лет, дальше плавное снижение (~0.02 SD/год).
                </p>
              </div>
              <div className="rounded-xl border border-border-glow bg-background-deep/40 p-5">
                <p className="text-[11px] uppercase tracking-[0.18em] text-mint">
                  Crystallized (Gc)
                </p>
                <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                  Накопленные знания, словарь, опыт. Растёт до 60+, снижается
                  медленнее.
                </p>
              </div>
            </div>
          </GlowCard>
        </div>

        <div className="mt-6">
          <GlowCard className="p-6 sm:p-8" hover>
            <h2 className="text-2xl font-semibold text-text-primary">
              Что говорит биология
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm text-text-secondary leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                <span>
                  <strong className="text-text-primary">Наследуемость:</strong>{" "}
                  ~50–80% во взрослом возрасте (по близнецовым исследованиям).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-mint shrink-0" />
                <span>
                  <strong className="text-text-primary">SNP-наследуемость</strong>{" "}
                  (по GWAS): ~10–20% — большой «heritability gap», который пока
                  не закрыт.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                <span>
                  Самые крупные GWAS: Savage 2018 (Nature Genetics, N=269 867,
                  205 loci) и Hill 2018 (N=248 482, 187 loci).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-mint shrink-0" />
                <span>
                  <strong className="text-text-primary">Нейронная сеть интеллекта</strong>{" "}
                  — P-FIT (Jung &amp; Haier, 2007): дорсолатеральная
                  префронтальная кора + теменная + передняя поясная + связи
                  через белое вещество.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                <span>
                  <strong className="text-text-primary">Размер мозга ↔ IQ:</strong>{" "}
                  корреляция есть, но слабая (r ≈ 0.24–0.40), объясняет лишь
                  ~10% дисперсии. Главное — не размер, а эффективность сетей.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-mint shrink-0" />
                <span>
                  Главный медиатор возрастного снижения — скорость обработки
                  информации (processing speed, Salthouse).
                </span>
              </li>
            </ul>
          </GlowCard>
        </div>

        <div className="mt-6">
          <GlowCard className="p-6 sm:p-8" hover>
            <h2 className="text-2xl font-semibold text-text-primary">
              Что реально работает (топ-5)
            </h2>
            <ol className="mt-4 space-y-3 text-sm text-text-secondary leading-relaxed">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-xs font-semibold text-primary">
                  1
                </span>
                <span>
                  <strong className="text-text-primary">
                    Аэробная нагрузка 150+ мин/нед.
                  </strong>{" "}
                  Erickson 2011 (PNAS): +2% гиппокампа и +1.67% памяти за год.
                  Механизм — BDNF, нейрогенез.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-xs font-semibold text-primary">
                  2
                </span>
                <span>
                  <strong className="text-text-primary">Сон 7–9 часов.</strong>{" "}
                  SWS консолидирует декларативную память и очищает мозг от
                  β-амилоида (Xie 2013, Science). 6 ночей по 4 часа = 24 часа
                  полной депривации.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-xs font-semibold text-primary">
                  3
                </span>
                <span>
                  <strong className="text-text-primary">
                    Средиземноморская / MIND диета.
                  </strong>{" "}
                  Овощи, рыба, оливковое масло, орехи. Обсервационно −53% риска
                  Альцгеймера; RCT (Barnes 2023 NEJM) — когнитивный эффект не
                  достиг значимости (P=0.23), но есть снижение биомаркеров.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-xs font-semibold text-primary">
                  4
                </span>
                <span>
                  <strong className="text-text-primary">
                    14 модифицируемых факторов риска
                  </strong>{" "}
                  (Lancet Commission 2024) — потенциально 45% профилактики
                  деменции: образование, слух, холестерин, депрессия, ЧМТ,
                  гиподинамия, диабет, алкоголь, курение, загрязнение воздуха,
                  изоляция, зрение, гипертензия, ожирение.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-xs font-semibold text-primary">
                  5
                </span>
                <span>
                  <strong className="text-text-primary">
                    Освоение новых сложных навыков в любом возрасте
                  </strong>{" "}
                  (Park 2014, Synapse Project) — долгосрочные улучшения памяти у
                  пожилых.
                </span>
              </li>
            </ol>
          </GlowCard>
        </div>

        <div className="mt-6">
          <GlowCard className="p-6 sm:p-8" hover>
            <h2 className="text-2xl font-semibold text-text-primary">
              Что НЕ работает (главные мифы)
            </h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border-glow">
                    <th className="text-left py-3 pr-4 font-semibold text-text-primary">
                      Миф
                    </th>
                    <th className="text-left py-3 font-semibold text-text-primary">
                      Что говорит наука
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {myths.map((m) => (
                    <tr
                      key={m.myth}
                      className="border-b border-border-glow/50 last:border-0 align-top"
                    >
                      <td className="py-3 pr-4 text-text-primary font-medium">
                        {m.myth}
                      </td>
                      <td className="py-3 text-text-secondary">{m.fact}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlowCard>
        </div>

        <div className="mt-6">
          <GlowCard className="p-6 sm:p-8" hover={false} strong>
            <h2 className="text-2xl font-semibold text-text-primary">
              Ключевой принцип
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm text-text-secondary leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-mint shrink-0" />
                <span>
                  <strong className="text-text-primary">Near-transfer</strong>{" "}
                  (ближний перенос, тренировка → похожая задача) — есть.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                <span>
                  <strong className="text-text-primary">Far-transfer</strong>{" "}
                  (дальний перенос, тренировка → общий интеллект / жизненный
                  успех) —{" "}
                  <strong className="text-text-primary">не подтверждён</strong>{" "}
                  ни для какого типа когнитивного тренинга (Sala &amp; Gobet
                  2019, мета-мета-анализ).
                </span>
              </li>
            </ul>
            <p className="mt-4 text-text-secondary leading-relaxed">
              Работает не «тренировка мозга сама по себе», а{" "}
              <strong className="text-text-primary">образ жизни в целом</strong>:
              движение, сон, питание, социальные связи, новизна, смысл.
            </p>
          </GlowCard>
        </div>

        <div className="mt-6">
          <GlowCard className="p-6 sm:p-8" hover={false} strong>
            <h2 className="text-2xl font-semibold text-text-primary">
              Одно предложение
            </h2>
            <p className="mt-3 text-text-secondary leading-relaxed">
              Интеллект — на 50–80% генетически обусловленная, но пластичная в
              течение всей жизни способность; её нельзя «прокачать»
              упражнениями, но её можно{" "}
              <strong className="text-text-primary">
                сохранить и замедлить её снижение
              </strong>{" "}
              через движение, сон, питание, обучение и управление медицинскими
              рисками.
            </p>
          </GlowCard>
        </div>

        <div className="mt-12 space-y-6">
          {researchSections.map((s) => (
            <GlowCard key={s.id} className="p-6 sm:p-8" hover>
              <h2 className="text-2xl font-semibold text-text-primary">
                {s.title}
              </h2>
              <p className="mt-4 text-text-secondary leading-relaxed whitespace-pre-line">
                {s.body}
              </p>
            </GlowCard>
          ))}
        </div>

        <div className="mt-14">
          <div className="flex items-end justify-between gap-3 mb-5">
            <h2 className="text-2xl font-semibold text-text-primary inline-flex items-center gap-2">
              <BookIcon className="h-5 w-5 text-primary" />
              Источники
            </h2>
            <span className="text-xs text-text-secondary">
              Главные работы, на которые опирается проект
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {researchSources.map((s) => (
              <a
                key={`${s.authors}-${s.year}`}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl"
              >
                <GlowCard className="p-4 h-full">
                  <p className="text-xs text-primary font-mono">
                    {s.authors}, {s.year}
                  </p>
                  <p className="mt-1.5 text-sm text-text-primary leading-snug">
                    {s.title}
                  </p>
                  <p className="mt-1.5 text-xs text-text-secondary leading-relaxed">
                    {s.note}
                  </p>
                  <p className="mt-2 text-[10px] text-primary/80 break-all">
                    {s.url}
                  </p>
                </GlowCard>
              </a>
            ))}
          </div>
        </div>

        <div className="mt-14">
          <GlowCard className="p-6 sm:p-8" hover={false} strong>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-text-primary inline-flex items-center gap-2">
                  <ChartIcon className="h-5 w-5 text-primary" />
                  Готовы попробовать?
                </h3>
                <p className="mt-1.5 text-sm text-text-secondary">
                  Знание — хорошо, практика — лучше. Откройте тренировку и
                  проведите 3–5 минут с пользой.
                </p>
              </div>
              <Link href="/training" className="btn-primary px-6 py-3">
                К тренировкам
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </GlowCard>
        </div>
      </div>
    </div>
  );
}
