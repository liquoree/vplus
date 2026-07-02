import Image from 'next/image';
import { Button } from '@/shared/ui';
import './WhereUs.scss';

const contacts = [
  {
    icon: '/images/icons/phone.svg',
    text: '+7 (911) 423-86-00',
    href: 'tel:+79114238600',
  },
  {
    icon: '/images/icons/phone.svg',
    text: '+7 (911) 404-73-03',
    href: 'tel:+79114047303',
  },
  {
    icon: '/images/icons/loc.svg',
    text: 'Республика Карелия, Прионежский район, Деревянское сельское поселение, Онежский парк, Большая Прибрежная улица, 1,',
  },
];

const advantages = [
  '10 минут от города',
  'В любой сезон',
  'Охраняемая парковка',
];

export function WhereUs() {
  return (
    <section className="where-us">
      <div className="where-us__inner">
        <h2 className="where-us__title">Где мы находимся?</h2>

        <div className="where-us__content">
          <div className="where-us__contacts">
            {contacts.map((item) => {
              const content = (
                <>
                  <Image
                    src={item.icon}
                    alt=""
                    width={25}
                    height={25}
                    className="where-us__icon"
                  />
                  <span>{item.text}</span>
                </>
              );

              return item.href ? (
                <a className="where-us__item" href={item.href} key={item.text}>
                  {content}
                </a>
              ) : (
                <div className="where-us__item" key={item.text}>
                  {content}
                </div>
              );
            })}
          </div>

          <div className="where-us__map">
            <span>(подгрузка локации с Я.Карты)</span>
          </div>

          <div className="where-us__info">
            <div className="where-us__advantages">
              {advantages.map((text) => (
                <div className="where-us__item" key={text}>
                  <Image
                    src="/images/icons/checkmark.svg"
                    alt=""
                    width={25}
                    height={25}
                    className="where-us__icon"
                  />
                  <span>{text}</span>
                </div>
              ))}
            </div>

            <Button
              as="link"
              href="/directions"
              text="Как добраться?"
              variant="hero"
              className="where-us__button"
            />
          </div>
        </div>
      </div>
    </section>
  );
}