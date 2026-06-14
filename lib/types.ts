export type GameId =
  | "memory-grid"
  | "stroop-test"
  | "reaction-focus"
  | "logic-sequences"
  | "creative-association";

export type CognitiveSkill =
  | "Память"
  | "Внимание"
  | "Логика"
  | "Скорость реакции"
  | "Когнитивный контроль"
  | "Креативность"
  | "Ассоциативное мышление";

export type Difficulty = "Лёгкая" | "Средняя" | "Высокая";

export type GameResult = {
  id: string;
  gameId: GameId;
  gameTitle: string;
  score: number;
  accuracy?: number;
  durationMs?: number;
  reactionTimeMs?: number;
  mistakes?: number;
  correctAnswers?: number;
  totalQuestions?: number;
  completedAt: string;
};

export type CreativeEntry = {
  id: string;
  words: string[];
  answer: string;
  createdAt: string;
};

export type UserProgress = {
  totalScore: number;
  completedSessions: number;
  currentStreak: number;
  level: number;
  lastTrainingDate: string | null;
  results: GameResult[];
  creativeEntries: CreativeEntry[];
  unlockedAchievements: string[];
};

export type GameInfo = {
  id: GameId;
  title: string;
  subtitle: string;
  description: string;
  shortDescription: string;
  longDescription?: string;
  skills: CognitiveSkill[];
  duration: string;
  difficulty: Difficulty;
  path: string;
  icon: string;
  accent: string;
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  condition: string;
  icon: string;
  category: "session" | "skill" | "level" | "creativity";
};

export type StroopColor = "red" | "blue" | "green" | "yellow" | "purple" | "orange";

export type StroopQuestion = {
  word: StroopColor;
  textColor: StroopColor;
  correct: StroopColor;
  options: StroopColor[];
};

export type LogicQuestion = {
  id: string;
  sequence: string;
  options: string[];
  answer: string;
  explanation: string;
};
