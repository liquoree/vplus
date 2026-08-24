import { apiClient } from '@/shared/api/client';

import type { PaymentStatusResult } from '../../../../../Downloads/frontend_payment_admin_patch/src/entities/payment/model/types';

export async function getPaymentStatus(paymentId: string): Promise<PaymentStatusResult> {
    const response = await apiClient.get<PaymentStatusResult>(
        `/payments/${encodeURIComponent(paymentId)}`,
    );

    return response.data;
}
