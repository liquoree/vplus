'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { completeMockPayment } from '@/entities/payment';
import type { CompleteMockPaymentStatus } from '@/entities/payment';

function PaymentMockContent() {
    const searchParams = useSearchParams();
    const paymentId = searchParams.get('paymentId');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const completePayment = async (
        status: CompleteMockPaymentStatus,
    ) => {
        if (!paymentId || isSubmitting) {
            return;
        }

        setError('');
        setIsSubmitting(true);

        try {
            await completeMockPayment(
                paymentId,
                status,
            );

            window.location.assign(
                `/payment/return?paymentId=${encodeURIComponent(
                    paymentId,
                )}`,
            );
        } catch {
            setError(
                'Не удалось изменить статус тестового платежа.',
            );

            setIsSubmitting(false);
        }
    };

    if (!paymentId) {
        return (
            <main>
                <h1>Тестовая оплата</h1>
                <p>Платёж не найден.</p>
            </main>
        );
    }

    return (
        <main>
            <h1>Тестовая оплата</h1>

            <p>
                Выберите результат тестового
                платежа.
            </p>

            {error && (
                <p role="alert">
                    {error}
                </p>
            )}

            <button
                type="button"
                disabled={isSubmitting}
                onClick={() => {
                    void completePayment('paid');
                }}
            >
                {isSubmitting
                    ? 'Обработка...'
                    : 'Успешная оплата'}
            </button>

            <button
                type="button"
                disabled={isSubmitting}
                onClick={() => {
                    void completePayment('failed');
                }}
            >
                Ошибка оплаты
            </button>
        </main>
    );
}

function PaymentMockFallback() {
    return (
        <main>
            <h1>Тестовая оплата</h1>
            <p>Загрузка...</p>
        </main>
    );
}

export default function PaymentMockPage() {
    return (
        <Suspense fallback={<PaymentMockFallback />}>
            <PaymentMockContent />
        </Suspense>
    );
}