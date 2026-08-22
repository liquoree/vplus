export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'canceled';

export interface CreatePaymentResult {
    paymentId: string;
    paymentUrl: string;
}

export interface PaymentStatusResult {
    paymentId: string;
    status: PaymentStatus;
}

import type { BookingRequestItem } from '@/entities/booking';

export interface CreatePaymentInput {
    items: BookingRequestItem[];

    customer: {
        name: string;
        email: string;
        phone: string;
    };

    totalPrice: number;
    prepaymentPrice: number;

    captchaToken: string;
}