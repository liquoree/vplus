'use client';

import Link from 'next/link';
import { cn } from '@/shared/lib/cn';

import './Button.scss';

type BaseButtonProps = {
    variant?: 'mid' | 'hero';
    text?: string;
    className?: string;
    onClick?: () => void;
    isDisabled?: boolean;
    isLoading?: boolean;
};

type ButtonAsButtonProps = BaseButtonProps & {
    as?: 'button';
    type?: 'button' | 'submit' | 'reset';
};

type ButtonAsLinkProps = BaseButtonProps & {
    as: 'link';
    href: string;
};

type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

export function Button(props: ButtonProps) {
    const { className, text = 'Текст', variant = 'mid', onClick, isDisabled, isLoading } = props;

    const content = isLoading ? 'Загрузка...' : text;

    const buttonClassName = cn('ui-button', 'ui-button--' + variant, className);

    if (props.as === 'link') {
        return (
            <Link
                href={props.href}
                className={buttonClassName}
                onClick={(event) => {
                    if (isDisabled || isLoading) {
                        event.preventDefault();
                        return;
                    }

                    onClick?.();
                }}
            >
                <span>{content}</span>
            </Link>
        );
    }

    return (
        <button
            className={buttonClassName}
            type={props.type ?? 'button'}
            onClick={onClick}
            disabled={isDisabled || isLoading}
        >
            <span>{content}</span>
        </button>
    );
}
