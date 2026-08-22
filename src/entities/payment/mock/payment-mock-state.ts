import type { PaymentStatus } from "../model/types";

function getKey(paymentId: string) {
    return `payment:${paymentId}`;
}

export function setMockPaymentStatus(
    paymentId: string,
    status: PaymentStatus,
) {
    sessionStorage.setItem(
        getKey(paymentId),
        status,
    );
}

export function getMockPaymentStatus(
    paymentId: string,
): PaymentStatus {
    const status = sessionStorage.getItem(
        getKey(paymentId),
    );

    if (!status) {
        return "pending";
    }

    return status as PaymentStatus;
}