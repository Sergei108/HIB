"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { GameIntro } from "@/components/games/game-intro";
import { GameResultView } from "@/components/games/game-result";
import { getGameById } from "@/lib/games";
import { calculateMemoryScore } from "@/lib/scoring";
import { addGameResult } from "@/lib/storage";
import { uniqueId, randomInt, shuffle } from "@/lib/utils";
import { achievements as allAchievements } from "@/lib/achievements";
import { GlowCard } from "@/components/ui/glow-card";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "@/components/ui/icons";

type Phase = "intro" | "memorize" | "recall" | "result";

type Round = {
  size: 3 | 4;
  highlightCount: number;
  cells: number[];
};

function generateRound(roundIdx: number): Round {
  const size: 3 | 4 = roundIdx < 2 ? 3 : 4;
  const total = size * size;
  const highlightCount = Math.min(total, 3 + roundIdx);
  const cells = shuffle(
    Array.from({ length: total }, (_, i) => i),
  ).slice(0, highlightCount);
  return { size, highlightCount, cells };
}

export function MemoryGridGame() {
  const router = useRouter();
  const game = useMemo(() => getGameById("memory-grid")!, []);
  const [phase, setPhase] = useState<Phase>("intro");
  const [roundIdx, setRoundIdx] = useState(0);
  const [round, setRound] = useState<Round | null>(null);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [memorizeMs, setMemorizeMs] = useState(2200);
  const [correctCells, setCorrectCells] = useState(0);
  const [wrongCells, setWrongCells] = useState(0);
  const [perfectRounds, setPerfectRounds] = useState(0);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [finalStats, setFinalStats] = useState<{
    correct: number;
    wrong: number;
    perfect: number;
    total: number;
    durationMs: number;
  } | null>(null);
  const [newAchievements, setNewAchievements] = useState<
    { id: string; title: string; description: string }[]
  >([]);

  function startGame() {
    setPhase("memorize");
    setRoundIdx(0);
    setCorrectCells(0);
    setWrongCells(0);
    setPerfectRounds(0);
    setScore(0);
    setStartTime(Date.now());
    setNewAchievements([]);
    goToRound(0);
  }

  function goToRound(i: number) {
    const r = generateRound(i);
    setRound(r);
    setSelected(new Set());
    setMemorizeMs(1500 + r.highlightCount * 350);
    setPhase("memorize");
    setRoundIdx(i);
  }

  useEffect(() => {
    if (phase !== "memorize" || !round) return;
    const t = setTimeout(() => setPhase("recall"), memorizeMs);
    return () => clearTimeout(t);
  }, [phase, round, memorizeMs]);

  function toggleCell(idx: number) {
    if (phase !== "recall" || !round) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  }

  function submitRecall() {
    if (!round) return;
    const correctSet = new Set(round.cells);
    let correct = 0;
    let wrong = 0;
    selected.forEach((s) => {
      if (correctSet.has(s)) correct += 1;
      else wrong += 1;
    });
    correctSet.forEach((c) => {
      if (!selected.has(c)) wrong += 1;
    });
    setCorrectCells((c) => c + correct);
    setWrongCells((c) => c + wrong);
    if (correct === round.cells.length && wrong === 0) {
      setPerfectRounds((p) => p + 1);
    }
    if (roundIdx >= 4) {
      finalize(correct, wrong);
    } else {
      goToRound(roundIdx + 1);
    }
  }

  function finalize(lastCorrect: number, lastWrong: number) {
    const totalCorrect = correctCells + lastCorrect;
    const totalWrong = wrongCells + lastWrong;
    const perfect = perfectRounds + (lastCorrect === round!.cells.length && lastWrong === 0 ? 1 : 0);
    const finalScore = calculateMemoryScore({
      correctCells: totalCorrect,
      wrongCells: totalWrong,
      rounds: 5,
      perfectRounds: perfect,
    });
    setScore(finalScore);
    setFinalStats({
      correct: totalCorrect,
      wrong: totalWrong,
      perfect,
      total: 5,
      durationMs: Date.now() - startTime,
    });
    const before = addGameResult({
      id: uniqueId("res"),
      gameId: "memory-grid",
      gameTitle: game.title,
      score: finalScore,
      mistakes: totalWrong,
      correctAnswers: totalCorrect,
      totalQuestions: 5,
      durationMs: Date.now() - startTime,
      completedAt: new Date().toISOString(),
    });
    setNewAchievements(
      allAchievements
        .filter((a) => before.unlockedAchievements.includes(a.id))
        .map((a) => ({ id: a.id, title: a.title, description: a.description })),
    );
    setPhase("result");
  }

  if (phase === "intro") {
    return <GameIntro game={game} onStart={startGame} />;
  }

  if (phase === "result" && finalStats) {
    return (
      <GameResultView
        title="Тренировка завершена"
        subtitle="Зрительная рабочая память получила свою нагрузку. Прогресс сохранён."
        score={score}
        stats={[
          { label: "Раундов", value: finalStats.total },
          {
            label: "Точных клеток",
            value: finalStats.correct,
            hint: `ошибок: ${finalStats.wrong}`,
          },
          {
            label: "Идеальных раундов",
            value: finalStats.perfect,
            hint: "без единой ошибки",
          },
        ]}
        newAchievements={newAchievements}
        primaryAction={{ label: "Повторить", onClick: startGame }}
        secondaryAction={{ label: "Шкала прогресса", href: "/dashboard" }}
        tertiaryAction={{ label: "Выбрать тренировку", href: "/training" }}
      />
    );
  }

  return (
    <GlowCard className="p-6 sm:p-8" hover={false} strong>
      <div className="flex items-center justify-between mb-6">
        <p className="text-[11px] uppercase tracking-[0.18em] text-text-secondary">
          Раунд {roundIdx + 1} / 5
        </p>
        <p className="text-sm text-text-secondary">
          {phase === "memorize" ? (
            <span>Запомните подсветку…</span>
          ) : (
            <span>Воспроизведите паттерн</span>
          )}
        </p>
      </div>

      {round && (
        <div
          className={cn(
            "mx-auto grid gap-2 sm:gap-3",
            round.size === 3 ? "max-w-sm" : "max-w-md",
          )}
          style={{ gridTemplateColumns: `repeat(${round.size}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: round.size * round.size }).map((_, i) => {
            const isHighlighted =
              phase === "memorize" && round.cells.includes(i);
            const isSelected = selected.has(i);
            return (
              <button
                key={i}
                type="button"
                onClick={() => toggleCell(i)}
                disabled={phase === "memorize"}
                className={cn(
                  "aspect-square rounded-xl border transition-all duration-200",
                  isHighlighted
                    ? "border-primary bg-gradient-to-br from-primary/80 to-mint/60 shadow-glow animate-pulse-glow"
                    : isSelected
                    ? "border-mint bg-gradient-to-br from-mint/30 to-primary/20 shadow-glow-sm"
                    : "border-border-glow bg-background-deep/40 hover:border-primary/40",
                )}
                aria-label={`Клетка ${i + 1}`}
              />
            );
          })}
        </div>
      )}

      {phase === "recall" && (
        <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={submitRecall}
            className="btn-primary px-7 py-3"
          >
            {roundIdx >= 4 ? "Завершить" : "Дальше"}
            <ArrowRightIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setSelected(new Set())}
            className="btn-ghost px-7 py-3"
          >
            Очистить
          </button>
        </div>
      )}

      {phase === "memorize" && (
        <div className="mt-7 text-center text-sm text-text-secondary">
          Подсветка исчезнет через{" "}
          <span className="text-primary font-medium">
            {Math.max(0, Math.round(memorizeMs / 100) / 10)} с
          </span>
        </div>
      )}

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={() => router.push("/training")}
          className="text-xs text-text-secondary hover:text-text-primary transition-colors"
        >
          Выйти в список тренировок
        </button>
      </div>
    </GlowCard>
  );
}
