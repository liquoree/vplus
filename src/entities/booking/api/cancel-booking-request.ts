import axios from 'axios';

import { apiClient } from '@/shared/api/client';

import type {
    AdminBookingRequestRecord,
    BookingCancelResult,
} from '../../../../../Downloads/frontend_payment_admin_patch/src/entities/booking/model/types';

type ApiErrorResponse = {
    detail?: string;
    error?: {
        code?: string;
        message?: string;
        fields?: Record<string, string> | null;
        requestId?: string;
    };
};

function getFirstFieldError(fields: Record<string, string> | null | undefined) {
    if (!fields) {
        return null;
    }

    return (
        Object.values(fields).find(
            (message) => typeof message === 'string' && message.trim().length > 0,
        ) ?? null
    );
}

export async function cancelBookingRequest(
    bookingRequestId: string,
    version: number,
): Promise<BookingCancelResult> {
    try {
        const response = await apiClient.post<AdminBookingRequestRecord>(
            `/admin/bookings/${encodeURIComponent(bookingRequestId)}/cancel`,
            {
                version,
            },
        );

        return {
            success: true,
            request: response.data,
        };
    } catch (error) {
        if (!axios.isAxiosError<ApiErrorResponse>(error)) {
            return {
                success: false,
                message: 'Не удалось отменить заявку и оформить возврат',
            };
        }

        const backendError = error.response?.data;

        return {
            success: false,
            message:
                getFirstFieldError(backendError?.error?.fields) ??
                backendError?.error?.message ??
                backendError?.detail ??
                'Не удалось отменить заявку и оформить возврат',
        };
    }
}
