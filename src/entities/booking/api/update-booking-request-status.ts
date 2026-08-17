import axios from 'axios';

import { apiClient } from '@/shared/api/client';

import type {
    AdminBookingRequestRecord,
    BookingRequestDecision,
    BookingRequestStatusUpdateResult,
} from '../model/types';

type ApiErrorResponse = {
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

export async function updateBookingRequestStatus(
    bookingRequestId: string,
    decision: BookingRequestDecision,
    version: number,
): Promise<BookingRequestStatusUpdateResult> {
    try {
        const response = await apiClient.patch<AdminBookingRequestRecord>(
            `/admin/bookings/${bookingRequestId}/status`,
            {
                decision,
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
                message: 'Не удалось изменить статус заявки',
            };
        }

        const backendError = error.response?.data?.error;

        return {
            success: false,

            message:
                getFirstFieldError(backendError?.fields) ??
                backendError?.message ??
                'Не удалось изменить статус заявки',
        };
    }
}
