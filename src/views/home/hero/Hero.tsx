import './Hero.scss';

import { Button } from '@/shared/ui';

export const Hero = () => {
  return (
    <section className="hero">
      <div className="hero__image" aria-hidden="true" />

      <div className="hero__content">
        <h1 className="hero__title">
          Аренда техники для активного отдыха в Карелии
        </h1>

        <p className="hero__text">
          Незабываемые эмоции. Настоящая свобода.
          <br />
          Покори Карелию вместе с нами!
        </p>

        <Button
          as="link"
          href="/booking"
          text="Забронировать"
          variant="hero"
          className="hero__button"
        />
      </div>
    </section>
  );
};