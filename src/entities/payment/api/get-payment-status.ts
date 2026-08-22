import {PaymentStatusResult} from "@/entities/payment/model/types";

export async function getPaymentStatus(
    // bookingId: string,
): Promise<PaymentStatusResult> {
    return {
        paymentId: "mock-payment-123",
        status: "paid",
    };
}