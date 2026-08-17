'use client';

import Image from 'next/image';
import { useEffect } from 'react';

import './CatalogItemDeleteModal.scss';

type CatalogItemDeleteModalProps = {
    itemTitle: string;
    isDeleting?: boolean;
    error?: string;
    onConfirm: () => void;
    onClose: () => void;
};

export function CatalogItemDeleteModal({
    itemTitle,
    isDeleting = false,
    error,
    onConfirm,
    onClose,
}: CatalogItemDeleteModalProps) {
    useEffect(() => {
        const previousOverflow = document.body.style.overflow;

        document.body.style.overflow = 'hidden';

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && !isDeleting) {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;

            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isDeleting, onClose]);

    const handleOverlayClick = () => {
        if (!isDeleting) {
            onClose();
        }
    };

    return (
        <div className="catalog-item-delete-modal">
            <button
                className="catalog-item-delete-modal__overlay"
                type="button"
                aria-label="Закрыть окно подтверждения"
                disabled={isDeleting}
                onClick={handleOverlayClick}
            />

            <section
                className="catalog-item-delete-modal__dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="catalog-delete-title"
                aria-describedby="catalog-delete-description"
            >
                <button
                    className="catalog-item-delete-modal__close"
                    type="button"
                    aria-label="Закрыть"
                    disabled={isDeleting}
                    onClick={onClose}
                >
                    ×
                </button>

                <Image
                    className="catalog-item-delete-modal__icon"
                    src="/images/icons/application-rejected.svg"
                    alt=""
                    width={52}
                    height={52}
                    aria-hidden="true"
                />

                <h2 className="catalog-item-delete-modal__title" id="catalog-delete-title">
                    Удалить товар?
                </h2>

                <p
                    className="catalog-item-delete-modal__description"
                    id="catalog-delete-description"
                >
                    Позиция «{itemTitle}» и связанные с ней опции бронирования будут удалены.
                </p>

                {error && (
                    <p className="catalog-item-delete-modal__error" role="alert">
                        {error}
                    </p>
                )}

                <div className="catalog-item-delete-modal__actions">
                    <button
                        className="catalog-item-delete-modal__cancel"
                        type="button"
                        disabled={isDeleting}
                        onClick={onClose}
                    >
                        Отмена
                    </button>

                    <button
                        className="catalog-item-delete-modal__confirm"
                        type="button"
                        disabled={isDeleting}
                        onClick={onConfirm}
                    >
                        {isDeleting ? 'Удаление...' : 'Удалить'}
                    </button>
                </div>
            </section>
        </div>
    );
}
