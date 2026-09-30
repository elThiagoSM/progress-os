import { stageProgress, statusOf, useProgress } from "@/lib/progress";
import type { Stage, StageStatus } from "@/lib/stages";
import { StageDetail } from "./stage-detail";
import { ChevronIcon, ProgressBar, StatusBadge, Tag } from "./ui";

const RAIL_COLOR: Record<StageStatus, string> = {
  pendiente: "bg-rail",
  "en-curso": "bg-warn",
  completada: "bg-ok",
};

const DOT_STYLE: Record<StageStatus, string> = {
  pendiente: "border-line-strong bg-surface text-muted",
  "en-curso": "border-warn bg-warn-soft text-warn",
  completada: "border-ok bg-ok text-surface",
};

export function Station({
  stage,
  expanded,
  onToggle,
  isLast,
}: {
  stage: Stage;
  expanded: boolean;
  onToggle: () => void;
  isLast: boolean;
}) {
  const progress = useProgress();
  const status = statusOf(progress.state, stage.id);
  const pct = stageProgress(progress.state, stage);
  const panelId = `etapa-${stage.id}-detalle`;
  const tone = status === "completada" ? "ok" : status === "en-curso" ? "warn" : "ink";

  return (
    <li className="relative">
      {isLast ? null : (
        <span
          aria-hidden="true"
          className={`absolute top-7 bottom-0 left-4 w-px transition-colors duration-300 sm:left-5 ${RAIL_COLOR[status]}`}
        />
      )}

      <span
        aria-hidden="true"
        className={`absolute top-1 left-0 grid size-8 place-items-center rounded-full border font-mono text-[13px] font-medium transition-colors duration-300 sm:size-10 sm:text-sm ${DOT_STYLE[status]}`}
      >
        {stage.id}
      </span>

      <div className="pl-11 sm:pl-14">
        <div
          className={`rounded-lg border bg-surface transition-colors ${
            expanded ? "border-line-strong" : "border-line"
          }`}
        >
          <h3 className="m-0">
            <button
              type="button"
              onClick={onToggle}
              aria-expanded={expanded}
              aria-controls={panelId}
              className="flex w-full flex-col gap-3 rounded-lg px-4 py-4 text-left transition-colors hover:bg-paper/70 sm:px-5"
            >
              <span className="flex w-full items-start justify-between gap-3">
                <span className="min-w-0">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="text-[15px] leading-snug font-semibold sm:text-base">
                      {stage.title}
                    </span>
                    {stage.level ? (
                      <span className="rounded border border-warn/40 bg-warn-soft px-1.5 py-px font-mono text-[10px] font-medium text-warn">
                        {stage.level}
                      </span>
                    ) : null}
                  </span>
                  <span className="mt-2 flex flex-wrap items-center gap-1.5">
                    <span className="mr-1 font-mono text-xs text-muted">{stage.duration}</span>
                    {stage.tags.map((tag) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </span>
                </span>

                <span className="flex shrink-0 items-center gap-2">
                  <StatusBadge status={status} />
                  <span className="grid size-6 place-items-center text-muted">
                    <ChevronIcon
                      className={`size-3 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
                    />
                  </span>
                </span>
              </span>

              {pct > 0 ? (
                <span className="flex w-full items-center gap-3">
                  <ProgressBar value={pct} tone={tone} className="max-w-56 flex-1" />
                  <span className="font-mono text-xs tabular-nums text-muted">{pct}%</span>
                </span>
              ) : null}
            </button>
          </h3>

          <div
            id={panelId}
            inert={!expanded}
            className={`grid transition-[grid-template-rows] duration-300 ease-out ${
              expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            }`}
          >
            <div className="relative overflow-hidden">
              <StageDetail stage={stage} />
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}
