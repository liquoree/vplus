import type { FormEvent } from 'react';
import { useMemo, useState, useEffect } from 'react';


import {
    buildBookingItems,
    getBookingLinePrice,
} from '../lib/booking-catalog';

import {
    getPaymentStatusMock,
    startPayment,
} from '@/entities/payment';

import {
    getMaxBookingDateValue,
    getTodayDateValue,
} from '../lib/booking-date';

import { useBookingAvailability } from './internal/useBookingAvailability';
import { useBookingCaptcha } from './internal/useBookingCaptcha';
import { useBookingContacts } from './internal/useBookingContacts';
import { useBookingLines } from './internal/useBookingLines';
import { useBookingModal } from './internal/useBookingModal';

import type { BookingPageProps } from './types';

type PendingBookingSnapshot = {
    bookingItems: ReturnType<typeof buildBookingItems>;
    totalPrice: number;
    prepaymentPrice: number;
};

export function useBookingForm({
                                   items,
                                   bookingOptions,
                                   initialVehicleSlug,
                                   initialServiceSlug,
                                   initialPackageSlug,
                               }: BookingPageProps) {
    // { start-mock
    const PENDING_BOOKING_KEY = 'pending-booking';

    function savePendingBooking(
        snapshot: PendingBookingSnapshot,
    ) {
        sessionStorage.setItem(
            PENDING_BOOKING_KEY,
            JSON.stringify(snapshot),
        );
    }

    function getPendingBooking(): PendingBookingSnapshot | null {
        const value = sessionStorage.getItem(
            PENDING_BOOKING_KEY,
        );

        if (!value) {
            return null;
        }

        try {
            return JSON.parse(value) as PendingBookingSnapshot;
        } catch {
            return null;
        }
    }

    function clearPendingBooking() {
        sessionStorage.removeItem(PENDING_BOOKING_KEY);
    }


    // end-mock }

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    const availability =
        useBookingAvailability(bookingOptions);

    const lines = useBookingLines({
        items,
        bookingOptions,

        initialVehicleSlug,
        initialServiceSlug,
        initialPackageSlug,

        loadAvailability:
        availability.loadAvailability,

        clearAvailability:
        availability.clearAvailability,

        removeAvailability:
        availability.removeAvailability,
    });

    const contacts = useBookingContacts();
    const captcha = useBookingCaptcha();
    const modal = useBookingModal();

    const totalPrice = useMemo(() => {
        return lines.bookingLines.reduce(
            (total, line) =>
                total +
                getBookingLinePrice(
                    line,
                    bookingOptions,
                ),
            0,
        );
    }, [lines.bookingLines, bookingOptions]);

    const prepaymentPrice =
        Math.ceil(totalPrice * 0.2);

    const minDate = getTodayDateValue();
    const maxDate = getMaxBookingDateValue();

    useEffect(() => {
        const url = new URL(window.location.href);

        const isPaymentReturn =
            url.searchParams.get('paymentReturn') === '1';

        const paymentId =
            url.searchParams.get('paymentId');

        if (!isPaymentReturn || !paymentId) {
            return;
        }

        const handlePaymentReturn = async () => {
            setIsSubmitting(true);

            try {
                const payment =
                    await getPaymentStatusMock(paymentId);

                const pendingBooking =
                    getPendingBooking();

                if (!pendingBooking) {
                    modal.openError(
                        'Не удалось получить данные заявки.',
                    );

                    return;
                }

                if (payment.status === 'paid') {
                    modal.openSuccess(
                        pendingBooking.bookingItems,
                        pendingBooking.totalPrice,
                        pendingBooking.prepaymentPrice,
                    );

                    clearPendingBooking();

                    return;
                }

                if (
                    payment.status === 'failed' ||
                    payment.status === 'canceled'
                ) {
                    modal.openError(
                        'Не удалось отправить заявку.',
                    );

                    clearPendingBooking();
                }
            } catch {
                modal.openError(
                    'Не удалось проверить результат оплаты.',
                );
            } finally {
                setIsSubmitting(false);

                url.searchParams.delete(
                    'paymentReturn',
                );

                url.searchParams.delete(
                    'paymentId',
                );

                window.history.replaceState(
                    {},
                    '',
                    `${url.pathname}${url.search}${url.hash}`,
                );
            }
        };

        void handlePaymentReturn();
    }, []);

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        if (isSubmitting) {
            return;
        }

        const areBookingLinesValid =
            lines.validate();

        const areContactsValid =
            contacts.validate();

        if (
            !areBookingLinesValid ||
            !areContactsValid
        ) {
            return;
        }

        const captchaToken = captcha.validate();

        if (!captchaToken) {
            return;
        }

        const bookingItems = buildBookingItems(
            lines.bookingLines,
            items,
            bookingOptions,
        );

        setIsSubmitting(true);

        try {
            savePendingBooking({
                bookingItems,
                totalPrice,
                prepaymentPrice,
            });

            await startPayment({
                items: bookingItems,

                customer: {
                    name: contacts.contacts.name.trim(),
                    email: contacts.contacts.email.trim(),
                    phone: contacts.contacts.phone.trim(),
                },

                totalPrice,
                prepaymentPrice,

                captchaToken,
            });
        } catch {
            clearPendingBooking();

            modal.openError(
                'Не удалось перейти к оплате. Попробуйте ещё раз.',
            );

            setIsSubmitting(false);
            captcha.resetCaptcha();
        }
    };

    return {
        bookingLines: lines.bookingLines,
        bookingLineErrors: lines.bookingLineErrors,

        availabilityByLine:
        availability.availabilityByLine,

        contacts: contacts.contacts,
        contactErrors: contacts.contactErrors,

        minDate,
        maxDate,

        totalPrice,
        prepaymentPrice,

        isSubmitting,

        modalStatus: modal.modalStatus,
        modalErrorMessage:
        modal.modalErrorMessage,

        submittedBookingItems:
        modal.submittedBookingItems,

        getLineServiceOptions:
        lines.getLineServiceOptions,

        getLineBookableOptions:
        lines.getLineBookableOptions,

        getLineProgramOptions:
        lines.getLineProgramOptions,

        isLinePackage:
        lines.isLinePackage,

        handleServiceChange:
        lines.handleServiceChange,

        handleBookableItemChange:
        lines.handleBookableItemChange,

        handleBookingOptionChange:
        lines.handleBookingOptionChange,

        handleDateChange:
        lines.handleDateChange,

        handleTimeChange:
        lines.handleTimeChange,

        captchaError:
        captcha.captchaError,

        captchaResetKey:
        captcha.captchaResetKey,

        handleCaptchaSuccess:
        captcha.handleCaptchaSuccess,

        handleCaptchaExpired:
        captcha.handleCaptchaExpired,

        addBookingLine:
        lines.addBookingLine,

        removeBookingLine:
        lines.removeBookingLine,

        updateContact:
        contacts.updateContact,

        handleSubmit,

        closeModal: modal.close,

        submittedTotalPrice:
        modal.submittedTotalPrice,

        submittedPrepaymentPrice:
        modal.submittedPrepaymentPrice,
    };
}