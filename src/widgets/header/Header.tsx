'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui';

import './Header.scss';

const navItems = [
  { href: '/', label: 'Главная' },
  { href: '/catalog', label: 'Каталог' },
  { href: '/directions', label: 'Как добраться' },
  { href: '/about', label: 'О нас' },
];

type HeaderProps = {
  mobileTitle?: string;
};

export function Header({
  mobileTitle,
}: HeaderProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const activeItem =
    navItems.find((item) =>
      item.href === '/'
        ? pathname === '/'
        : pathname.startsWith(item.href)
    ) ?? navItems[0];

  const resolvedMobileTitle =
    mobileTitle ?? activeItem.label;

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <header className="header">
      <div className="header__desktop">
        <Link className="header__logo" href="/">
          <Image
            src="/images/logo.svg"
            alt="ВЕЗДЕХОД+ Карелия"
            width={65}
            height={43}
            priority
          />
        </Link>

        <nav className="header__nav">
          {navItems.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'header__link',
                  isActive &&
                    'header__link--active'
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Button
          as="link"
          href="/booking"
          text="Забронировать"
          variant="mid"
          className="header__booking"
        />
      </div>

      <div className="header__mobile">
        <Image
          className={cn(
            'header__burger',
            isOpen && 'header__burger--open'
          )}
          src="/images/menu.svg"
          alt="Меню"
          width={26}
          height={18}
          onClick={() =>
            setIsOpen((value) => !value)
          }
        />

        <span className="header__mobile-title">
          {resolvedMobileTitle}
        </span>

        <Link
          className="header__mobile-logo"
          href="/"
          onClick={closeMenu}
        >
          <Image
            src="/images/logo.svg"
            alt="ВЕЗДЕХОД+ Карелия"
            width={50}
            height={33}
            priority
          />
        </Link>
      </div>

      <div
        className={cn(
          'header__mobile-menu',
          isOpen &&
            'header__mobile-menu--open'
        )}
      >
        <nav className="header__mobile-nav">
          {navItems.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'header__mobile-link',
                  isActive &&
                    'header__mobile-link--active'
                )}
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="header__mobile-actions">
          <a
            className="header__call"
            href="tel:+79114238600"
          >
            Позвонить
          </a>

          <Button
            as="link"
            href="/booking"
            text="Забронировать"
            variant="mid"
            className="header__booking header__booking--mobile"
            onClick={closeMenu}
          />
        </div>
      </div>
    </header>
  );
}