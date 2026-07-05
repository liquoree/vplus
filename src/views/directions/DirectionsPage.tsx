import Image from 'next/image';
import { Footer, Header, HelpCta, TemplateInfoPage } from '@/widgets';
import { DirectionInfoCard } from './direction-info-card/DirectionInfoCard';

import './DirectionsPage.scss';

export function DirectionsPage() {
  return (
    <div className="directions-page">
      <Header />

      <main className="directions-page__main">
        <TemplateInfoPage
          title="Как до нас добраться?"
          description="Рассказываем про способы проезда до базы отдыха"
        >
          <div className="directions-page__content">
            <div className="directions-page__top">
              <section className="directions-page__address">
                <div className="directions-page__address-heading">
                  <Image
                    className="directions-page__address-icon"
                    src="/images/location-pin.svg"
                    alt=""
                    width={32}
                    height={49}
                  />

                  <h2 className="directions-page__address-title">Наш адрес</h2>
                </div>

                <p className="directions-page__address-text">
                  Республика Карелия, Прионежский район, Деревянское сельское поселение,
                  Онежский парк, Большая Прибрежная улица, 1,
                </p>

                <p className="directions-page__address-distance">
                  7 км от Петрозаводска
                </p>
              </section>

              <div className="directions-page__map">
                <Image
                  className="directions-page__map-image"
                  src="/images/directions-map.png"
                  alt="Карта проезда"
                  fill
                  sizes="(max-width: 768px) 100vw, 610px"
                />
              </div>
            </div>

            <div className="directions-page__cards">
              <DirectionInfoCard
                icon="car"
                title="На личном автомобиле"
                description="Асфальтированная дорога, охраняемая парковка на территории"
              />

              <DirectionInfoCard
                icon="bus"
                title="На общественном транспорте"
                description="От автовокзала города Петрозаводска: такси/пригородные автобусы"
              />

              <DirectionInfoCard
                className="directions-page__transfer-card"
                icon="minibus"
                title="Организованный трансфер"
              >
                <div className="directions-page__transfer">
                  <div className="directions-page__transfer-column">
                    <h3 className="directions-page__transfer-title">
                      От автовокзала/жд-вокзала:
                    </h3>

                    <ul className="directions-page__transfer-list">
                      <li>1-2 человека — 750₽</li>
                      <li>3-4 человека — 800₽</li>
                      <li>5-8 человек — 1200₽</li>
                    </ul>
                  </div>

                  <div className="directions-page__transfer-column">
                    <h3 className="directions-page__transfer-title">
                      От аэропорта «Бесовец»:
                    </h3>

                    <ul className="directions-page__transfer-list">
                      <li>1-2 человека — 1200₽</li>
                      <li>3-4 человека — 1500₽</li>
                      <li>5-8 человек — 2000₽</li>
                    </ul>
                  </div>
                </div>
              </DirectionInfoCard>
            </div>

            <HelpCta
              className="directions-page__transfer-cta"
              icon="phone-bubble"
              title={`Хотите заказать трансфер?
            Звоните!`}
              mobileTitle="Хотите заказать трансфер?"
              description={`Телефон 1: +7 (911) 423-86-00
            Телефон 2: +7 (911) 404-73-03`}
              buttonText="Связаться с менеджером"
              href="/contacts"
            />
          </div>
        </TemplateInfoPage>
      </main>

      <Footer />
    </div>
  );
}