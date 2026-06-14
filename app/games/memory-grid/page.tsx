import type { Metadata } from "next";
import { MemoryGridGame } from "@/components/games/memory-grid";

export const metadata: Metadata = {
  title: "Memory Grid — HIB",
  description:
    "Тренировка зрительной рабочей памяти: запомните подсвеченные клетки сетки 3×3 или 4×4 и воспроизведите паттерн.",
};

export default function MemoryGridPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <MemoryGridGame />
    </div>
  );
}
