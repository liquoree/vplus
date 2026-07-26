'use client';

import { useEffect } from 'react';
import Image from 'next/image';

import type {
  BookingRequestDecision,
  BookingRequestRecord,
} from '../../model/types';

import './AdminRequestDecisionModal.scss';

type AdminRequestDecisionModalProps = {
  request: BookingRequestRecord;
  decision: BookingRequestDecision;
  isSubmitting?: boolean;

  onConfirm: () => void;
  onClose: () => void;
};

export function AdminRequestDecisionModal({
  request,
  decision,
  isSubmitting = false,
  onConfirm,
  onClose,
}: AdminRequestDecisionModalProps) {
  const isApprove = decision === 'approved';

  useEffect(() => {
    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    const handleKeyDown = (
      event: KeyboardEvent
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
      handleKeyDown
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        'keydown',
        handleKeyDown
      );
    };
  }, [isSubmitting, onClose]);

  const handleOverlayClick = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <div
      className="admin-request-decision-modal"
      role="presentation"
    >
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
            src={
              isApprove
                ? '/images/icons/application-approved.svg'
                : '/images/icons/application-rejected.svg'
            }
            alt=""
            width={52}
            height={52}
          />
        </div>

        <h2
          className="admin-request-decision-modal__title"
          id="request-decision-title"
        >
          {isApprove
            ? 'Одобрить заявку?'
            : 'Отклонить заявку?'}
        </h2>

        <p
          className="admin-request-decision-modal__description"
          id="request-decision-description"
        >
          {isApprove
            ? 'После подтверждения выбранное время останется занятым.'
            : 'После подтверждения выбранное время снова станет доступно для бронирования.'}
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
            <b>{request.items.length}</b>
          </span>

          <span>
            Итоговая стоимость:{' '}
            <b>
              {request.totalPrice.toLocaleString(
                'ru-RU'
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
            Отмена
          </button>

          <button
            className={[
              'admin-request-decision-modal__confirm',
              isApprove
                ? 'admin-request-decision-modal__confirm--approve'
                : 'admin-request-decision-modal__confirm--reject',
            ].join(' ')}
            type="button"
            disabled={isSubmitting}
            onClick={onConfirm}
          >
            {isSubmitting
              ? 'Обработка...'
              : isApprove
                ? 'Да, одобрить'
                : 'Да, отклонить'}
          </button>
        </div>
      </section>
    </div>
  );
}