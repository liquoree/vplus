import { getPaymentStatus } from '../api/get-payment-status';
import type { PaymentStatusResult } from '../model/types';

export async function getPaymentStatusMock(paymentId: string): Promise<PaymentStatusResult> {
    return getPaymentStatus(paymentId);
}
