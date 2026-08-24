import axios from 'axios';
import type { FormEvent } from 'react';
import { useLayoutEffect, useMemo, useState } from 'react';

import { startPayment } from '@/entities/payment';
import type { PaymentStatusResult } from '@/entities/payment';

import { buildBookingItems, getBookingLinePrice } from '../lib/booking-catalog';
import { getMaxBookingDateValue, getTodayDateValue } from '../lib/booking-date';

import { useBookingAvailability } from './internal/useBookingAvailability';
import { useBookingCaptcha } from './internal/useBookingCaptcha';
import { useBookingContacts } from './internal/useBookingContacts';
import { useBookingLines } from './internal/useBookingLines';
import { useBookingModal } from './internal/useBookingModal';

import type { BookingPageProps, ContactErrors } from './types';

const PAYMENT_RESULT_STORAGE_KEY = 'paymentResult';
const PAYMENT_RESULT_ERROR = '__PAYMENT_CHECK_ERROR__';

type ApiErrorResponse = {
    error?: {
        code?: string;
        message?: string;
        fields?: Record<string, string> | null;
        requestId?: string;
    };
};

function getContactValidationErrors(error: unknown): ContactErrors | null {
    if (!axios.isAxiosError<ApiErrorResponse>(error)) {
        return null;
    }

    const backendError = error.response?.data?.error;
    const status = error.response?.status;

    if (status !== 422 && backendError?.code !== 'VALIDATION_ERROR') {
        return null;
    }

    const fields = backendError?.fields;

    if (!fields) {
        return null;
    }

    const errors: ContactErrors = {};

    if (fields['customer.name']) {
        errors.name = fields['customer.name'];
    }

    if (fields['customer.email']) {
        errors.email = fields['customer.email'];
    }

    if (fields['customer.phone']) {
        errors.phone = fields['customer.phone'];
    }

    return Object.keys(errors).length > 0 ? errors : null;
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

    useLayoutEffect(() => {
        const storedPaymentResult = sessionStorage.getItem(PAYMENT_RESULT_STORAGE_KEY);

        if (!storedPaymentResult) {
            return;
        }

        sessionStorage.removeItem(PAYMENT_RESULT_STORAGE_KEY);

        if (storedPaymentResult === PAYMENT_RESULT_ERROR) {
            modal.openError(
                'Не удалось проверить результат оплаты. Обновите страницу и попробуйте ещё раз.',
            );
            return;
        }

        try {
            const payment = JSON.parse(storedPaymentResult) as PaymentStatusResult;

            if (payment.status === 'paid') {
                modal.openSuccess(
                    payment.booking.items,
                    payment.booking.totalPrice,
                    payment.booking.prepaymentPrice,
                );
                return;
            }

            if (payment.status === 'refunded') {
                modal.openError('Оплата возвращена. Заявка не подтверждена.');
                return;
            }

            if (payment.status === 'failed' || payment.status === 'canceled') {
                modal.openError('Оплата не завершена. Заявка не отправлена.');
                return;
            }

            modal.openError(
                'Платёж ещё обрабатывается. Обновите страницу через несколько секунд.',
            );
        } catch {
            modal.openError(
                'Не удалось прочитать результат оплаты. Обновите страницу и попробуйте ещё раз.',
            );
        }
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
        } catch (error) {
            const contactValidationErrors = getContactValidationErrors(error);

            if (contactValidationErrors) {
                contacts.applyValidationErrors(contactValidationErrors);
                setIsSubmitting(false);
                return;
            }

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