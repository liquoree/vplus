import Image from 'next/image';
import { Button } from '@/shared/ui';
import type { BookingRequestItem } from '../../model/types';

import './BookingModal.scss';

type BookingModalProps = {
  status: 'success' | 'error';
  bookingItems: BookingRequestItem[];
  totalPrice: number;
  prepaymentPrice: number;
  onClose: () => void;
};

function addHoursToTime(time: string, hours: number) {
  const [startHours, startMinutes] = time.split(':').map(Number);

  if (
    !Number.isFinite(startHours) ||
    !Number.isFinite(startMinutes) ||
    !Number.isFinite(hours)
  ) {
    return time;
  }

  const minutesInDay = 24 * 60;
  const totalMinutes =
    startHours * 60 +
    startMinutes +
    Math.round(hours * 60);

  const normalizedMinutes =
    ((totalMinutes % minutesInDay) + minutesInDay) % minutesInDay;

  const endHours = Math.floor(normalizedMinutes / 60);
  const endMinutes = normalizedMinutes % 60;

  return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
}

function getBookingItemText(item: BookingRequestItem) {
  const program = item.bookingOptionTitle
    ? `${item.catalogItemTitle} — ${item.bookingOptionTitle}`
    : item.catalogItemTitle;

  const endTime = addHoursToTime(item.time, item.hours);

  return `${program}, ${item.date}, с ${item.time} до ${endTime}`;
}

export function BookingModal({
  status,
  bookingItems,
  totalPrice,
  prepaymentPrice,
  onClose,
}: BookingModalProps) {
  const isSuccess = status === 'success';

  return (
    <div className="booking-modal">
      <div className="booking-modal__overlay" />

      <article className="booking-modal__dialog">
        <div className="booking-modal__top">
          <span className="booking-modal__caption">
            Бронирование техники
          </span>

          <button
            className="booking-modal__close"
            type="button"
            aria-label="Закрыть"
            onClick={onClose}
          >
            <Image
              src="/images/close-black.svg"
              alt=""
              width={18}
              height={18}
            />
          </button>
        </div>

        <div className="booking-modal__content">
          <div className="booking-modal__icon">
            <Image
              src={
                isSuccess
                  ? '/images/icons/application-approved.svg'
                  : '/images/icons/application-rejected.svg'
              }
              alt=""
              width={40}
              height={40}
            />
          </div>

          <h2 className="booking-modal__title">
            {isSuccess ? 'Заявка отправлена!' : 'Не удалось отправить заявку'}
          </h2>

          {isSuccess ? (
            <>
              <p className="booking-modal__subtitle">
                Вы бронируете:
              </p>

              <ul className="booking-modal__list">
                {bookingItems.map((item) => (
                  <li
                    className="booking-modal__item"
                    key={`${item.catalogItemId}-${item.bookingOptionId}-${item.date}`}
                  >
                    {getBookingItemText(item)}
                  </li>
                ))}
              </ul>

              <div className="booking-modal__price">
                <p>
                  Итоговая стоимость: <b>{totalPrice.toLocaleString('ru-RU')}₽</b>
                </p>

                <p>
                  Предоплата: <b>{prepaymentPrice.toLocaleString('ru-RU')}₽</b>
                </p>
              </div>
            </>
          ) : (
            <p className="booking-modal__error-text">
              Попробуйте отправить заявку ещё раз или свяжитесь с менеджером.
            </p>
          )}

          <Button
            type="button"
            text="ОК"
            variant="hero"
            className="booking-modal__button"
            onClick={onClose}
          />

          {isSuccess && (
            <p className="booking-modal__hint">
              *если вы ошиблись при выборе, свяжитесь с нашим менеджером:
              +7 (911) 423-86-00
            </p>
          )}
        </div>
      </article>
    </div>
  );
}