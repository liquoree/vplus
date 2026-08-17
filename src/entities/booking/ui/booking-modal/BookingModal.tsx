import Image from 'next/image';

import { Button } from '@/shared/ui';
import type { BookingRequestItem } from '../../model/types';

import './BookingModal.scss';

type BookingModalProps = {
    status: 'success' | 'error';
    bookingItems: BookingRequestItem[];

    totalPrice: number;
    prepaymentPrice: number;

    errorMessage?: string | null;

    onClose: () => void;
};

function addMinutesToTime(time: string, durationMinutes: number) {
    const [startHours, startMinutes] = time.split(':').map(Number);

    if (
        !Number.isFinite(startHours) ||
        !Number.isFinite(startMinutes) ||
        !Number.isFinite(durationMinutes)
    ) {
        return time;
    }

    const minutesInDay = 24 * 60;

    const totalMinutes = startHours * 60 + startMinutes + durationMinutes;

    const normalizedMinutes = ((totalMinutes % minutesInDay) + minutesInDay) % minutesInDay;

    const endHours = Math.floor(normalizedMinutes / 60);

    const endMinutes = normalizedMinutes % 60;

    return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
}

function formatBookingDate(dateValue: string) {
    const date = new Date(`${dateValue}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
        return dateValue;
    }

    return date.toLocaleDateString('ru-RU');
}

function getBookingItemText(item: BookingRequestItem) {
    const program = [item.bookableItemTitle, item.serviceTitle, item.bookingOptionTitle]
        .filter(Boolean)
        .join(' — ');

    const endTime = addMinutesToTime(item.time, item.durationMinutes);

    return `${program}, ${formatBookingDate(item.date)}, с ${item.time} до ${endTime}`;
}

export function BookingModal({
    status,
    bookingItems,
    totalPrice,
    prepaymentPrice,
    errorMessage,
    onClose,
}: BookingModalProps) {
    const isSuccess = status === 'success';

    return (
        <div className="booking-modal">
            <div className="booking-modal__overlay" />

            <article className="booking-modal__dialog">
                <div className="booking-modal__top">
                    <span className="booking-modal__caption">Бронирование техники</span>

                    <button
                        className="booking-modal__close"
                        type="button"
                        aria-label="Закрыть"
                        onClick={onClose}
                    >
                        <Image src="/images/close-black.svg" alt="" width={18} height={18} />
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
                            <p className="booking-modal__subtitle">Вы бронируете:</p>

                            <ul className="booking-modal__list">
                                {bookingItems.map((item) => (
                                    <li
                                        className="booking-modal__item"
                                        key={[
                                            item.bookableItemId,
                                            item.bookingOptionId,
                                            item.date,
                                            item.time,
                                        ].join('-')}
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
                            {errorMessage ??
                                'Попробуйте отправить заявку ещё раз или свяжитесь с менеджером.'}
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
                            *если вы ошиблись при выборе, свяжитесь с нашим менеджером: +7 (911)
                            404-73-03
                        </p>
                    )}
                </div>
            </article>
        </div>
    );
}
