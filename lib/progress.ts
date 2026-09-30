import { useSyncExternalStore } from "react";
import type { Stage, StageStatus } from "./stages";

export interface ProgressState {
  statuses: Record<number, StageStatus>;
  checks: Record<string, boolean>;
}

export interface StageCounts {
  completadas: number;
  enCurso: number;
  pendientes: number;
}

const KEY = "progress-os/ruta-norkent/v1";

const EMPTY: ProgressState = { statuses: {}, checks: {} };

let clientState: ProgressState = EMPTY;
const listeners = new Set<() => void>();

function load(): ProgressState {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    return {
      statuses:
        parsed.statuses && typeof parsed.statuses === "object" ? parsed.statuses : {},
      checks: parsed.checks && typeof parsed.checks === "object" ? parsed.checks : {},
    };
  } catch {
    return EMPTY;
  }
}

function persist(state: ProgressState) {
  clientState = state;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // almacenamiento no disponible: el estado sigue vivo en memoria
  }
  listeners.forEach((listener) => listener());
}

if (typeof window !== "undefined") {
  clientState = load();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return clientState;
}

function getServerSnapshot() {
  return EMPTY;
}

export function checkKey(stageId: number, section: "ej" | "preg" | "mini", index = 0) {
  return `${stageId}:${section}:${index}`;
}

export function statusOf(state: ProgressState, stageId: number): StageStatus {
  return state.statuses[stageId] ?? "pendiente";
}

export function stageProgress(state: ProgressState, stage: Stage) {
  const status = statusOf(state, stage.id);
  if (status === "completada") return 100;
  if (status === "pendiente") return 0;

  const total = stage.exercises.length + stage.questions.length + 1;
  if (total === 0) return 0;

  let done = 0;
  for (let i = 0; i < stage.exercises.length; i++) {
    if (state.checks[checkKey(stage.id, "ej", i)]) done++;
  }
  for (let i = 0; i < stage.questions.length; i++) {
    if (state.checks[checkKey(stage.id, "preg", i)]) done++;
  }
  if (state.checks[checkKey(stage.id, "mini")]) done++;

  return Math.round((done / total) * 100);
}

export function overallProgress(state: ProgressState, stages: Stage[]) {
  if (stages.length === 0) return 0;
  const total = stages.reduce((sum, stage) => sum + stageProgress(state, stage), 0);
  return Math.round(total / stages.length);
}

export function countsOf(state: ProgressState, stages: Stage[]): StageCounts {
  const counts: StageCounts = { completadas: 0, enCurso: 0, pendientes: 0 };
  for (const stage of stages) {
    const status = statusOf(state, stage.id);
    if (status === "completada") counts.completadas++;
    else if (status === "en-curso") counts.enCurso++;
    else counts.pendientes++;
  }
  return counts;
}

export function useProgress() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return {
    state,
    setStatus(stageId: number, status: StageStatus) {
      persist({
        ...state,
        statuses: { ...state.statuses, [stageId]: status },
      });
    },
    toggleCheck(key: string, stageId?: number) {
      const checks = { ...state.checks };
      const nextValue = !checks[key];
      if (nextValue) checks[key] = true;
      else delete checks[key];

      const statuses = { ...state.statuses };
      if (nextValue && stageId !== undefined && statuses[stageId] !== "completada") {
        statuses[stageId] = "en-curso";
      }

      persist({ ...state, checks, statuses });
    },
    reset() {
      persist(EMPTY);
    },
  };
}
