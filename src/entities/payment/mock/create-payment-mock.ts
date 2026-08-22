import type {
    CreatePaymentInput,
    CreatePaymentResult,
} from "../model/types";

export async function createPaymentMock(
    input: CreatePaymentInput,
): Promise<CreatePaymentResult> {
    void input;

    await new Promise((resolve) => {
        setTimeout(resolve, 500);
    });

    const paymentId = crypto.randomUUID();

    return {
        paymentId,
        paymentUrl: `/payment/mock?paymentId=${paymentId}`,
    };
}