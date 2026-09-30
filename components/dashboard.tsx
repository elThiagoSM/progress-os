"use client";

import Link from "next/link";
import { useState } from "react";
import { countsOf, overallProgress, statusOf, useProgress } from "@/lib/progress";
import {
  ANTI_PATTERNS,
  HOW_TO_RULES,
  ROUTE_META,
  stages,
  VALIDATION_COMMANDS,
  type StageStatus,
} from "@/lib/stages";
import { Station } from "./station";
import { ChevronIcon, ProgressBar, RichText, Stat } from "./ui";

type Filter = "todas" | StageStatus;

const FILTERS: { key: Filter; label: string }[] = [
  { key: "todas", label: "Todas" },
  { key: "pendiente", label: "Pendientes" },
  { key: "en-curso", label: "En curso" },
  { key: "completada", label: "Completadas" },
];

const SEGMENT_COLOR: Record<StageStatus, string> = {
  pendiente: "bg-line-strong",
  "en-curso": "bg-warn",
  completada: "bg-ok",
};

const LEGEND: { status: StageStatus; label: string }[] = [
  { status: "completada", label: "Completadas" },
  { status: "en-curso", label: "En curso" },
  { status: "pendiente", label: "Pendientes" },
];

const EMPTY_MESSAGE: Record<Filter, { title: string; hint: string }> = {
  todas: { title: "No hay etapas.", hint: "Revisá el archivo de la ruta." },
  pendiente: {
    title: "No quedan etapas pendientes.",
    hint: "Si completaste las 11, la ruta está cerrada. Volvé a una anterior y repetí sus ejercicios.",
  },
  "en-curso": {
    title: "No tenés etapas en curso.",
    hint: "Marcá la siguiente de la ruta como «En curso» para retomar donde dejaste.",
  },
  completada: {
    title: "Todavía no completaste ninguna etapa.",
    hint: "Abrí una etapa, hacé sus ejercicios y cambiale el estado a «Completada».",
  },
};

