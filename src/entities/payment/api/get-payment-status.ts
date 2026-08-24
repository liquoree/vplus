import { apiClient } from '@/shared/api/client';

import type { PaymentStatusResult } from '@/entities/payment/model/types';

export async function getPaymentStatus(paymentId: string): Promise<PaymentStatusResult> {
    const response = await apiClient.get<PaymentStatusResult>(
        `/payments/${encodeURIComponent(paymentId)}`,
    );

    return response.data;
}
