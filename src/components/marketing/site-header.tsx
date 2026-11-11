'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Logo } from '@/components/ui/logo';
import { Button } from '@/components/ui/button';

const nav = [
  { href: '/events', label: 'Events' },
  { href: '/schools', label: 'Schools & youth' },
  { href: '/boxing', label: 'VR boxing' },
  { href: '/our-story', label: 'Our story' },
  { href: '/blog', label: 'Journal' },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);


  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[padding,background-color,border-color] duration-300 ${
        scrolled
          ? 'border-line bg-base/85 py-2 backdrop-blur-xl'
          : 'border-transparent bg-transparent py-4'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link href="/" className="text-ink" aria-label="VRhino home">
          <Logo />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          {nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`relative text-sm font-medium transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:bg-accent after:transition-all after:duration-300 hover:text-ink ${
                  active ? 'text-ink after:w-full' : 'text-muted after:w-0 hover:after:w-full'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button href="/book" className="hidden px-5 py-2.5 sm:inline-flex" punch>
            Book an event
          </Button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink lg:hidden"
          >
            <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
            <svg viewBox="0 0 20 20" className="h-5 w-5" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              {open ? <path d="M5 5l10 10M15 5L5 15" /> : <><path d="M3 6h14" /><path d="M3 10h14" /><path d="M3 14h14" /></>}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Primary mobile" className="border-t border-line bg-base lg:hidden">
          <ul className="mx-auto max-w-7xl px-5 py-3 sm:px-8">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block border-b border-line/60 py-3.5 text-base font-medium text-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="pt-4" onClick={() => setOpen(false)}>
              <Button href="/book" className="w-full">Book an event</Button>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
