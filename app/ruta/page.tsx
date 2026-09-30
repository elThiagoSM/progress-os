import type { Metadata } from "next";
import { Dashboard } from "@/components/dashboard";

export const metadata: Metadata = {
  title: "Ruta de aprendizaje — Norkent",
  description:
    "11 etapas para reaprender programación estudiando y modificando Norkent: teoría, práctica en el proyecto, ejercicios, mini proyectos y progreso general.",
};

export default function RoutePage() {
  return <Dashboard />;
}
