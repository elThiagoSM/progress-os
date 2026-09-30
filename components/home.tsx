"use client";

import Link from "next/link";
import { countsOf, overallProgress, useProgress } from "@/lib/progress";
import { ROUTES, stages } from "@/lib/stages";
import { ProgressBar, Stat } from "./ui";

export function Home() {
  const progress = useProgress();
  const overall = overallProgress(progress.state, stages);
  const counts = countsOf(progress.state, stages);
  const routeCount =
    ROUTES.length === 1 ? "1 ruta disponible" : `${ROUTES.length} rutas disponibles`;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b border-line bg-paper">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
          <span className="font-mono text-[13px] text-ink">progress-os</span>
          <span className="font-mono text-xs text-muted">{routeCount}</span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 sm:px-6">
        <section className="pt-10 sm:pt-14">
          <p className="font-mono text-xs text-muted">progress-os</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Rutas de aprendizaje
          </h1>
          <p className="mt-4 max-w-[64ch] text-[15px] leading-relaxed text-ink-soft">
            Cada ruta junta teoría, práctica aplicada a un proyecto real, ejercicios y mini
            proyectos. El progreso se guarda en este navegador: retomá donde dejaste cuando
            quieras.
          </p>
        </section>

        <section className="mt-12 pb-16">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold">Rutas disponibles</h2>
            <span className="font-mono text-xs text-muted">{ROUTES.length}</span>
          </div>

          <div className="mt-6 grid gap-4">
            {ROUTES.map((route) => (
              <Link
                key={route.slug}
                href={route.href}
                className="group block rounded-lg border border-line bg-surface p-5 transition-colors hover:border-line-strong sm:p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-mono text-xs text-muted">{route.name}</p>
                    <h3 className="mt-1.5 text-xl font-semibold tracking-tight sm:text-2xl">
                      {route.title}
                    </h3>
                  </div>
                  <span
                    aria-hidden="true"
                    className="mt-1 grid size-8 shrink-0 place-items-center rounded-full border border-line text-muted transition-colors group-hover:border-ink group-hover:text-ink"
                  >
                    →
                  </span>
                </div>

                <p className="mt-3 max-w-[70ch] text-sm leading-relaxed text-ink-soft">
                  {route.blurb}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-x-7 gap-y-3">
                  <Stat value={String(route.stageCount)} label="etapas" />
                  <Stat value={route.span} label="duración estimada" />
                  <Stat value={route.pace} label="ritmo sugerido" />
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
                  <div className="flex min-w-48 flex-1 items-center gap-3">
                    <ProgressBar
                      value={overall}
                      tone={overall === 100 ? "ok" : "ink"}
                      className="max-w-56 flex-1"
                    />
                    <span className="font-mono text-sm tabular-nums">{overall}%</span>
                  </div>
                  <span className="font-mono text-xs text-muted">
                    {counts.completadas} completadas · {counts.enCurso} en curso ·{" "}
                    {counts.pendientes} pendientes
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <p className="mx-auto max-w-5xl px-4 py-4 text-xs text-muted sm:px-6">
          progress-os · Progreso guardado en localStorage
        </p>
      </footer>
    </div>
  );
}
