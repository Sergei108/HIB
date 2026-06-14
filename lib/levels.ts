const STORAGE_KEY = "hib-user-progress";

export function calculateLevel(totalScore: number): number {
  if (totalScore < 200) return 1;
  if (totalScore < 500) return 2;
  if (totalScore < 900) return 3;
  if (totalScore < 1400) return 4;
  return 5;
}

export function levelRange(level: number): { min: number; max: number | null } {
  switch (level) {
    case 1:
      return { min: 0, max: 199 };
    case 2:
      return { min: 200, max: 499 };
    case 3:
      return { min: 500, max: 899 };
    case 4:
      return { min: 900, max: 1399 };
    case 5:
      return { min: 1400, max: null };
    default:
      return { min: 0, max: 199 };
  }
}

export function levelTitle(level: number): string {
  switch (level) {
    case 1:
      return "Новичок";
    case 2:
      return "Исследователь";
    case 3:
      return "Практик";
    case 4:
      return "Мастер";
    case 5:
      return "Архитектор разума";
    default:
      return "Новичок";
  }
}

export const STORAGE = STORAGE_KEY;
