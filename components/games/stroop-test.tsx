"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { GameIntro } from "@/components/games/game-intro";
import { GameResultView } from "@/components/games/game-result";
import { getGameById } from "@/lib/games";
import { calculateStroopScore } from "@/lib/scoring";
import { addGameResult } from "@/lib/storage";
import { uniqueId, randomChoice, shuffle } from "@/lib/utils";
import { achievements as allAchievements } from "@/lib/achievements";
import { GlowCard } from "@/components/ui/glow-card";
import type { StroopColor, StroopQuestion } from "@/lib/types";
import { cn } from "@/lib/utils";

const COLORS: { id: StroopColor; label: string; className: string }[] = [
  { id: "red", label: "Красный", className: "text-rose-400" },
  { id: "blue", label: "Синий", className: "text-sky-400" },
  { id: "green", label: "Зелёный", className: "text-emerald-400" },
  { id: "yellow", label: "Жёлтый", className: "text-amber-300" },
  { id: "purple", label: "Фиолетовый", className: "text-fuchsia-400" },
  { id: "orange", label: "Оранжевый", className: "text-orange-400" },
];

const TOTAL = 20;

function buildQuestion(): StroopQuestion {
  const word = randomChoice(COLORS).id;
  const textColor = randomChoice(COLORS).id;
  const correct = textColor;
  const options = shuffle(COLORS.map((c) => c.id));
  return { word, textColor, correct, options };
}

function colorClass(id: StroopColor): string {
  return COLORS.find((c) => c.id === id)?.className ?? "text-text-primary";
}

function colorLabel(id: StroopColor): string {
  return COLORS.find((c) => c.id === id)?.label ?? id;
}

