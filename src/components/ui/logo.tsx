import Image from 'next/image';

/**
 * The VRhino lockup: the rhino mark as artwork, the wordmark as live text.
 *
 * The supplied logo's wordmark is dark navy, which measures about 1.3:1 on the
 * site's background and is unreadable there. Setting it as text instead keeps
 * it legible on dark, crisp at every size and selectable by screen readers,
 * while preserving the two-tone treatment of the original.
 *
 * Every current placement sits on a dark surface, so there is one variant.
 * Add a light variant here if the lockup is ever used on the cream section.
 */
export function Logo({
  className = '',
  showWordmark = true,
  markSize = 42,
}: {
  className?: string;
  showWordmark?: boolean;
  markSize?: number;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Image
        src="/brand/mark.png"
        alt=""
        width={markSize}
        height={Math.round((markSize * 394) / 563)}
        /* Deliberately not priority. It is 16KB and above the fold, but
           preloading it competes with the hero image, which is the LCP
           element and matters far more. */
        className="shrink-0"
      />
      {showWordmark && (
        <span className="font-display text-xl font-bold tracking-[-0.03em] leading-none">
          <span className="text-blue-light">VR</span>
          <span className="text-ink">hino</span>
        </span>
      )}
      {/* Only when the wordmark is not shown, otherwise the name is announced twice. */}
      {!showWordmark && <span className="sr-only">VRhino</span>}
    </span>
  );
}
