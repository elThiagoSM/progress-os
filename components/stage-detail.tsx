import { checkKey, stageProgress, statusOf, useProgress } from "@/lib/progress";
import { STATUS_LABEL, STATUS_ORDER, type Stage } from "@/lib/stages";
import {
  BulletList,
  CheckIcon,
  CheckRow,
  DifficultyMeter,
  ProgressBar,
  RichText,
  Section,
} from "./ui";

const TONE: Record<string, "ink" | "warn" | "ok"> = {
  pendiente: "ink",
  "en-curso": "warn",
  completada: "ok",
};

function SinIaBadge() {
  return (
    <span className="mr-1.5 rounded border border-warn/40 bg-warn-soft px-1 py-px align-[0.08em] font-mono text-[10px] font-medium text-warn">
      SIN IA
    </span>
  );
}

export function StageDetail({ stage }: { stage: Stage }) {
  const progress = useProgress();
  const status = statusOf(progress.state, stage.id);
  const pct = stageProgress(progress.state, stage);

  return (
    <div className="space-y-6 border-t border-line px-4 py-5 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="font-mono text-xs text-muted">Estado de la etapa</span>
          <div className="mt-2 inline-flex rounded-md border border-line bg-surface p-0.5">
            {STATUS_ORDER.map((option) => {
              const active = option === status;
              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={active}
                  onClick={() => progress.setStatus(stage.id, option)}
                  className={`rounded-[5px] px-3 py-1.5 text-xs font-medium transition-colors ${
                    active ? "bg-ink text-surface" : "text-ink-soft hover:bg-paper"
                  }`}
                >
                  {STATUS_LABEL[option]}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-muted">Avance</span>
          <ProgressBar value={pct} tone={TONE[status]} className="w-28" />
          <span className="w-9 text-right font-mono text-xs tabular-nums text-ink-soft">{pct}%</span>
        </div>
      </div>

      <Section label="Objetivo">
        <p className="max-w-[70ch] text-sm leading-relaxed text-ink-soft">
          <RichText text={stage.objective} />
        </p>
      </Section>

      <Section label="Conceptos teóricos">
        <BulletList items={stage.theory} />
      </Section>

      <Section label="Práctica en el proyecto">
        <BulletList items={stage.practice} />
      </Section>

      <Section label="Qué estudiar en el proyecto">
        <ul className="space-y-3.5">
          {stage.study.map((file) => (
            <li key={`${file.path}-${file.note}`}>
              <p className="font-mono text-[13px] break-words text-ink">{file.path}</p>
              <p className="mt-0.5 text-sm leading-relaxed text-muted">
                <RichText text={file.note} />
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        label="Términos de búsqueda"
        hint="Copiá un término en Google o en la documentación oficial para aprender lo de la etapa."
      >
        <div className="flex flex-wrap gap-1.5">
          {stage.searchTerms.map((term) => (
            <a
              key={term}
              href={`https://www.google.com/search?q=${encodeURIComponent(term)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded border border-line bg-paper px-2 py-1 font-mono text-xs text-ink-soft transition-colors hover:border-ink hover:text-ink"
            >
              {term}
            </a>
          ))}
        </div>
      </Section>

      {stage.exercises.length > 0 ? (
        <Section label="Ejercicios" hint="Los marcados SIN IA se resuelven sin pedirle código a la IA.">
          <ul className="space-y-0.5">
            {stage.exercises.map((exercise, index) => (
              <li key={exercise.text}>
                <CheckRow
                  checked={Boolean(progress.state.checks[checkKey(stage.id, "ej", index)])}
                  onToggle={() => progress.toggleCheck(checkKey(stage.id, "ej", index), stage.id)}
                >
                  {exercise.sinIa ? <SinIaBadge /> : null}
                  <RichText text={exercise.text} />
                </CheckRow>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {stage.questions.length > 0 ? (
        <Section
          label="Preguntas de razonamiento"
          hint="Contestalas antes de pasar de etapa: si no podés responderlas, aún no pasaste."
        >
          <ul className="space-y-0.5">
            {stage.questions.map((question, index) => (
              <li key={question}>
                <CheckRow
                  checked={Boolean(progress.state.checks[checkKey(stage.id, "preg", index)])}
                  onToggle={() => progress.toggleCheck(checkKey(stage.id, "preg", index), stage.id)}
                >
                  <RichText text={question} />
                </CheckRow>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <section>
        <div className="rounded-lg border border-line bg-paper/70 p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="font-mono text-xs text-muted">Mini proyecto de la etapa</span>
            <DifficultyMeter level={stage.miniProject.difficulty} />
          </div>
          <h4 className="mt-2.5 text-[15px] font-semibold">{stage.miniProject.title}</h4>
          <p className="mt-2 max-w-[70ch] text-sm leading-relaxed text-ink-soft">
            <RichText text={stage.miniProject.brief} />
          </p>
          <p className="mt-3 max-w-[70ch] text-sm leading-relaxed text-muted">
            <span className="font-medium text-ink">Se aprueba cuando: </span>
            <RichText text={stage.miniProject.approval} />
          </p>
          <div className="mt-4 border-t border-line pt-2">
            <CheckRow
              checked={Boolean(progress.state.checks[checkKey(stage.id, "mini")])}
              onToggle={() => progress.toggleCheck(checkKey(stage.id, "mini"), stage.id)}
            >
              Mini proyecto aprobado
            </CheckRow>
          </div>
        </div>
      </section>

      {stage.extra ? (
        <Section label={stage.extra.label}>
          <BulletList items={stage.extra.items} />
        </Section>
      ) : null}

      <div className="flex items-start gap-2.5 rounded-md border border-ok/40 bg-ok-soft px-4 py-3">
        <span
          aria-hidden="true"
          className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-ok text-surface"
        >
          <CheckIcon className="size-2.5" />
        </span>
        <p className="text-sm leading-relaxed">
          <span className="font-mono text-xs text-ok">Listo cuando: </span>
          <span className="text-ink-soft">
            <RichText text={stage.doneWhen} />
          </span>
        </p>
      </div>

      {stage.validation ? (
        <div>
          <span className="font-mono text-xs text-muted">Validación de etapa</span>
          <p className="mt-1.5 font-mono text-[13px] text-ink-soft">{stage.validation}</p>
        </div>
      ) : null}
    </div>
  );
}
