'use client';

import { useSearchParams } from 'next/navigation';

import {
    setMockPaymentStatus,
} from '@/entities/payment/mock/payment-mock-state';

export default function PaymentMockPage() {
    const searchParams = useSearchParams();

    const paymentId = searchParams.get('paymentId');

    const handleSuccess = () => {
        if (!paymentId) {
            return;
        }

        setMockPaymentStatus(paymentId, 'paid');

        window.location.assign(
            `/booking?paymentReturn=1&paymentId=${encodeURIComponent(paymentId)}`,
        );
    };

    const handleError = () => {
        if (!paymentId) {
            return;
        }

        setMockPaymentStatus(paymentId, 'failed');

        window.location.assign(
            `/booking?paymentReturn=1&paymentId=${encodeURIComponent(paymentId)}`,
        );
    };

    return (
        <main>
            <h1>Тестовая оплата</h1>

            <button
                type="button"
                onClick={handleSuccess}
            >
                Успешная оплата
            </button>

            <button
                type="button"
                onClick={handleError}
            >
                Ошибка оплаты
            </button>
        </main>
    );
}