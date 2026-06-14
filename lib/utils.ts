type ClassValue =
  | string
  | number
  | null
  | false
  | undefined
  | ClassValue[];

function flatten(values: ClassValue[], out: (string | number)[]): void {
  for (const v of values) {
    if (!v) continue;
    if (Array.isArray(v)) flatten(v, out);
    else if (typeof v === "string" || typeof v === "number") out.push(v);
  }
}

export function cn(...inputs: ClassValue[]): string {
  const out: (string | number)[] = [];
  flatten(inputs, out);
  return out.join(" ");
}

export function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("ru-RU", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export function formatDuration(ms?: number): string {
  if (!ms || ms < 0) return "—";
  if (ms < 1000) return `${ms} мс`;
  const s = ms / 1000;
  if (s < 60) return `${s.toFixed(1)} с`;
  const m = Math.floor(s / 60);
  const rest = Math.floor(s % 60);
  return `${m} мин ${rest} с`;
}

export function formatReactionTime(ms?: number): string {
  if (!ms) return "—";
  return `${Math.round(ms)} мс`;
}

export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomChoice<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function uniqueId(prefix = "id"): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}
