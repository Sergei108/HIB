import type { Metadata } from "next";
import { StroopTestGame } from "@/components/games/stroop-test";

export const metadata: Metadata = {
  title: "Stroop Test — HIB",
  description:
    "Тренировка когнитивного контроля: выбирайте цвет текста, игнорируя значение слова.",
};

export default function StroopTestPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <StroopTestGame />
    </div>
  );
}
