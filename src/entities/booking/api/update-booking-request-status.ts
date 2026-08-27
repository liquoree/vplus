import { cancelBookingRequest } from './cancel-booking-request';

import type {
    BookingRequestDecision,
    BookingRequestStatusUpdateResult,
} from '../model/types';

export async function updateBookingRequestStatus(
    bookingRequestId: string,
    decision: BookingRequestDecision,
    version: number,
): Promise<BookingRequestStatusUpdateResult> {
    if (decision !== 'cancelled') {
        return {
            success: false,
            message: 'Этот переход статуса больше не поддерживается',
        };
    }

    return cancelBookingRequest(bookingRequestId, version);
}
