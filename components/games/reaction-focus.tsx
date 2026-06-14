"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { GameIntro } from "@/components/games/game-intro";
import { GameResultView } from "@/components/games/game-result";
import { getGameById } from "@/lib/games";
import { calculateReactionScore } from "@/lib/scoring";
import { addGameResult } from "@/lib/storage";
import { uniqueId, randomInt } from "@/lib/utils";
import { achievements as allAchievements } from "@/lib/achievements";
import { GlowCard } from "@/components/ui/glow-card";
import { cn } from "@/lib/utils";

type Phase = "intro" | "play" | "result";
type Visual = "idle" | "waiting" | "go" | "nogo";
type Trial = {
  rt: number | null;
  hit: boolean;
  early: boolean;
  wrong: boolean;
};

const TRIALS = 10;
const NO_GO_PROB = 0.3;
const MIN_DELAY = 900;
const MAX_DELAY = 2200;

export function ReactionFocusGame() {
  const router = useRouter();
  const game = getGameById("reaction-focus")!;
  const [phase, setPhase] = useState<Phase>("intro");
  const [visual, setVisual] = useState<Visual>("idle");
  const [trialIdx, setTrialIdx] = useState(0);
  const [trials, setTrials] = useState<Trial[]>([]);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [newAchievements, setNewAchievements] = useState<
    { id: string; title: string; description: string }[]
  >([]);

  const visualRef = useRef<Visual>(visual);
  visualRef.current = visual;
  const goStartRef = useRef<number | null>(null);
  const showTimerRef = useRef<number | null>(null);
  const nextTimerRef = useRef<number | null>(null);

  function clearTimers() {
    if (showTimerRef.current) window.clearTimeout(showTimerRef.current);
    if (nextTimerRef.current) window.clearTimeout(nextTimerRef.current);
    showTimerRef.current = null;
    nextTimerRef.current = null;
  }

  useEffect(() => {
    return () => clearTimers();
  }, []);

  function startGame() {
    clearTimers();
    setPhase("play");
    setTrials([]);
    setScore(0);
    setNewAchievements([]);
    setStartTime(Date.now());
    runTrial(0, []);
  }

  function runTrial(i: number, snapshot: Trial[]) {
    setTrialIdx(i);
    setVisual("waiting");
    goStartRef.current = null;
    const isNoGo = Math.random() < NO_GO_PROB;
    const delay = randomInt(MIN_DELAY, MAX_DELAY);
    showTimerRef.current = window.setTimeout(() => {
      if (visualRef.current !== "waiting") return;
      if (isNoGo) {
        setVisual("nogo");
        goStartRef.current = null;
      } else {
        setVisual("go");
        goStartRef.current = performance.now();
      }
      // Если пользователь не нажмёт в течение 1.5 с, засчитываем пропуск
      nextTimerRef.current = window.setTimeout(() => {
        if (visualRef.current === "go") {
          // не нажал на go — пропуск (ничего)
          commit({ rt: null, hit: false, early: false, wrong: false }, snapshot);
        } else if (visualRef.current === "nogo") {
          // не нажал на nogo — корректное торможение
          commit({ rt: null, hit: false, early: false, wrong: false }, snapshot);
        }
      }, 1500);
    }, delay);
  }

  function commit(t: Trial, snapshot: Trial[]) {
    const next = [...snapshot, t];
    setTrials(next);
    if (next.length >= TRIALS) {
      clearTimers();
      finalize(next);
    } else {
      clearTimers();
      nextTimerRef.current = window.setTimeout(() => {
        runTrial(next.length, next);
      }, 700);
    }
  }

  function handleAction() {
    if (phase !== "play") return;
    const v = visualRef.current;
    if (v === "waiting") {
      clearTimers();
      commit({ rt: null, hit: false, early: true, wrong: false }, trials);
      return;
    }
    if (v === "go") {
      clearTimers();
      const rt = goStartRef.current
        ? performance.now() - goStartRef.current
        : null;
      commit({ rt, hit: true, early: false, wrong: false }, trials);
      return;
    }
    if (v === "nogo") {
      clearTimers();
      commit({ rt: null, hit: false, early: false, wrong: true }, trials);
      return;
    }
  }

  function finalize(finalTrials: Trial[]) {
    const hits = finalTrials.filter((t) => t.hit).length;
    const falseStarts = finalTrials.filter((t) => t.early).length;
    const wrongTaps = finalTrials.filter((t) => t.wrong).length;
    const rts = finalTrials
      .filter((t) => t.hit && t.rt !== null)
      .map((t) => t.rt as number);
    const meanRT = rts.length
      ? rts.reduce((a, b) => a + b, 0) / rts.length
      : 0;
    const finalScore = calculateReactionScore({
      correctHits: hits,
      falseStarts,
      wrongTaps,
      meanReactionMs: meanRT,
    });
    setScore(finalScore);
    const result = addGameResult({
      id: uniqueId("res"),
      gameId: "reaction-focus",
      gameTitle: game.title,
      score: finalScore,
      mistakes: falseStarts + wrongTaps,
      reactionTimeMs: meanRT,
      durationMs: Date.now() - startTime,
      completedAt: new Date().toISOString(),
    });
    setNewAchievements(
      allAchievements
        .filter((a) => result.unlockedAchievements.includes(a.id))
        .map((a) => ({ id: a.id, title: a.title, description: a.description })),
    );
    setVisual("idle");
    setPhase("result");
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.code === "Space" || e.key === "Enter") {
        e.preventDefault();
        handleAction();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, trials]);

  if (phase === "intro") {
    return <GameIntro game={game} onStart={startGame} />;
  }

  if (phase === "result") {
    const rts = trials
      .filter((t) => t.hit && t.rt !== null)
      .map((t) => t.rt as number);
    const meanRT = rts.length
      ? Math.round(rts.reduce((a, b) => a + b, 0) / rts.length)
      : 0;
    const hits = trials.filter((t) => t.hit).length;
    return (
      <GameResultView
        title={
          meanRT > 0 && meanRT < 350
            ? "Быстрая реакция!"
            : "Тренировка завершена"
        }
        subtitle="Go/No-Go: скорость плюс тормозной контроль."
        score={score}
        stats={[
          { label: "Попаданий", value: `${hits}/${TRIALS}` },
          { label: "Среднее RT", value: meanRT ? `${meanRT} мс` : "—" },
          {
            label: "Фальстартов",
            value: trials.filter((t) => t.early).length,
          },
          {
            label: "Ошибок No-Go",
            value: trials.filter((t) => t.wrong).length,
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
    <GlowCard className="p-6 sm:p-10" hover={false} strong>
      <div className="mb-4 flex items-center justify-between text-sm">
        <span className="text-text-secondary">
          Попытка {Math.min(trialIdx + 1, TRIALS)} / {TRIALS}
        </span>
        <span className="text-text-secondary">
          Попаданий:{" "}
          <span className="text-mint font-semibold">
            {trials.filter((t) => t.hit).length}
          </span>
        </span>
      </div>
      <button
        type="button"
        onClick={handleAction}
        className={cn(
          "relative w-full rounded-2xl border-2 transition-all duration-200 select-none",
          "h-[360px] sm:h-[420px] flex items-center justify-center",
          visual === "waiting" &&
            "border-border-glow bg-background-deep/40 cursor-wait",
          visual === "go" &&
            "border-mint bg-gradient-to-br from-mint/30 to-emerald-500/20 shadow-glow animate-pulse-glow",
          visual === "nogo" &&
            "border-rose-400 bg-gradient-to-br from-rose-500/30 to-orange-500/20",
          visual === "idle" && "border-border-glow bg-background-deep/40",
        )}
      >
        <span className="text-center px-6">
          {visual === "waiting" && (
            <span className="text-text-secondary text-lg">
              Ждите сигнала…
              <br />
              <span className="text-xs text-text-secondary/70">
                Нажимайте{" "}
                <kbd className="px-1.5 py-0.5 rounded border border-border-glow">
                  Space
                </kbd>{" "}
                только на зелёный
              </span>
            </span>
          )}
          {visual === "go" && (
            <span className="text-5xl sm:text-6xl font-bold text-mint drop-shadow-[0_0_30px_rgba(52,211,153,0.5)]">
              ЖМИ
            </span>
          )}
          {visual === "nogo" && (
            <span className="text-4xl sm:text-5xl font-bold text-rose-300 drop-shadow-[0_0_30px_rgba(244,114,182,0.5)]">
              СТОП
            </span>
          )}
          {visual === "idle" && (
            <span className="text-text-secondary">Готов</span>
          )}
        </span>
      </button>
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
