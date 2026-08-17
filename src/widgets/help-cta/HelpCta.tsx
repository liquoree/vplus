import Image from 'next/image';
import { Button } from '@/shared/ui';

type HelpCtaProps = {
    icon: string;
    title: string;
    mobileTitle?: string;
    description: string;
    buttonText: string;
    href: string;
    className?: string;
};

export function HelpCta({
    icon,
    title,
    mobileTitle,
    description,
    buttonText,
    href,
    className,
}: HelpCtaProps) {
    return (
        <section className={`help-cta ${className ?? ''}`}>
            <div className="help-cta__text">
                <Image
                    className="help-cta__icon"
                    src={'/images/' + icon + '.svg'}
                    alt=""
                    width={65}
                    height={65}
                />

                <div className="help-cta__heading">
                    <h2 className="help-cta__title">
                        <span className="help-cta__title-desktop">{title}</span>
                        <span className="help-cta__title-mobile">{mobileTitle ?? title}</span>
                    </h2>

                    <p className="help-cta__description">{description}</p>
                </div>
            </div>

            <Button
                as="link"
                href={href}
                text={buttonText}
                variant="hero"
                className="help-cta__button"
            />
        </section>
    );
}
