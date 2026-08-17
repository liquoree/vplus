'use client';

import Link from 'next/link';

import './ErrorPage.scss';

type ErrorPageProps = {
    code: string;
    title: string;
    description?: string;

    onRetry?: () => void;
};

export function ErrorPage({ code, title, description, onRetry }: ErrorPageProps) {
    return (
        <main className="error-page">
            <div className="error-page__container">
                <div className="error-page__code">{code}</div>

                <h1 className="error-page__title">{title}</h1>

                {description && <p className="error-page__description">{description}</p>}

                <div className="error-page__actions">
                    {onRetry && (
                        <button className="error-page__button" type="button" onClick={onRetry}>
                            Повторить
                        </button>
                    )}

                    <Link className="error-page__link" href="/">
                        На главную
                    </Link>
                </div>
            </div>
        </main>
    );
}
