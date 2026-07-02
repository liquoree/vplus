import './HowRent.scss';

import { InfoCard } from '@/widgets';

const rentSteps = [
  {
    icon: 'choose.svg',
    title: 'Выберите технику',
    mobileTitle: 'Выберите технику,\nознакомившись с\nкаталогом',
    description: 'Перед этим ознакомьтесь с\nкаталогом!',
  },
  {
    icon: 'date.svg',
    title: 'Назначьте\nдату и время',
    mobileTitle: 'Назначьте удобную\nдля вас дату и время',
    description: 'Укажите удобные вам дату и\nвремя аренды',
  },
  {
    icon: 'payment.svg',
    title: 'Внесите онлайн-\nпредоплату',
    mobileTitle: 'Внесите онлайн-\nпредоплату',
    description: 'Оплатите половину стоимости\nпо ссылке на вашем email',
  },
  {
    icon: 'confirm.svg',
    title: 'Приезжайте\nкататься',
    mobileTitle: 'Приезжайте кататься,\nмы подготовим всю\nтехнику для вас',
    description: 'Мы подготовим технику к\nвашему приезду',
  },
];

export const HowRent = () => {
  return (
    <section className="how-rent">
      <div className="how-rent__container">
        <h2 className="how-rent__title">Как арендовать?</h2>

        <div className="how-rent__steps">
          {rentSteps.map((step, index) => (
            <div className="how-rent__step" key={step.icon}>
              <InfoCard
                icon={step.icon}
                title={step.title}
                mobileTitle={step.mobileTitle}
                description={step.description}
                stepNumber={index + 1}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};