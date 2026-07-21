import Image from 'next/image';
import Link from 'next/link';

import './Footer.scss';

const menuLinks = [
  { label: 'Главная', href: '/' },
  { label: 'Каталог', href: '/catalog' },
  { label: 'Как добраться', href: '/directions' },
  { label: 'О нас', href: '/about' },
];

const techniqueLinks = [
  { label: 'Квадроциклы', href: '/catalog' },
  { label: 'Снегоходы', href: '/catalog' },
  { label: 'Лодки', href: '/catalog' },
  { label: 'Другое', href: '/catalog' },
];

const companyLinks = [
  { label: 'О нас', href: '/about' },
  { label: 'Условия аренды', href: '/booking-terms' },
  { label: 'Политика конфиденциальности', href: '/privacy' },
  { label: 'Пользовательское соглашение', href: '/agreement' },
];

const contacts = [
  {
    label: '+7 (911) 423-86-00',
    href: 'tel:+79114238600',
    icon: '/images/icons/phone.svg',
  },
  {
    label: '+7 (911) 404-73-03',
    href: 'tel:+79114047303',
    icon: '/images/icons/phone.svg',
  },
  {
    label: 'https://vk.com/vezdehodptz',
    href: 'https://vk.com/vezdehodptz',
    icon: '/images/icons/vk.svg',
  },
];

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <Link href="/" className="footer__logo">
            <Image
              src="/images/logo.svg"
              alt="ВЕЗДЕХОД+ Карелия"
              width={115}
              height={60}
            />
          </Link>

          <p className="footer__copyright">
            © 2026 Вездеход+ Карелия.
            <br />
            Все права защищены.
          </p>
        </div>

        <div className="footer__column">
          <h3 className="footer__title">Меню</h3>
          <nav className="footer__links">
            {menuLinks.map((link) => (
              <Link href={link.href} className="footer__link" key={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="footer__column">
          <h3 className="footer__title">Техника</h3>
          <nav className="footer__links">
            {techniqueLinks.map((link) => (
              <Link href={link.href} className="footer__link" key={link.label}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="footer__column footer__column--company">
          <h3 className="footer__title">Компания</h3>
          <nav className="footer__links">
            {companyLinks.map((link) => (
              <Link href={link.href} className="footer__link" key={link.label}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="footer__column footer__column--contacts">
          <h3 className="footer__title">Свяжитесь с нами</h3>

          <div className="footer__contacts">
            {contacts.map((contact) => (
              <a href={contact.href} className="footer__contact" key={contact.href}>
                <Image
                  src={contact.icon}
                  alt=""
                  width={25}
                  height={25}
                  className="footer__contact-icon"
                />
                <span>{contact.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}