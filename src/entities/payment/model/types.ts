import type { BookingRequestItem } from '@/entities/booking';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'canceled' | 'refunded';

export interface PaymentBooking {
    bookingId: string;
    publicNumber: string;
    items: BookingRequestItem[];
    totalPrice: number;
    prepaymentPrice: number;
}

export interface CreatePaymentResult {
    paymentId: string;
    paymentUrl: string;
    bookingId: string;
    amount: number;
    status: PaymentStatus;
    expiresAt: string;
}

export interface PaymentStatusResult {
    paymentId: string;
    status: PaymentStatus;
    providerStatus: string | null;
    expiresAt: string;
    booking: PaymentBooking;
}

export interface CreatePaymentInput {
    items: BookingRequestItem[];

    customer: {
        name: string;
        email: string;
        phone: string;
    };

    captchaToken: string;
}

export type CompleteMockPaymentStatus = 'paid' | 'failed' | 'canceled';
