import type { Metadata } from "next";
import { LogicSequencesGame } from "@/components/games/logic-sequences";

export const metadata: Metadata = {
  title: "Logic Sequences — HIB",
  description:
    "Тренировка индуктивного мышления: найдите правило в последовательности и выберите следующий элемент.",
};

export default function LogicSequencesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <LogicSequencesGame />
    </div>
  );
}
