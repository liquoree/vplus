import type {
    PaymentStatusResult,
} from "../model/types";

import {
    getMockPaymentStatus,
} from "./payment-mock-state";

export async function getPaymentStatusMock(
    paymentId: string,
): Promise<PaymentStatusResult> {
    await new Promise((resolve) => {
        setTimeout(resolve, 500);
    });

    return {
        paymentId,
        status: getMockPaymentStatus(paymentId),
    };
}