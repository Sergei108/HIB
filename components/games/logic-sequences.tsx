"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { GameIntro } from "@/components/games/game-intro";
import { GameResultView } from "@/components/games/game-result";
import { getGameById } from "@/lib/games";
import { calculateLogicScore } from "@/lib/scoring";
import { addGameResult } from "@/lib/storage";
import { uniqueId, shuffle } from "@/lib/utils";
import { achievements as allAchievements } from "@/lib/achievements";
import { logicQuestions } from "@/lib/logic-questions";
import { GlowCard } from "@/components/ui/glow-card";
import { ArrowRightIcon, CheckIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

export function LogicSequencesGame() {
  const router = useRouter();
  const game = useMemo(() => getGameById("logic-sequences")!, []);
  const questions = useMemo(() => shuffle(logicQuestions).slice(0, 10), []);

  const [phase, setPhase] = useState<"intro" | "play" | "result">("intro");
  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [showExplain, setShowExplain] = useState(false);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [newAchievements, setNewAchievements] = useState<
    { id: string; title: string; description: string }[]
  >([]);

  function startGame() {
    setPhase("play");
    setIdx(0);
    setCorrect(0);
    setScore(0);
    setNewAchievements([]);
    setStartTime(Date.now());
    setPicked(null);
    setShowExplain(false);
  }

  function pick(option: string) {
    if (showExplain) return;
    setPicked(option);
    setShowExplain(true);
    if (option === questions[idx].answer) {
      setCorrect((c) => c + 1);
    }
  }

  function next() {
    if (idx + 1 >= questions.length) {
      finalize();
    } else {
      setIdx((i) => i + 1);
      setPicked(null);
      setShowExplain(false);
    }
  }

  function finalize() {
    const finalCorrect = correct;
    const finalScore = calculateLogicScore({
      correct: finalCorrect,
      total: questions.length,
    });
    setScore(finalScore);
    const result = addGameResult({
      id: uniqueId("res"),
      gameId: "logic-sequences",
      gameTitle: game.title,
      score: finalScore,
      correctAnswers: finalCorrect,
      totalQuestions: questions.length,
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

  if (phase === "intro") {
    return <GameIntro game={game} onStart={startGame} />;
  }

  if (phase === "result") {
    return (
      <GameResultView
        title={
          correct >= 5
            ? "Исследователь логики!"
            : "Тренировка завершена"
        }
        subtitle="Индуктивное мышление — это навык, который тренируется."
        score={score}
        stats={[
          { label: "Правильно", value: `${correct}/${questions.length}` },
          {
            label: "Точность",
            value: `${Math.round((correct / questions.length) * 100)}%`,
          },
          { label: "Вопросов", value: questions.length },
        ]}
        newAchievements={newAchievements}
        primaryAction={{ label: "Повторить", onClick: startGame }}
        secondaryAction={{ label: "Шкала прогресса", href: "/dashboard" }}
        tertiaryAction={{ label: "Выбрать тренировку", href: "/training" }}
      />
    );
  }

  const q = questions[idx];
  const progress = ((idx + 1) / questions.length) * 100;

  return (
    <GlowCard className="p-6 sm:p-10" hover={false} strong>
      <div className="mb-6 flex items-center justify-between text-sm">
        <span className="text-text-secondary">
          Вопрос {idx + 1} / {questions.length}
        </span>
        <span className="text-text-secondary">
          Правильно:{" "}
          <span className="text-mint font-semibold">{correct}</span>
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
          Продолжите последовательность
        </p>
        <div className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight font-mono">
          {q.sequence}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3">
        {q.options.map((opt) => {
          const isCorrect = opt === q.answer;
          const isPicked = picked === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => pick(opt)}
              disabled={showExplain}
              className={cn(
                "rounded-xl border px-4 py-3.5 text-left text-lg font-mono transition-all",
                !showExplain &&
                  "border-border-glow bg-background-deep/40 hover:border-primary/50 hover:bg-background-deep/70",
                showExplain && isCorrect &&
                  "border-mint bg-gradient-to-br from-mint/25 to-primary/10 shadow-glow-mint",
                showExplain && isPicked && !isCorrect &&
                  "border-rose-400/60 bg-rose-500/10",
                showExplain && !isPicked && !isCorrect && "opacity-60",
              )}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {showExplain && (
        <div className="mt-6 rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 to-mint/5 p-4">
          <p className="text-sm font-semibold text-text-primary inline-flex items-center gap-2">
            <CheckIcon className="h-4 w-4 text-mint" />
            Объяснение
          </p>
          <p className="mt-1.5 text-sm text-text-secondary leading-relaxed">
            {q.explanation}
          </p>
        </div>
      )}

      {showExplain && (
        <div className="mt-7 flex justify-center">
          <button type="button" onClick={next} className="btn-primary px-7 py-3">
            {idx + 1 >= questions.length ? "Завершить" : "Следующий"}
            <ArrowRightIcon className="h-4 w-4" />
          </button>
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
