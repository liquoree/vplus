import type { FormEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';

import { getPaymentStatus, startPayment } from '@/entities/payment';
import type { PaymentStatusResult } from '@/entities/payment';

import { buildBookingItems, getBookingLinePrice } from '../lib/booking-catalog';
import { getMaxBookingDateValue, getTodayDateValue } from '../lib/booking-date';

import { useBookingAvailability } from './internal/useBookingAvailability';
import { useBookingCaptcha } from './internal/useBookingCaptcha';
import { useBookingContacts } from './internal/useBookingContacts';
import { useBookingLines } from './internal/useBookingLines';
import { useBookingModal } from './internal/useBookingModal';

import type { BookingPageProps } from './types';

const PAYMENT_STATUS_RETRY_COUNT = 8;
const PAYMENT_STATUS_RETRY_DELAY_MS = 750;

function wait(milliseconds: number) {
    return new Promise<void>((resolve) => {
        window.setTimeout(resolve, milliseconds);
    });
}

async function waitForFinalPaymentStatus(paymentId: string): Promise<PaymentStatusResult> {
    let payment = await getPaymentStatus(paymentId);

    for (let attempt = 1; attempt < PAYMENT_STATUS_RETRY_COUNT; attempt += 1) {
        if (payment.status !== 'pending') {
            return payment;
        }

        await wait(PAYMENT_STATUS_RETRY_DELAY_MS);
        payment = await getPaymentStatus(paymentId);
    }

    return payment;
}

export function useBookingForm({
    items,
    bookingOptions,
    initialVehicleSlug,
    initialServiceSlug,
    initialPackageSlug,
}: BookingPageProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const availability = useBookingAvailability(bookingOptions);

    const lines = useBookingLines({
        items,
        bookingOptions,

        initialVehicleSlug,
        initialServiceSlug,
        initialPackageSlug,

        loadAvailability: availability.loadAvailability,

        clearAvailability: availability.clearAvailability,

        removeAvailability: availability.removeAvailability,
    });

    const contacts = useBookingContacts();
    const captcha = useBookingCaptcha();
    const modal = useBookingModal();

    const totalPrice = useMemo(() => {
        return lines.bookingLines.reduce(
            (total, line) => total + getBookingLinePrice(line, bookingOptions),
            0,
        );
    }, [lines.bookingLines, bookingOptions]);

    const prepaymentPrice = Math.ceil(totalPrice * 0.2);

    const minDate = getTodayDateValue();
    const maxDate = getMaxBookingDateValue();

    useEffect(() => {
        const url = new URL(window.location.href);

        const isPaymentReturn = url.searchParams.get('paymentReturn') === '1';

        const paymentId = url.searchParams.get('paymentId');

        if (!isPaymentReturn || !paymentId) {
            return;
        }

        const handlePaymentReturn = async () => {
            let shouldClearPaymentParams = false;

            setIsSubmitting(true);

            try {
                const payment = await waitForFinalPaymentStatus(paymentId);

                if (payment.status === 'paid') {
                    modal.openSuccess(
                        payment.booking.items,
                        payment.booking.totalPrice,
                        payment.booking.prepaymentPrice,
                    );

                    shouldClearPaymentParams = true;
                    return;
                }

                if (payment.status === 'refunded') {
                    modal.openError('Оплата возвращена. Заявка не подтверждена.');

                    shouldClearPaymentParams = true;
                    return;
                }

                if (payment.status === 'failed' || payment.status === 'canceled') {
                    modal.openError('Оплата не завершена. Заявка не отправлена.');

                    shouldClearPaymentParams = true;
                    return;
                }

                modal.openError(
                    'Платёж ещё обрабатывается. Обновите страницу через несколько секунд.',
                );
            } catch {
                modal.openError(
                    'Не удалось проверить результат оплаты. Обновите страницу и попробуйте ещё раз.',
                );
            } finally {
                setIsSubmitting(false);

                if (shouldClearPaymentParams) {
                    url.searchParams.delete('paymentReturn');

                    url.searchParams.delete('paymentId');

                    window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
                }
            }
        };

        void handlePaymentReturn();
    }, [modal]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (isSubmitting) {
            return;
        }

        const areBookingLinesValid = lines.validate();

        const areContactsValid = contacts.validate();

        if (!areBookingLinesValid || !areContactsValid) {
            return;
        }

        const captchaToken = captcha.validate();

        if (!captchaToken) {
            return;
        }

        const bookingItems = buildBookingItems(lines.bookingLines, items, bookingOptions);

        setIsSubmitting(true);

        try {
            await startPayment({
                items: bookingItems,

                customer: {
                    name: contacts.contacts.name.trim(),
                    email: contacts.contacts.email.trim(),
                    phone: contacts.contacts.phone.trim(),
                },

                captchaToken,
            });
        } catch {
            modal.openError('Не удалось перейти к оплате. Попробуйте ещё раз.');

            setIsSubmitting(false);
            captcha.resetCaptcha();
        }
    };

    return {
        bookingLines: lines.bookingLines,
        bookingLineErrors: lines.bookingLineErrors,

        availabilityByLine: availability.availabilityByLine,

        contacts: contacts.contacts,
        contactErrors: contacts.contactErrors,

        minDate,
        maxDate,

        totalPrice,
        prepaymentPrice,

        isSubmitting,

        modalStatus: modal.modalStatus,
        modalErrorMessage: modal.modalErrorMessage,

        submittedBookingItems: modal.submittedBookingItems,

        getLineServiceOptions: lines.getLineServiceOptions,

        getLineBookableOptions: lines.getLineBookableOptions,

        getLineProgramOptions: lines.getLineProgramOptions,

        isLinePackage: lines.isLinePackage,

        handleServiceChange: lines.handleServiceChange,

        handleBookableItemChange: lines.handleBookableItemChange,

        handleBookingOptionChange: lines.handleBookingOptionChange,

        handleDateChange: lines.handleDateChange,

        handleTimeChange: lines.handleTimeChange,

        captchaError: captcha.captchaError,

        captchaResetKey: captcha.captchaResetKey,

        handleCaptchaSuccess: captcha.handleCaptchaSuccess,

        handleCaptchaExpired: captcha.handleCaptchaExpired,

        addBookingLine: lines.addBookingLine,

        removeBookingLine: lines.removeBookingLine,

        updateContact: contacts.updateContact,

        handleSubmit,

        closeModal: modal.close,

        submittedTotalPrice: modal.submittedTotalPrice,

        submittedPrepaymentPrice: modal.submittedPrepaymentPrice,
    };
}
