'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/shared/lib/cn';

import './AdminNavigation.scss';

const navigationItems = [
  {
    label: 'Заявки',
    href: '/admin/requests',
  },
  {
    label: 'Каталог',
    href: '/admin/catalog',
  },
];

function isNavigationItemActive(
  pathname: string,
  href: string
) {
  if (href === '/admin/catalog') {
    return pathname.startsWith('/admin/catalog');
  }

  return pathname === href;
}

export function AdminNavigation() {
  const pathname = usePathname();

  return (
    <nav
      className="admin-navigation"
      aria-label="Разделы админ-панели"
    >
      {navigationItems.map((item) => {
        const isActive =
          isNavigationItemActive(
            pathname,
            item.href
          );

        return (
          <Link
            className={cn(
              'admin-navigation__link',
              isActive &&
                'admin-navigation__link--active'
            )}
            href={item.href}
            aria-current={
              isActive ? 'page' : undefined
            }
            key={item.href}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}