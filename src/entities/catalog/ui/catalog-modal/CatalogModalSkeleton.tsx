import Link from 'next/link';

import './CatalogModalSkeleton.scss';

export function CatalogModalSkeleton() {
    return (
        <div className="catalog-modal-skeleton">
            <div className="catalog-modal-skeleton__overlay" />

            <article className="catalog-modal-skeleton__dialog">
                <Link
                    className="catalog-modal-skeleton__close"
                    href="/catalog"
                    aria-label="Закрыть"
                >
                    ×
                </Link>

                <div className="catalog-modal-skeleton__gallery">
                    <span>Загрузка...</span>
                </div>

                <div className="catalog-modal-skeleton__body">
                    <div className="catalog-modal-skeleton__title-row">
                        <div className="catalog-modal-skeleton__title" />
                        <div className="catalog-modal-skeleton__badge" />
                    </div>

                    <div className="catalog-modal-skeleton__price-row">
                        <div className="catalog-modal-skeleton__price" />
                        <div className="catalog-modal-skeleton__status" />
                    </div>

                    <div className="catalog-modal-skeleton__line catalog-modal-skeleton__line--wide" />
                    <div className="catalog-modal-skeleton__line catalog-modal-skeleton__line--medium" />

                    <div className="catalog-modal-skeleton__divider" />

                    <div className="catalog-modal-skeleton__subtitle" />
                    <div className="catalog-modal-skeleton__line catalog-modal-skeleton__line--wide" />

                    <div className="catalog-modal-skeleton__actions">
                        <div className="catalog-modal-skeleton__button" />
                        <div className="catalog-modal-skeleton__button catalog-modal-skeleton__button--gray" />
                    </div>
                </div>
            </article>
        </div>
    );
}
