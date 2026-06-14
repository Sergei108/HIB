"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GameIntro } from "@/components/games/game-intro";
import { GameResultView } from "@/components/games/game-result";
import { getGameById } from "@/lib/games";
import { calculateCreativeScore } from "@/lib/scoring";
import { addCreativeEntry, addGameResult } from "@/lib/storage";
import { uniqueId, shuffle, randomInt } from "@/lib/utils";
import { achievements as allAchievements } from "@/lib/achievements";
import { creativeWords } from "@/lib/creative-words";
import { GlowCard } from "@/components/ui/glow-card";
import { ArrowRightIcon, SparklesIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

function generateWords(): string[] {
  return shuffle(creativeWords).slice(0, 3);
}

export function CreativeAssociationGame() {
  const router = useRouter();
  const game = getGameById("creative-association")!;
  const [phase, setPhase] = useState<"intro" | "write" | "result">("intro");
  const [words, setWords] = useState<string[]>([]);
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [newAchievements, setNewAchievements] = useState<
    { id: string; title: string; description: string }[]
  >([]);
  const [lastEntry, setLastEntry] = useState<{
    words: string[];
    answer: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  function startGame() {
    setPhase("write");
    setWords(generateWords());
    setAnswer("");
    setError(null);
  }

  function reshuffle() {
    let next = generateWords();
    let guard = 0;
    while (next.join() === words.join() && guard < 5) {
      next = generateWords();
      guard += 1;
    }
    setWords(next);
    setError(null);
  }

  function submit() {
    if (answer.trim().length === 0) {
      setError("Напишите хотя бы пару слов — это творческое задание, оценки строгости нет.");
      return;
    }
    const usedAll = words.every((w) =>
      answer.toLowerCase().includes(w.toLowerCase()),
    );
    const finalScore = calculateCreativeScore({
      usedAllWords: usedAll,
      answerLength: answer.length,
    });
    setScore(finalScore);

    const entry = {
      id: uniqueId("cr"),
      words,
      answer: answer.trim(),
      createdAt: new Date().toISOString(),
    };
    setLastEntry({ words: entry.words, answer: entry.answer });

    const afterEntry = addCreativeEntry(entry);
    const result = addGameResult({
      id: uniqueId("res"),
      gameId: "creative-association",
      gameTitle: game.title,
      score: finalScore,
      correctAnswers: 1,
      totalQuestions: 1,
      durationMs: randomInt(30_000, 240_000),
      completedAt: new Date().toISOString(),
    });
    // совмещаем unlocked из обеих операций
    const merged = Array.from(
      new Set([...afterEntry.unlockedAchievements, ...result.unlockedAchievements]),
    );
    setNewAchievements(
      allAchievements
        .filter((a) => merged.includes(a.id))
        .filter((a) =>
          ["creative-spark", "association-builder", "first-boost"].includes(a.id),
        )
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
        title="Сохранено в дневник"
        subtitle="Связь найдена. Креативность — это мышца, которая растёт от практики."
        score={score}
        stats={[
          {
            label: "Использовано слов",
            value:
              lastEntry && lastEntry.words.every((w) =>
                lastEntry.answer.toLowerCase().includes(w.toLowerCase()),
              )
                ? `3 / 3`
                : "частично",
          },
          {
            label: "Длина ответа",
            value: `${lastEntry?.answer.length ?? 0} симв.`,
          },
        ]}
        newAchievements={newAchievements}
        primaryAction={{ label: "Ещё раз", onClick: startGame }}
        secondaryAction={{ label: "Шкала прогресса", href: "/dashboard" }}
        tertiaryAction={{ label: "Выбрать тренировку", href: "/training" }}
      >
        {lastEntry && (
          <div className="mt-7 text-left rounded-xl border border-primary/25 bg-background-deep/40 p-5">
            <p className="text-[10px] uppercase tracking-[0.18em] text-text-secondary mb-2">
              Ваш ответ
            </p>
            <div className="mb-3 flex flex-wrap gap-2">
              {lastEntry.words.map((w) => (
                <span
                  key={w}
                  className="rounded-md border border-border-glow bg-primary/5 px-2.5 py-1 text-sm text-text-mint"
                >
                  {w}
                </span>
              ))}
            </div>
            <p className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap">
              {lastEntry.answer}
            </p>
          </div>
        )}
      </GameResultView>
    );
  }

  return (
    <GlowCard className="p-6 sm:p-10" hover={false} strong>
      <div className="text-center mb-6">
        <p className="text-[11px] uppercase tracking-[0.18em] text-text-secondary mb-3">
          Три случайных слова
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {words.map((w, i) => (
            <span
              key={`${w}-${i}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-gradient-to-br from-primary/15 to-mint/10 px-4 py-2 text-lg sm:text-xl font-semibold text-text-primary shadow-glow-sm"
            >
              <SparklesIcon className="h-4 w-4 text-mint" />
              {w}
            </span>
          ))}
        </div>
        <button
          type="button"
          onClick={reshuffle}
          className="mt-4 text-xs text-text-secondary hover:text-primary transition-colors"
        >
          Перемешать слова
        </button>
      </div>

      <div className="rounded-xl border border-border-glow bg-background-deep/40 p-4">
        <label
          htmlFor="creative-answer"
          className="block text-sm font-medium text-text-primary mb-2"
        >
          Придумайте связь, историю или метафору
        </label>
        <textarea
          id="creative-answer"
          value={answer}
          onChange={(e) => {
            setAnswer(e.target.value);
            if (error) setError(null);
          }}
          placeholder="Например: «лабиринт — это зеркало времени, в котором нейрон находит эхо каждого шага»…"
          rows={8}
          className={cn(
            "w-full resize-y rounded-lg border border-border-glow bg-background-mid/60 px-4 py-3 text-sm leading-relaxed text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30",
          )}
        />
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="text-text-secondary">
            {answer.length} символов
          </span>
          {answer.length > 100 && (
            <span className="text-mint">+ 20 очков за развёрнутый ответ</span>
          )}
          {answer.length > 250 && (
            <span className="text-primary">+ 20 очков за глубокое рассуждение</span>
          )}
        </div>
        {error && (
          <p className="mt-2 text-xs text-rose-300">{error}</p>
        )}
      </div>

      <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button type="button" onClick={submit} className="btn-primary px-7 py-3">
          Завершить
          <ArrowRightIcon className="h-4 w-4" />
        </button>
        <button type="button" onClick={reshuffle} className="btn-ghost px-7 py-3">
          Другие слова
        </button>
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
