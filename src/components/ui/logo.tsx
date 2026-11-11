/** Flat, one-colour wordmark with a minimal geometric horn. Legible at 16px. */
export function Logo({ className = '', showWordmark = true }: { className?: string; showWordmark?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" aria-hidden="true" fill="none">
        {/* Horn: a single angular sweep. One colour, no gradients. */}
        <path d="M4 21 C4 11.5 9.5 4 19.5 2.5 C17 7 15.5 11 15.5 15.5 L15.5 21 Z" fill="currentColor" />
        <path d="M8.5 21 C8.5 16 10.5 11.5 14 8.5" stroke="var(--color-base)" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      {showWordmark && (
        <span className="font-display text-xl font-bold tracking-[-0.03em]">VRhino</span>
      )}
    </span>
  );
}
