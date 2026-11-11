import Link from 'next/link';

type Variant = 'accent' | 'outline' | 'ghost';

const base =
  'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold tracking-tight transition-[transform,background-color,border-color] duration-200 disabled:cursor-not-allowed disabled:opacity-55';

/* Navy on accent is 6.24:1. White on accent is 2.85:1 and fails AA, so it is
   never used. Verified with a contrast script, not by eye. */
const variants: Record<Variant, string> = {
  accent: 'bg-accent text-base hover:bg-accent-dark',
  outline: 'border border-line bg-surface/60 text-ink hover:border-blue hover:bg-surface',
  ghost: 'text-ink hover:text-accent',
};

export function Button({
  href,
  variant = 'accent',
  className = '',
  punch = false,
  children,
  ...rest
}: {
  href?: string;
  variant?: Variant;
  className?: string;
  /** The signature recoil: the button takes the hit rather than lifting. */
  punch?: boolean;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const cls = `${base} ${variants[variant]} ${punch ? 'js-punch' : ''} ${className}`;
  if (href) {
    return (
      <Link href={href} className={cls} data-punch={punch ? 'true' : undefined}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cls} data-punch={punch ? 'true' : undefined} {...rest}>
      {children}
    </button>
  );
}
