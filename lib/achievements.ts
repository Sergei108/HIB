import type { Achievement, CreativeEntry, GameResult, UserProgress } from "./types";
import { calculateLevel } from "./levels";

export const achievements: Achievement[] = [
  {
    id: "first-boost",
    title: "Первый импульс",
    description: "Завершите первую тренировку — HIB начнёт отслеживать ваш прогресс.",
    condition: "Завершить первую тренировку",
    icon: "spark",
    category: "session",
  },
  {
    id: "memory-starter",
    title: "Старт памяти",
    description: "Пройдите Memory Grid и прокачайте зрительную рабочую память.",
    condition: "Пройти Memory Grid",
    icon: "grid",
    category: "skill",
  },
  {
    id: "focus-mode",
    title: "Режим фокуса",
    description: "Пройдите Stroop Test без единой ошибки. Чистый когнитивный контроль.",
    condition: "Пройти Stroop Test без ошибок",
    icon: "target",
    category: "skill",
  },
  {
    id: "logic-explorer",
    title: "Исследователь логики",
    description: "Решите 5 логических задач подряд — покажите индуктивное мышление.",
    condition: "Решить 5 логических задач",
    icon: "logic",
    category: "skill",
  },
  {
    id: "fast-reaction",
    title: "Быстрая реакция",
    description: "Покажите реакцию быстрее 350 мс в Reaction Focus.",
    condition: "Средняя реакция < 350 мс",
    icon: "bolt",
    category: "skill",
  },
  {
    id: "consistent-mind",
    title: "Последовательный разум",
    description: "Пройдите 3 тренировки. Постоянство важнее разовых пиков.",
    condition: "Пройти 3 тренировки",
    icon: "stack",
    category: "session",
  },
  {
    id: "hib-beginner",
    title: "Начинающий HIB",
    description: "Наберите общий уровень 2. Добро пожаловать в клуб.",
    condition: "Достичь уровня 2",
    icon: "badge",
    category: "level",
  },
  {
    id: "creative-spark",
    title: "Искра креативности",
    description: "Пройдите Creative Association — соедините невозможное.",
    condition: "Пройти Creative Association",
    icon: "sparkles",
    category: "creativity",
  },
  {
    id: "association-builder",
    title: "Мастер ассоциаций",
    description: "Напишите творческий ответ длиннее 250 символов. Глубина мысли.",
    condition: "Творческий ответ ≥ 250 символов",
    icon: "feather",
    category: "creativity",
  },
];

export function getAchievementById(id: string): Achievement | undefined {
  return achievements.find((a) => a.id === id);
}

function hasResultWith(
  results: GameResult[],
  predicate: (r: GameResult) => boolean,
): boolean {
  return results.some(predicate);
}

function hasLongCreativeEntry(entries: CreativeEntry[]): boolean {
  return entries.some((e) => e.answer.length >= 250);
}

export function checkAchievements(
  results: GameResult[],
  creativeEntries: CreativeEntry[],
  totalScore: number,
  completedSessions: number,
): string[] {
  const unlocked = new Set<string>();

  if (completedSessions >= 1) unlocked.add("first-boost");
  if (completedSessions >= 3) unlocked.add("consistent-mind");

  if (
    hasResultWith(results, (r) => r.gameId === "memory-grid")
  ) {
    unlocked.add("memory-starter");
  }

  if (
    hasResultWith(
      results,
      (r) => r.gameId === "stroop-test" && (r.mistakes ?? 0) === 0,
    )
  ) {
    unlocked.add("focus-mode");
  }

  if (
    hasResultWith(
      results,
      (r) => r.gameId === "logic-sequences" && (r.correctAnswers ?? 0) >= 5,
    )
  ) {
    unlocked.add("logic-explorer");
  }

  if (
    hasResultWith(
      results,
      (r) =>
        r.gameId === "reaction-focus" &&
        (r.reactionTimeMs ?? Infinity) < 350,
    )
  ) {
    unlocked.add("fast-reaction");
  }

  if (
    hasResultWith(results, (r) => r.gameId === "creative-association") ||
    creativeEntries.length > 0
  ) {
    unlocked.add("creative-spark");
  }

  if (hasLongCreativeEntry(creativeEntries)) {
    unlocked.add("association-builder");
  }

  if (calculateLevel(totalScore) >= 2) {
    unlocked.add("hib-beginner");
  }

  return Array.from(unlocked);
}

export function isAchievementUnlocked(
  progress: UserProgress,
  achievementId: string,
): boolean {
  return progress.unlockedAchievements.includes(achievementId);
}