export function StroopTestGame() {
  const router = useRouter();
  const game = useMemo(() => getGameById("stroop-test")!, []);
  const [phase, setPhase] = useState<"intro" | "play" | "result">("intro");
  const [q, setQ] = useState<StroopQuestion>(() => buildQuestion());
  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [times, setTimes] = useState<number[]>([]);
  const [qStart, setQStart] = useState(0);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [newAchievements, setNewAchievements] = useState<
    { id: string; title: string; description: string }[]
  >([]);
  const [feedback, setFeedback] = useState<"ok" | "fail" | null>(null);

  function startGame() {
    setPhase("play");
    setIdx(0);
    setCorrect(0);
    setWrong(0);
    setTimes([]);
    setScore(0);
    setNewAchievements([]);
    setStartTime(Date.now());
    nextQ();
  }

  function nextQ() {
    setQ(buildQuestion());
    setQStart(performance.now());
    setFeedback(null);
  }

  function answer(color: StroopColor) {
    if (feedback) return;
    const elapsed = performance.now() - qStart;
    const isOk = color === q.correct;
    setTimes((arr) => [...arr, elapsed]);
    if (isOk) setCorrect((c) => c + 1);
    else setWrong((w) => w + 1);
    setFeedback(isOk ? "ok" : "fail");
    setTimeout(() => {
      if (idx + 1 >= TOTAL) {
        finalize(isOk ? correct + 1 : correct, isOk ? wrong : wrong + 1);
      } else {
        setIdx((i) => i + 1);
        nextQ();
      }
    }, 350);
  }

  function finalize(finalCorrect: number, finalWrong: number) {
    const avg = times.length
      ? times.reduce((a, b) => a + b, 0) / times.length
      : 0;
    const finalScore = calculateStroopScore({
      correct: finalCorrect,
      wrong: finalWrong,
      total: TOTAL,
      averageTimeMs: avg,
    });
    setScore(finalScore);
    const result = addGameResult({
      id: uniqueId("res"),
      gameId: "stroop-test",
      gameTitle: game.title,
      score: finalScore,
      accuracy: TOTAL ? (finalCorrect / TOTAL) * 100 : 0,
      mistakes: finalWrong,
      correctAnswers: finalCorrect,
      totalQuestions: TOTAL,
      durationMs: Date.now() - startTime,
      completedAt: new Date().toISOString(),
    });
    setNewAchievements(
      allAchievements
        .filter((a) => result.unlockedAchievements.includes(a.id))
        .map((a) => ({ id: a.id, title: a.title, description: a.description })),
    );
    setPhase("result");
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (phase !== "play" || feedback) return;
      const map: Record<string, StroopColor> = {
        "1": "red",
        "2": "blue",
        "3": "green",
        "4": "yellow",
        "5": "purple",
        "6": "orange",
      };
      const key = e.key.toLowerCase();
      if (map[key]) answer(map[key]);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, feedback, idx, q]);

  if (phase === "intro") {
    return <GameIntro game={game} onStart={startGame} />;
  }

  if (phase === "result") {
    const accuracy = TOTAL ? (correct / TOTAL) * 100 : 0;
    const avg = times.length
      ? Math.round(times.reduce((a, b) => a + b, 0) / times.length)
      : 0;
    return (
      <GameResultView
        title={wrong === 0 ? "Идеально! Режим фокуса открыт" : "Тренировка завершена"}
        subtitle={
          wrong === 0
            ? "Ноль ошибок в эффекте Струпа — это серьёзный когнитивный контроль."
            : "Когнитивный контроль получил свою нагрузку."
        }
        score={score}
        stats={[
          { label: "Правильно", value: `${correct}/${TOTAL}` },
          { label: "Ошибок", value: wrong },
          { label: "Точность", value: `${accuracy.toFixed(0)}%` },
          { label: "Среднее время", value: `${avg} мс` },
        ]}
        newAchievements={newAchievements}
        primaryAction={{ label: "Повторить", onClick: startGame }}
        secondaryAction={{ label: "Шкала прогресса", href: "/dashboard" }}
        tertiaryAction={{ label: "Выбрать тренировку", href: "/training" }}
      />
    );
  }

  const progress = ((idx + 1) / TOTAL) * 100;

  return (
    <GlowCard className="p-6 sm:p-10" hover={false} strong>
      <div className="mb-6 flex items-center justify-between text-sm">
        <span className="text-text-secondary">
          Вопрос {idx + 1} / {TOTAL}
        </span>
        <span className="text-text-secondary">
          Верно: <span className="text-mint font-semibold">{correct}</span> · Ошибок:{" "}
          <span className="text-rose-300 font-semibold">{wrong}</span>
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-background-deep/60 overflow-hidden mb-8">
        <div
          className="h-full bg-gradient-to-r from-primary to-mint transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="text-center">
        <p className="text-[11px] uppercase tracking-[0.18em] text-text-secondary mb-3">
          Назовите цвет текста
        </p>
        <div
          className={cn(
            "text-6xl sm:text-7xl font-bold tracking-tight py-10 transition-all",
            colorClass(q.textColor),
            feedback === "ok" && "text-mint drop-shadow-[0_0_20px_rgba(52,211,153,0.5)]",
            feedback === "fail" && "text-rose-300 drop-shadow-[0_0_20px_rgba(244,114,182,0.5)]",
          )}
        >
          {colorLabel(q.word)}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {q.options.map((opt, i) => {
          const c = COLORS.find((x) => x.id === opt)!;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => answer(opt)}
              className={cn(
                "group relative rounded-xl border border-border-glow bg-background-deep/40 px-4 py-3 text-left transition-all hover:border-primary/50 hover:bg-background-deep/70",
                feedback && opt === q.correct && "border-mint/60 shadow-glow-mint",
                feedback === "fail" && opt !== q.correct && "opacity-60",
              )}
            >
              <span className="text-[10px] uppercase tracking-[0.18em] text-text-secondary">
                {i + 1}
              </span>
              <span className={cn("mt-1 block text-base font-medium", c.className)}>
                {c.label}
              </span>
            </button>
          );
        })}
      </div>

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
