import type { CognitiveSkill } from "@/lib/types";
import { GlowCard } from "@/components/ui/glow-card";
import {
  BrainIcon,
  BoltIcon,
  TargetIcon,
  LogicIcon,
  SparklesIcon,
  FeatherIcon,
  ClockIcon,
} from "@/components/ui/icons";
import { ReactNode } from "react";

const skillIconMap: Record<CognitiveSkill, ReactNode> = {
  "Память": <BrainIcon className="h-5 w-5" />,
  "Внимание": <TargetIcon className="h-5 w-5" />,
  "Логика": <LogicIcon className="h-5 w-5" />,
  "Скорость реакции": <BoltIcon className="h-5 w-5" />,
  "Когнитивный контроль": <ClockIcon className="h-5 w-5" />,
  "Креативность": <SparklesIcon className="h-5 w-5" />,
  "Ассоциативное мышление": <FeatherIcon className="h-5 w-5" />,
};

const skillDescriptions: Record<CognitiveSkill, string> = {
  "Память": "Удержание и воспроизведение информации",
  "Внимание": "Фокус и фильтрация",
  "Логика": "Поиск закономерностей",
  "Скорость реакции": "Быстрый и точный ответ",
  "Когнитивный контроль": "Торможение импульсов",
  "Креативность": "Генерация новых идей",
  "Ассоциативное мышление": "Связи между понятиями",
};

type SkillCardProps = {
  skill: CognitiveSkill;
};

export function SkillCard({ skill }: SkillCardProps) {
  return (
    <GlowCard className="p-5 h-full" hover>
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-primary/30 bg-gradient-to-br from-primary/20 to-mint/10 text-primary">
        {skillIconMap[skill]}
      </span>
      <h3 className="mt-3 text-base font-semibold text-text-primary">
        {skill}
      </h3>
      <p className="mt-1 text-sm text-text-secondary">
        {skillDescriptions[skill]}
      </p>
    </GlowCard>
  );
}
