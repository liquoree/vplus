import { useState } from 'react';

import type { BookingRequestItem } from '@/entities/booking';

export function useBookingModal() {
    const [modalStatus, setModalStatus] = useState<'success' | 'error' | null>(null);

    const [submittedTotalPrice, setSubmittedTotalPrice] = useState(0);

    const [submittedPrepaymentPrice, setSubmittedPrepaymentPrice] = useState(0);

    const [modalErrorMessage, setModalErrorMessage] = useState<string | null>(null);

    const [submittedBookingItems, setSubmittedBookingItems] = useState<BookingRequestItem[]>([]);

    const openSuccess = (
        bookingItems: BookingRequestItem[],
        totalPrice: number,
        prepaymentPrice: number,
    ) => {
        setSubmittedBookingItems(bookingItems);
        setSubmittedTotalPrice(totalPrice);
        setSubmittedPrepaymentPrice(prepaymentPrice);

        setModalErrorMessage(null);
        setModalStatus('success');
    };

    const openError = (message: string) => {
        setModalErrorMessage(message);
        setModalStatus('error');
    };

    const close = () => {
        setModalStatus(null);
        setModalErrorMessage(null);
    };

    return {
        modalStatus,
        modalErrorMessage,

        submittedBookingItems,
        submittedTotalPrice,
        submittedPrepaymentPrice,

        openSuccess,
        openError,
        close,
    };
}
