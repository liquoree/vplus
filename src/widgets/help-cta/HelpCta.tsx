import Image from 'next/image';
import { Button } from '@/shared/ui';

type HelpCtaProps = {
  icon: string;
  title: string;
  description: string;
  buttonText: string;
  href: string;
};

export function HelpCta({
  icon,
  title,
  description,
  buttonText,
  href,
}: HelpCtaProps) {
  return (
    <section className="help-cta">
        <div className="help-cta__text">
            <Image
                className="help-cta__icon"
                src={'/images/' + icon + '.svg'}
                alt=""
                width={65}
                height={65}
            />
            <div className="help-cta__heading">
                <h2 className="help-cta__title">{title}</h2>
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