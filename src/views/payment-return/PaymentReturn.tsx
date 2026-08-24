'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { getPaymentStatus } from '@/entities/payment';
import type { PaymentStatusResult } from '@/entities/payment';

import { PaymentProcessingOverlay } from '../booking/payment-processing-overlay/PaymentProcessingOverlay';

const PAYMENT_STATUS_POLL_INTERVAL_MS = 1000;
const PAYMENT_RESULT_STORAGE_KEY = 'paymentResult';
const PAYMENT_RESULT_ERROR = '__PAYMENT_CHECK_ERROR__';

interface PaymentReturnProps {
    paymentId: string;
}

function wait(milliseconds: number) {
    return new Promise<void>((resolve) => {
        window.setTimeout(resolve, milliseconds);
    });
}

async function waitForFinalPaymentStatus(paymentId: string): Promise<PaymentStatusResult> {
    let payment = await getPaymentStatus(paymentId);

    while (payment.status === 'pending') {
        await wait(PAYMENT_STATUS_POLL_INTERVAL_MS);
        payment = await getPaymentStatus(paymentId);
    }

    return payment;
}

export function PaymentReturn({ paymentId }: PaymentReturnProps) {
    const router = useRouter();

    useEffect(() => {
        router.prefetch('/booking');
    }, [router]);

    useEffect(() => {
        let isCancelled = false;

        const checkPayment = async () => {
            try {
                const payment = await waitForFinalPaymentStatus(paymentId);

                if (isCancelled) {
                    return;
                }

                sessionStorage.setItem(
                    PAYMENT_RESULT_STORAGE_KEY,
                    JSON.stringify(payment),
                );
            } catch {
                if (isCancelled) {
                    return;
                }

                sessionStorage.setItem(
                    PAYMENT_RESULT_STORAGE_KEY,
                    PAYMENT_RESULT_ERROR,
                );
            }

            if (!isCancelled) {
                router.replace('/booking', {
                    scroll: false,
                });
            }
        };

        void checkPayment();

        return () => {
            isCancelled = true;
        };
    }, [paymentId, router]);

    return <PaymentProcessingOverlay />;
}