import type { Metadata } from "next";
import { DashboardView } from "@/components/dashboard/dashboard-view";

export const metadata: Metadata = {
  title: "Прогресс — HIB",
  description:
    "Статистика тренировок, уровень, достижения и творческие ответы Human Intelligence Boost.",
};

export default function DashboardPage() {
  return <DashboardView />;
}
