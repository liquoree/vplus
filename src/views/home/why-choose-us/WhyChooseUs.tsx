import './WhyChooseUs.scss';

import { InfoCard } from '@/widgets';

const infoCards = [
    {
        icon: 'snowmobile.svg',
        title: 'Отличная\nнадёжная техника',
        mobileTitle: 'Надёжная\nтехника',
        description: 'Современная и регулярно обслуживаемая',
    },
    {
        icon: 'calendar1.svg',
        title: 'Простое\nбронирование',
        mobileTitle: 'Простое бронирование',
        description: 'Быстрое онлайн-бронирование за пару минут',
    },
    {
        icon: 'landscape.svg',
        title: 'Живописные\nмаршруты',
        mobileTitle: 'Живописные лесные\nмаршруты',
        description: 'Красивые маршруты для ярких впечатлений',
    },
    {
        icon: 'helmet.svg',
        title: 'Экипировка в\nкомплекте',
        mobileTitle: 'Экипировка в комплекте',
        description: 'Шлем и всё остальное для вашей безопасности',
    },
];

export const WhyChooseUs = () => {
    return (
        <section className="why-choose-us">
            <div className="why-choose-us__container">
                <h2 className="why-choose-us__title">Почему выбирают нас?</h2>

                <div className="why-choose-us__cards">
                    {infoCards.map((card) => (
                        <InfoCard
                            key={card.icon}
                            icon={card.icon}
                            title={card.title}
                            mobileTitle={card.mobileTitle}
                            description={card.description}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};
