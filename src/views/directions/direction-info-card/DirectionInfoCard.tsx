import Image from 'next/image';

import './DirectionInfoCard.scss';

type DirectionInfoCardProps = {
    icon: string;
    title: string;
    description?: string;
    children?: React.ReactNode;
    variant?: 'dark' | 'light';
    className?: string;
};

export function DirectionInfoCard({
    icon,
    title,
    description,
    children,
    variant = 'dark',
    className,
}: DirectionInfoCardProps) {
    return (
        <section
            className={`direction-info-card direction-info-card--${variant} ${className ?? ''}`}
        >
            <Image
                className="direction-info-card__icon"
                src={`/images/${icon}.svg`}
                alt=""
                width={70}
                height={70}
            />

            <div className="direction-info-card__content">
                <h2 className="direction-info-card__title">{title}</h2>

                {description && <p className="direction-info-card__description">{description}</p>}

                {children}
            </div>
        </section>
    );
}
