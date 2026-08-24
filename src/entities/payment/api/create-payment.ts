import { apiClient } from '@/shared/api/client';

import type {
    CreatePaymentInput,
    CreatePaymentResult,
} from '../../../../../Downloads/frontend_payment_admin_patch/src/entities/payment/model/types';

type CreatePaymentRequest = {
    items: {
        bookingOptionId: string;
        bookableItemId: string;
        date: string;
        time: string;
    }[];

    customer: {
        name: string;
        email: string;
        phone: string;
    };

    captchaToken: string;
};

function preparePaymentRequest(input: CreatePaymentInput): CreatePaymentRequest {
    return {
        items: input.items.map((item) => ({
            bookingOptionId: item.bookingOptionId,
            bookableItemId: item.bookableItemId,
            date: item.date,
            time: item.time,
        })),

        customer: {
            name: input.customer.name.trim(),
            email: input.customer.email.trim(),
            phone: input.customer.phone.trim(),
        },

        captchaToken: input.captchaToken,
    };
}

export async function createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
    const response = await apiClient.post<CreatePaymentResult>(
        '/payments',
        preparePaymentRequest(input),
        {
            headers: {
                'Idempotency-Key': crypto.randomUUID(),
            },
        },
    );

    return response.data;
}
