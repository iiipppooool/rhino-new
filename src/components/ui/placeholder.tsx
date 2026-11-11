import { todoHint } from '@/config/site';

/**
 * Renders an unsupplied fact so it is impossible to ship by accident.
 * Used wherever the brief left a [BRACKET] unfilled.
 */
export function Todo({ value, className = '' }: { value: string; className?: string }) {
  return (
    <span
      data-todo="true"
      className={`inline-flex items-center gap-1.5 rounded border border-dashed border-flag/70 bg-flag/10 px-2 py-0.5 align-baseline text-[0.8em] font-semibold tracking-tight text-flag ${className}`}
      title="This fact was not supplied. Set it in src/config/site.ts"
    >
      <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3 w-3 shrink-0 fill-current">
        <path d="M8 1 15 14H1Zm0 4v4.5h0V5Zm-.9 0h1.8v5H7.1Zm0 6h1.8v1.8H7.1Z" />
      </svg>
      {todoHint(value)}
    </span>
  );
}

/**
 * A slot where no suitable photo was found. Deliberately styled as a visible
 * gap with its sourcing brief, rather than filled with an unrelated stock image.
 */
export function PhotoPlaceholder({
  brief,
  className = '',
  ratio = 'aspect-[4/3]',
}: {
  brief: string;
  className?: string;
  ratio?: string;
}) {
  return (
    <div
      data-replace="true"
      data-photo-missing="true"
      role="img"
      aria-label={`Photo needed: ${brief}`}
      className={`${ratio} flex w-full flex-col justify-end gap-2 border border-dashed border-flag/40 bg-[repeating-linear-gradient(135deg,transparent,transparent_10px,rgba(255,176,32,0.06)_10px,rgba(255,176,32,0.06)_20px)] p-5 ${className}`}
    >
      <span className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-flag">
        Photo needed
      </span>
      <span className="text-sm leading-snug text-muted">{brief}</span>
    </div>
  );
}

/** Where social proof will go once there is real social proof. */
export function ProofPlaceholder({ label, className = '' }: { label: string; className?: string }) {
  return (
    <div
      data-placeholder="proof"
      className={`flex min-h-32 flex-col justify-center gap-2 rounded-lg border border-dashed border-flag/40 bg-flag/[0.04] p-6 ${className}`}
    >
      <span className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-flag">
        {label}
      </span>
      <span className="text-sm text-muted">
        Nothing goes here until it is real. No invented quotes, numbers or logos.
      </span>
    </div>
  );
}
