'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import type { PaymentStatus } from '@/entities/payment/model/types';
import { getPaymentStatusMock } from '@/entities/payment/mock/get-payment-status-mock';

export default function PaymentSuccessPage() {
    const searchParams = useSearchParams();
    const paymentId = searchParams.get('paymentId');

    const [status, setStatus] = useState<PaymentStatus>('pending');

    useEffect(() => {
        if (!paymentId) {
            return;
        }

        getPaymentStatusMock(paymentId).then((result) => {
            setStatus(result.status);
        });
    }, [paymentId]);

    if (status === 'pending') {
        return <div>Проверяем оплату...</div>;
    }

    if (status === 'paid') {
        return <div>Оплата прошла успешно</div>;
    }

    return <div>Платеж не завершен</div>;
}
