import Image from 'next/image';
import { Footer, Header, TemplateInfoPage } from '@/widgets';
import './AboutPage.scss';
import { isExternal } from 'util/types';

const advantages = [
  'Отличная техника',
  'Экстремальные или спокойные прогулки',
  'Обучение, практика, инструкторы',
];

const contacts = [
  {
    icon: '/images/icons/phone.svg',
    text: '+7 (911) 404-73-03',
    href: 'tel:+79114047303',
  },
  {
    icon: '/images/icons/vk.svg',
    text: 'https://vk.com/vezdehodptz',
    href: 'https://vk.com/vezdehodptz',
    isExternal: true,
  },
  {
    icon: '/images/icons/email.svg',
    text: 'Vezdehodplus@yandex.ru',
    href: 'mailto:Vezdehodplus@yandex.ru',
    isExternal: true,
  }
];

export function AboutPage() {
  return (
    <div className="about-page">
      <Header />

      <main className="about-page__main">
        <TemplateInfoPage
          title="О нас"
          description="Что мы за компания?"
        >
          <div className="about-page__content">
            <div className="about-page__info">
              <section className="about-page__card">
                <h2 className="about-page__card-title">
                  ВЕЗДЕХОД+ Карелия
                </h2>

                <p className="about-page__text">
                  Прокат спецтехники для активного отдыха. Экстрим, прогулки,
                  обучение и практика. Опытные инструкторы и снаряжение для
                  ярких и безопасных впечатлений.
                </p>

                <ul className="about-page__advantages">
                  {advantages.map((advantage) => (
                    <li
                      className="about-page__advantage"
                      key={advantage}
                    >
                      <Image
                        className="about-page__advantage-icon"
                        src="/images/icons/checkmark.svg"
                        alt=""
                        width={24}
                        height={24}
                      />

                      <span>{advantage}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="about-page__card">
                <h2 className="about-page__card-title">
                  Контакты
                </h2>

                <div className="about-page__contacts">
                  {contacts.map((contact) => (
                    <a
                      className="about-page__contact"
                      href={contact.href}
                      target={contact.isExternal ? '_blank' : undefined}
                      rel={contact.isExternal ? 'noreferrer' : undefined}
                      key={contact.text}
                    >
                      <Image
                        className="about-page__contact-icon"
                        src={contact.icon}
                        alt=""
                        width={24}
                        height={24}
                      />

                      <span>{contact.text}</span>
                    </a>
                  ))}

                  <address className="about-page__contact about-page__address">
                    <Image
                      className="about-page__contact-icon"
                      src="/images/icons/loc.svg"
                      alt=""
                      width={24}
                      height={24}
                    />

                    <span>
                      Республика Карелия, Прионежский район,
                      Деревянское сельское поселение, Онежский парк,
                      Большая Прибрежная улица, 1,
                    </span>
                  </address>
                </div>
              </section>
            </div>

            <div className="about-page__photo">
              <Image
                className="about-page__photo-image"
                src="/images/about-main.jpg"
                alt="Отдых на снегоходе в Карелии"
                fill
                sizes="(max-width: 940px) 100vw, 700px"
                priority
              />
            </div>
          </div>
        </TemplateInfoPage>
      </main>

      <Footer />
    </div>
  );
}