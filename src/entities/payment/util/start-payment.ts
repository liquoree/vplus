import { createPaymentMock } from '../mock/create-payment-mock';
import type { CreatePaymentInput } from '../model/types';

export async function startPayment(
    input: CreatePaymentInput,
): Promise<void> {
    const payment = await createPaymentMock(input);

    window.location.assign(payment.paymentUrl);
}