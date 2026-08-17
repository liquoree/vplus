'use client';

import Image from 'next/image';
import { useEffect } from 'react';

import type { BookingRequestDecision, BookingRequestRecord } from '../../model/types';

import './AdminRequestDecisionModal.scss';

type AdminRequestDecisionModalProps = {
    request: BookingRequestRecord;
    decision: BookingRequestDecision;
    isSubmitting?: boolean;

    onConfirm: () => void;
    onClose: () => void;
};

function getModalContent(decision: BookingRequestDecision) {
    if (decision === 'approved') {
        return {
            title: 'Одобрить заявку?',
            description: 'После подтверждения выбранное время останется занятым.',
            confirmText: 'Да, одобрить',
            icon: '/images/icons/application-approved.svg',
            confirmModifier: 'admin-request-decision-modal__confirm--approve',
        };
    }

    if (decision === 'cancelled') {
        return {
            title: 'Отменить одобренную заявку?',
            description:
                'После подтверждения выбранное время снова станет доступно для бронирования.',
            confirmText: 'Да, отменить',
            icon: '/images/icons/application-rejected.svg',
            confirmModifier: 'admin-request-decision-modal__confirm--reject',
        };
    }

    return {
        title: 'Отклонить заявку?',
        description: 'После подтверждения выбранное время снова станет доступно для бронирования.',
        confirmText: 'Да, отклонить',
        icon: '/images/icons/application-rejected.svg',
        confirmModifier: 'admin-request-decision-modal__confirm--reject',
    };
}

export function AdminRequestDecisionModal({
    request,
    decision,
    isSubmitting = false,
    onConfirm,
    onClose,
}: AdminRequestDecisionModalProps) {
    const content = getModalContent(decision);

    useEffect(() => {
        const previousOverflow = document.body.style.overflow;

        document.body.style.overflow = 'hidden';

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && !isSubmitting) {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;

            window.removeEventListener('keydown', handleKeyDown);
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

                <div className="admin-request-decision-modal__icon" aria-hidden="true">
                    <Image src={content.icon} alt="" width={52} height={52} />
                </div>

                <h2 className="admin-request-decision-modal__title" id="request-decision-title">
                    {content.title}
                </h2>

                <p
                    className="admin-request-decision-modal__description"
                    id="request-decision-description"
                >
                    {content.description}
                </p>

                <div className="admin-request-decision-modal__customer">
                    <strong>{request.customer.name}</strong>

                    <span>{request.customer.phone}</span>

                    <span>{request.customer.email}</span>
                </div>

                <div className="admin-request-decision-modal__details">
                    <span>
                        Позиций в заявке: <b>{request.items.length}</b>
                    </span>

                    <span>
                        Итоговая стоимость: <b>{request.totalPrice.toLocaleString('ru-RU')} ₽</b>
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
                            content.confirmModifier,
                        ].join(' ')}
                        type="button"
                        disabled={isSubmitting}
                        onClick={onConfirm}
                    >
                        {isSubmitting ? 'Обработка...' : content.confirmText}
                    </button>
                </div>
            </section>
        </div>
    );
}
