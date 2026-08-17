import Image from 'next/image';

import './InfoCard.scss';

type InfoCardProps = {
    icon: string;
    title: string;
    mobileTitle?: string;
    description: string;
    stepNumber?: number;
};

export const InfoCard = ({ icon, title, mobileTitle, description, stepNumber }: InfoCardProps) => {
    return (
        <article className="info-card">
            {stepNumber && <span className="info-card__step">{stepNumber}</span>}

            <div className="info-card__icon-wrapper" aria-hidden="true">
                <Image
                    className="info-card__icon"
                    src={`/images/icons/${icon}`}
                    alt=""
                    fill
                    sizes="(max-width: 767px) 124px, 205px"
                />
            </div>

            <div className="info-card__content">
                <h3 className="info-card__title">
                    <span className="info-card__title-desktop">{title}</span>
                    <span className="info-card__title-mobile">{mobileTitle ?? title}</span>
                </h3>

                <p className="info-card__description">{description}</p>
            </div>
        </article>
    );
};
