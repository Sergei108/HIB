import type { Metadata } from "next";
import { ReactionFocusGame } from "@/components/games/reaction-focus";

export const metadata: Metadata = {
  title: "Reaction Focus — HIB",
  description:
    "Тренировка скорости реакции и тормозного контроля: парадигма Go/No-Go, 10 попыток.",
};

export default function ReactionFocusPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <ReactionFocusGame />
    </div>
  );
}
