import type { ReactNode } from "react";
import { STATUS_LABEL, type StageStatus } from "@/lib/stages";

export function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" fill="none" className={className} aria-hidden="true">
      <path
        d="M2 6.4 4.6 9 10 3.4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChevronIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" fill="none" className={className} aria-hidden="true">
      <path
        d="M2.5 4.5 6 8l3.5-3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function RichText({ text, className = "" }: { text: string; className?: string }) {
  const parts = text.split("`");
  return (
    <span className={className}>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <code
            key={index}
            className="rounded border border-line bg-paper px-1 py-px font-mono text-[0.88em] break-words text-ink box-decoration-clone"
          >
            {part}
          </code>
        ) : (
          part
        ),
      )}
    </span>
  );
}

export function Section({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h4 className="font-mono text-xs text-muted">{label}</h4>
      {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
      <div className="mt-2.5 max-w-[76ch]">{children}</div>
    </section>
  );
}

const STATUS_BADGE: Record<StageStatus, string> = {
  pendiente: "border-line-strong bg-surface text-muted",
  "en-curso": "border-warn/40 bg-warn-soft text-warn",
  completada: "border-ok/40 bg-ok-soft text-ok",
};

export function StatusBadge({ status }: { status: StageStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${STATUS_BADGE[status]}`}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {STATUS_LABEL[status]}
    </span>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="rounded border border-line bg-paper px-1.5 py-0.5 font-mono text-[11px] text-muted">
      {children}
    </span>
  );
}

export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="font-mono text-base text-ink">{value}</span>
      <span className="text-sm text-muted">{label}</span>
    </div>
  );
}

export function ProgressBar({
  value,
  tone = "ink",
  className = "",
}: {
  value: number;
  tone?: "ink" | "warn" | "ok";
  className?: string;
}) {
  const color = tone === "warn" ? "bg-warn" : tone === "ok" ? "bg-ok" : "bg-ink";
  const width = `${Math.min(100, Math.max(0, value))}%`;
  return (
    <span
      className={`block h-1.5 overflow-hidden rounded-full bg-line ${className}`}
      aria-hidden="true"
    >
      <span
        className={`block h-full rounded-full ${color} transition-[width] duration-500 ease-out`}
        style={{ width }}
      />
    </span>
  );
}

export function CheckRow({
  checked,
  onToggle,
  children,
}: {
  checked: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <label className="-mx-2 flex cursor-pointer items-start gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-paper">
      <input type="checkbox" className="peer sr-only" checked={checked} onChange={onToggle} />
      <span
        aria-hidden="true"
        className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-[3px] border border-line-strong bg-surface text-transparent transition-colors peer-checked:border-ink peer-checked:bg-ink peer-checked:text-surface peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink"
      >
        <CheckIcon className="size-3" />
      </span>
      <span
        className={`text-sm leading-relaxed ${
          checked ? "text-muted line-through decoration-line-strong" : "text-ink-soft"
        }`}
      >
        {children}
      </span>
    </label>
  );
}

export function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li
          key={item}
          className="relative pl-4 text-sm leading-relaxed text-ink-soft before:absolute before:top-2 before:left-0 before:size-1 before:rounded-full before:bg-line-strong"
        >
          <RichText text={item} />
        </li>
      ))}
    </ul>
  );
}

export function DifficultyMeter({ level }: { level: number }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="sr-only">Dificultad {level} de 5</span>
      <span aria-hidden="true" className="flex gap-1">
        {[1, 2, 3, 4, 5].map((step) => (
          <span
            key={step}
            className={`h-1.5 w-4 rounded-[1px] ${step <= level ? "bg-ink" : "bg-line-strong"}`}
          />
        ))}
      </span>
      <span aria-hidden="true" className="font-mono text-xs text-muted">
        {level}/5
      </span>
    </span>
  );
}
