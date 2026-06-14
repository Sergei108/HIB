import type { Metadata } from "next";
import { CreativeAssociationGame } from "@/components/games/creative-association";

export const metadata: Metadata = {
  title: "Creative Association — HIB",
  description:
    "Тренировка креативности: свяжите три случайных слова в историю, метафору или ассоциацию.",
};

export default function CreativeAssociationPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <CreativeAssociationGame />
    </div>
  );
}
