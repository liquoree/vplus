import type {
  BookingRequestDecision,
  BookingRequestStatusUpdateResult,
} from '../model/types';

import { updateMockBookingRequestStatus } from '../mock/booking-request-repository';

import { updateMockReservationsStatusByRequestId } from '../mock/booking-reservation-repository';

export async function updateBookingRequestStatus(
  bookingRequestId: string,
  status: BookingRequestDecision
): Promise<BookingRequestStatusUpdateResult> {
  await new Promise((resolve) => {
    setTimeout(resolve, 250);
  });

  const updatedRequest =
    updateMockBookingRequestStatus(
      bookingRequestId,
      status
    );

  if (!updatedRequest) {
    return {
      success: false,
      message: 'Заявка не найдена',
    };
  }

  updateMockReservationsStatusByRequestId(
    bookingRequestId,
    status
  );

  return {
    success: true,
    request: updatedRequest,
  };
}