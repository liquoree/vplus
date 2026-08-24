import { createPayment } from '../api/create-payment';
import type { CreatePaymentInput } from '../model/types';

export async function startPayment(input: CreatePaymentInput): Promise<void> {
    const payment = await createPayment(input);

    window.location.assign(payment.paymentUrl);
}
