export function calculateMemoryScore(params: {
  correctCells: number;
  wrongCells: number;
  rounds: number;
  perfectRounds: number;
}): number {
  const base = params.correctCells * 10 - params.wrongCells * 5;
  const bonus = params.perfectRounds * 15;
  return Math.max(0, base + bonus);
}

export function calculateStroopScore(params: {
  correct: number;
  wrong: number;
  total: number;
  averageTimeMs: number;
}): number {
  const base = params.correct * 10 - params.wrong * 5;
  let speedBonus = 0;
  if (params.averageTimeMs > 0) {
    if (params.averageTimeMs < 1500) speedBonus = 30;
    else if (params.averageTimeMs < 2000) speedBonus = 20;
    else if (params.averageTimeMs < 2500) speedBonus = 10;
  }
  return Math.max(0, base + speedBonus);
}

export function calculateReactionScore(params: {
  correctHits: number;
  falseStarts: number;
  wrongTaps: number;
  meanReactionMs: number;
}): number {
  let score = 0;
  score += params.correctHits * 10;

  if (params.meanReactionMs > 0 && params.meanReactionMs < 350) {
    score += 50;
  } else if (params.meanReactionMs > 0 && params.meanReactionMs < 450) {
    score += 30;
  } else if (params.meanReactionMs > 0 && params.meanReactionMs < 600) {
    score += 15;
  }

  score -= params.wrongTaps * 10;
  score -= params.falseStarts * 15;

  return Math.max(0, score);
}

export function calculateLogicScore(params: {
  correct: number;
  total: number;
}): number {
  const base = params.correct * 10;
  let bonus = 0;
  if (params.correct >= 5) bonus += 25;
  if (params.correct >= 8) bonus += 35;
  return Math.max(0, base + bonus);
}

export function calculateCreativeScore(params: {
  usedAllWords: boolean;
  answerLength: number;
}): number {
  let score = 30;
  if (params.answerLength > 100) score += 20;
  if (params.answerLength > 250) score += 20;
  if (params.usedAllWords) score += 30;
  return Math.min(100, score);
}
