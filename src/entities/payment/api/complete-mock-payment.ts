import { apiClient } from '@/shared/api/client';

import type {
    CompleteMockPaymentStatus,
    PaymentStatusResult,
} from '../model/types';

export async function completeMockPayment(
    paymentId: string,
    status: CompleteMockPaymentStatus,
): Promise<PaymentStatusResult> {
    const response = await apiClient.post<PaymentStatusResult>(
        `/payments/${encodeURIComponent(paymentId)}/mock/complete`,
        {
            status,
        },
    );

    return response.data;
}
