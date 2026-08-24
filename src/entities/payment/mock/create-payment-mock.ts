import { createPayment } from '../api/create-payment';
import type {
    CreatePaymentInput,
    CreatePaymentResult,
} from '../model/types';

export async function createPaymentMock(input: CreatePaymentInput): Promise<CreatePaymentResult> {
    return createPayment(input);
}
