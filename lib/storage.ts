import { STORAGE, calculateLevel } from "./levels";
import type { CreativeEntry, GameResult, UserProgress } from "./types";
import { checkAchievements } from "./achievements";

export function getDefaultProgress(): UserProgress {
  return {
    totalScore: 0,
    completedSessions: 0,
    currentStreak: 0,
    level: 1,
    lastTrainingDate: null,
    results: [],
    creativeEntries: [],
    unlockedAchievements: [],
  };
}

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getProgress(): UserProgress {
  if (!isBrowser()) return getDefaultProgress();
  try {
    const raw = window.localStorage.getItem(STORAGE);
    if (!raw) return getDefaultProgress();
    const parsed = JSON.parse(raw) as Partial<UserProgress>;
    return {
      ...getDefaultProgress(),
      ...parsed,
      results: Array.isArray(parsed.results) ? parsed.results : [],
      creativeEntries: Array.isArray(parsed.creativeEntries)
        ? parsed.creativeEntries
        : [],
      unlockedAchievements: Array.isArray(parsed.unlockedAchievements)
        ? parsed.unlockedAchievements
        : [],
    };
  } catch {
    return getDefaultProgress();
  }
}

export function saveProgress(progress: UserProgress): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(STORAGE, JSON.stringify(progress));
  } catch {
    // localStorage quota or disabled — silently ignore
  }
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function dayDiff(a: Date, b: Date): number {
  const ms = 24 * 60 * 60 * 1000;
  const aMid = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const bMid = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((aMid - bMid) / ms);
}

function updateStreak(
  prevStreak: number,
  lastDate: string | null,
  now: Date,
): number {
  if (!lastDate) return 1;
  const last = new Date(lastDate);
  if (isSameDay(last, now)) return Math.max(1, prevStreak);
  const diff = dayDiff(now, last);
  if (diff === 1) return prevStreak + 1;
  return 1;
}

export function addGameResult(result: GameResult): UserProgress {
  const prev = getProgress();
  const now = new Date();
  const next: UserProgress = {
    ...prev,
    totalScore: prev.totalScore + result.score,
    completedSessions: prev.completedSessions + 1,
    currentStreak: updateStreak(
      prev.currentStreak,
      prev.lastTrainingDate,
      now,
    ),
    lastTrainingDate: now.toISOString(),
    results: [result, ...prev.results].slice(0, 200),
  };
  next.level = calculateLevel(next.totalScore);
  next.unlockedAchievements = checkAchievements(
    next.results,
    next.creativeEntries,
    next.totalScore,
    next.completedSessions,
  );
  saveProgress(next);
  return next;
}

export function addCreativeEntry(entry: CreativeEntry): UserProgress {
  const prev = getProgress();
  const next: UserProgress = {
    ...prev,
    creativeEntries: [entry, ...prev.creativeEntries].slice(0, 100),
  };
  saveProgress(next);
  return next;
}

export function resetProgress(): UserProgress {
  const fresh = getDefaultProgress();
  saveProgress(fresh);
  return fresh;
}

export function getBestResults(): GameResult[] {
  const progress = getProgress();
  const byGame = new Map<string, GameResult>();
  for (const r of progress.results) {
    const existing = byGame.get(r.gameId);
    if (!existing || r.score > existing.score) {
      byGame.set(r.gameId, r);
    }
  }
  return Array.from(byGame.values()).sort((a, b) => b.score - a.score);
}

export function getRecentResults(limit = 5): GameResult[] {
  return getProgress().results.slice(0, limit);
}

export function getRecentCreativeEntries(limit = 3): CreativeEntry[] {
  return getProgress().creativeEntries.slice(0, limit);
}
