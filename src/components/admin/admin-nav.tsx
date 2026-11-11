'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/admin/posts', label: 'Posts' },
  { href: '/admin/enquiries', label: 'Enquiries' },
  { href: '/admin/settings', label: 'Settings' },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin" className="px-3 pb-4 lg:px-3">
      <ul className="flex gap-1 lg:flex-col">
        {links.map((l) => {
          const active = pathname === l.href || pathname.startsWith(`${l.href}/`);
          return (
            <li key={l.href}>
              <Link
                href={l.href}
                aria-current={active ? 'page' : undefined}
                className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                  active ? 'bg-surface-2 font-medium text-ink' : 'text-muted hover:bg-surface-2/60 hover:text-ink'
                }`}
              >
                {l.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