export function Dashboard() {
  const progress = useProgress();
  const [filter, setFilter] = useState<Filter>("todas");
  const [choice, setChoice] = useState<number | "auto" | null>("auto");

  const counts = countsOf(progress.state, stages);
  const overall = overallProgress(progress.state, stages);

  const activeId =
    stages.find((stage) => statusOf(progress.state, stage.id) === "en-curso")?.id ?? null;
  const expandedId = choice === "auto" ? activeId : choice;

  const filterCount: Record<Filter, number> = {
    todas: stages.length,
    pendiente: counts.pendientes,
    "en-curso": counts.enCurso,
    completada: counts.completadas,
  };

  const visibleStages = stages.filter(
    (stage) => filter === "todas" || statusOf(progress.state, stage.id) === filter,
  );

  const resetProgress = () => {
    if (window.confirm("¿Reiniciar todo el progreso guardado en este navegador?")) {
      progress.reset();
      setChoice("auto");
      setFilter("todas");
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:border focus:border-ink focus:bg-surface focus:px-4 focus:py-2 focus:text-sm focus:font-medium"
      >
        {ROUTE_META.skipLink}
      </a>

      <header className="sticky top-0 z-30 border-b border-line bg-paper">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/"
              className="font-mono text-[13px] text-ink underline decoration-transparent underline-offset-4 transition-colors hover:decoration-ink"
            >
              progress-os
            </Link>
            <span aria-hidden="true" className="hidden text-line-strong sm:inline">
              /
            </span>
            <span className="hidden truncate text-sm text-muted sm:inline">
              Ruta de aprendizaje · {ROUTE_META.project}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-muted md:inline">Progreso general</span>
            <ProgressBar
              value={overall}
              tone={overall === 100 ? "ok" : "ink"}
              className="w-20 sm:w-32"
            />
            <span className="w-9 text-right font-mono text-sm tabular-nums">{overall}%</span>
          </div>
        </div>
      </header>

      <main id="contenido" tabIndex={-1} className="mx-auto w-full max-w-5xl flex-1 px-4 sm:px-6">
        <section className="pt-10 sm:pt-14">
          <p className="font-mono text-xs text-muted">{ROUTE_META.project}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {ROUTE_META.title}
          </h1>
          <p className="mt-4 max-w-[64ch] text-[15px] leading-relaxed text-ink-soft">
            {ROUTE_META.intro}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-3">
            <Stat value={String(ROUTE_META.stageCount)} label="etapas" />
            <Stat value={ROUTE_META.span} label="duración estimada" />
            <Stat value={ROUTE_META.pace} label="ritmo sugerido" />
          </div>

          <div className="mt-8 rounded-lg border border-line bg-surface p-5 sm:p-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl leading-none font-semibold tabular-nums">
                    {overall}
                  </span>
                  <span className="text-lg text-muted">%</span>
                </div>
                <p className="mt-2 text-sm text-muted">progreso general de la ruta</p>
              </div>

              <div className="sm:max-w-md sm:flex-1">
                <div className="flex gap-1">
                  {stages.map((stage) => {
                    const status = statusOf(progress.state, stage.id);
                    return (
                      <span
                        key={stage.id}
                        title={`Etapa ${stage.id}: ${stage.title}`}
                        className={`h-2.5 flex-1 rounded-[2px] transition-colors duration-300 ${SEGMENT_COLOR[status]}`}
                      />
                    );
                  })}
                </div>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
                  {LEGEND.map((item) => (
                    <span
                      key={item.status}
                      className="inline-flex items-center gap-1.5 text-xs text-muted"
                    >
                      <span
                        aria-hidden="true"
                        className={`size-2 rounded-full ${SEGMENT_COLOR[item.status]}`}
                      />
                      {item.label}
                      <span className="font-mono text-ink">
                        {item.status === "completada"
                          ? counts.completadas
                          : item.status === "en-curso"
                            ? counts.enCurso
                            : counts.pendientes}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
              <p className="text-xs text-muted">
                El progreso se guarda en este navegador. Cada etapa suma según su avance de
                ejercicios, preguntas y mini proyecto.
              </p>
              <button
                type="button"
                onClick={resetProgress}
                className="text-xs text-muted underline decoration-line-strong underline-offset-4 transition-colors hover:text-ink hover:decoration-ink"
              >
                Reiniciar progreso
              </button>
            </div>
          </div>

          <details className="mt-6 rounded-lg border border-line bg-surface">
            <summary className="flex items-center justify-between gap-3 rounded-t-lg px-5 py-3.5 text-sm font-medium transition-colors hover:bg-paper/60">
              Cómo usar esta ruta
              <ChevronIcon className="summary-chevron size-3 shrink-0 text-muted transition-transform duration-300" />
            </summary>
            <div className="border-t border-line px-5 py-4">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="font-mono text-xs text-muted">Reglas</p>
                  <ol className="mt-2.5 list-decimal space-y-2.5 pl-5 text-sm leading-relaxed text-ink-soft marker:font-mono marker:text-muted">
                    {HOW_TO_RULES.map((rule) => (
                      <li key={rule}>
                        <RichText text={rule} />
                      </li>
                    ))}
                  </ol>
                </div>
                <div>
                  <p className="font-mono text-xs text-muted">Anti-patrones a evitar</p>
                  <ul className="mt-2.5 space-y-2.5">
                    {ANTI_PATTERNS.map((pattern) => (
                      <li
                        key={pattern}
                        className="relative pl-4 text-sm leading-relaxed text-ink-soft before:absolute before:top-2 before:left-0 before:size-1 before:rounded-full before:bg-warn"
                      >
                        <RichText text={pattern} />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-5 border-t border-line pt-4">
                <span className="font-mono text-xs text-muted">Comandos de validación</span>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {VALIDATION_COMMANDS.map((command) => (
                    <code
                      key={command}
                      className="rounded border border-line bg-paper px-2 py-1 font-mono text-xs text-ink-soft"
                    >
                      {command}
                    </code>
                  ))}
                </div>
              </div>
            </div>
          </details>
        </section>

        <section className="mt-12 pb-16">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-lg font-semibold">Etapas</h2>
            <div className="flex flex-wrap gap-1.5">
              {FILTERS.map((item) => {
                const active = filter === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setFilter(item.key)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                      active
                        ? "border-ink bg-ink text-surface"
                        : "border-line bg-surface text-ink-soft hover:border-line-strong hover:bg-paper"
                    }`}
                  >
                    {item.label}{" "}
                    <span className={active ? "font-mono opacity-70" : "font-mono text-muted"}>
                      {filterCount[item.key]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {visibleStages.length > 0 ? (
            <ol className="mt-6 space-y-4">
              {visibleStages.map((stage, index) => (
                <Station
                  key={stage.id}
                  stage={stage}
                  expanded={expandedId === stage.id}
                  onToggle={() => setChoice(expandedId === stage.id ? null : stage.id)}
                  isLast={index === visibleStages.length - 1 && filter === "todas"}
                />
              ))}
            </ol>
          ) : (
            <div className="mt-6 rounded-lg border border-dashed border-line-strong bg-surface px-6 py-12 text-center">
              <p className="text-sm font-medium text-ink-soft">
                {EMPTY_MESSAGE[filter].title}
              </p>
              <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted">
                {EMPTY_MESSAGE[filter].hint}
              </p>
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-start sm:justify-between sm:px-6">
          <p className="max-w-md text-sm leading-relaxed text-muted">
            Ninguna etapa se cierra sin <span className="font-mono text-ink-soft">lint</span>,{" "}
            <span className="font-mono text-ink-soft">type-check</span>,{" "}
            <span className="font-mono text-ink-soft">test</span> y{" "}
            <span className="font-mono text-ink-soft">build</span> en verde.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {VALIDATION_COMMANDS.slice(1).map((command) => (
              <code
                key={command}
                className="rounded border border-line bg-surface px-2 py-1 font-mono text-xs text-ink-soft"
              >
                {command}
              </code>
            ))}
          </div>
        </div>
        <div className="border-t border-line">
          <p className="mx-auto max-w-5xl px-4 py-4 text-xs text-muted sm:px-6">
            <Link
              href="/"
              className="underline decoration-transparent underline-offset-4 transition-colors hover:text-ink hover:decoration-ink"
            >
              progress-os
            </Link>{" "}
            · Contenido: RUTA_APRENDIZAJE_PROYECTO.md · Progreso guardado en localStorage
          </p>
        </div>
      </footer>
    </div>
  );
}
