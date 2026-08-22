import type {
    CreatePaymentInput,
    CreatePaymentResult,
} from "../model/types";

export async function createPayment(
    input: CreatePaymentInput,
): Promise<CreatePaymentResult> {
    const response = await fetch(
        `/api/bookings/${input.bookingId}/payment`,
        {
            method: "POST",
        },
    );

    if (!response.ok) {
        throw new Error("Не удалось создать платеж");
    }

    return response.json();
}