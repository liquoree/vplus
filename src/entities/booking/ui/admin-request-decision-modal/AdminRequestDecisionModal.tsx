import Image from 'next/image';
import { useEffect } from 'react';

import type { BookingRequestRecord } from '../../model/types';

import './AdminRequestDecisionModal.scss';

type AdminRequestDecisionModalProps = {
    request: BookingRequestRecord;
    isSubmitting?: boolean;

    onConfirm: () => void;
    onClose: () => void;
};

const MODAL_CONTENT = {
    title: 'Отменить заявку?',
    description:
        'После подтверждения оплата будет возвращена, а выбранное время снова станет доступно для бронирования.',
    confirmText: 'Да, отменить',
    icon: '/images/icons/application-rejected.svg',
    confirmModifier:
        'admin-request-decision-modal__confirm--reject',
};

export function AdminRequestDecisionModal({
                                              request,
                                              isSubmitting = false,
                                              onConfirm,
                                              onClose,
                                          }: AdminRequestDecisionModalProps) {
    useEffect(() => {
        const previousOverflow =
            document.body.style.overflow;

        document.body.style.overflow = 'hidden';

        const handleKeyDown = (
            event: KeyboardEvent,
        ) => {
            if (
                event.key === 'Escape' &&
                !isSubmitting
            ) {
                onClose();
            }
        };

        window.addEventListener(
            'keydown',
            handleKeyDown,
        );

        return () => {
            document.body.style.overflow =
                previousOverflow;

            window.removeEventListener(
                'keydown',
                handleKeyDown,
            );
        };
    }, [isSubmitting, onClose]);

    const handleOverlayClick = () => {
        if (!isSubmitting) {
            onClose();
        }
    };

    return (
        <div className="admin-request-decision-modal">
            <button
                className="admin-request-decision-modal__overlay"
                type="button"
                aria-label="Закрыть окно подтверждения"
                disabled={isSubmitting}
                onClick={handleOverlayClick}
            />

            <section
                className="admin-request-decision-modal__dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="request-decision-title"
                aria-describedby="request-decision-description"
            >
                <button
                    className="admin-request-decision-modal__close"
                    type="button"
                    aria-label="Закрыть"
                    disabled={isSubmitting}
                    onClick={onClose}
                >
                    ×
                </button>

                <div
                    className="admin-request-decision-modal__icon"
                    aria-hidden="true"
                >
                    <Image
                        src={MODAL_CONTENT.icon}
                        alt=""
                        width={52}
                        height={52}
                    />
                </div>

                <h2
                    className="admin-request-decision-modal__title"
                    id="request-decision-title"
                >
                    {MODAL_CONTENT.title}
                </h2>

                <p
                    className="admin-request-decision-modal__description"
                    id="request-decision-description"
                >
                    {MODAL_CONTENT.description}
                </p>

                <div className="admin-request-decision-modal__customer">
                    <strong>
                        {request.customer.name}
                    </strong>

                    <span>
                        {request.customer.phone}
                    </span>

                    <span>
                        {request.customer.email}
                    </span>
                </div>

                <div className="admin-request-decision-modal__details">
                    <span>
                        Позиций в заявке:{' '}
                        <b>
                            {request.items.length}
                        </b>
                    </span>

                    <span>
                        Итоговая стоимость:{' '}
                        <b>
                            {request.totalPrice.toLocaleString(
                                'ru-RU',
                            )}{' '}
                            ₽
                        </b>
                    </span>
                </div>

                <div className="admin-request-decision-modal__actions">
                    <button
                        className="admin-request-decision-modal__cancel"
                        type="button"
                        disabled={isSubmitting}
                        onClick={onClose}
                    >
                        Назад
                    </button>

                    <button
                        className={[
                            'admin-request-decision-modal__confirm',
                            MODAL_CONTENT.confirmModifier,
                        ].join(' ')}
                        type="button"
                        disabled={isSubmitting}
                        onClick={onConfirm}
                    >
                        {isSubmitting
                            ? 'Обработка...'
                            : MODAL_CONTENT.confirmText}
                    </button>
                </div>
            </section>
        </div>
    );
}