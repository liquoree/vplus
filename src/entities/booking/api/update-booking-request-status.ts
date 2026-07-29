import type {
  BookingRequestDecision,
  BookingRequestRecord,
  BookingRequestStatusUpdateResult,
} from '../model/types';

import {
  getMockBookingRequests,
  updateMockBookingRequestStatus,
} from '../mock/booking-request-repository';

import { updateMockReservationsStatusByRequestId } from '../mock/booking-reservation-repository';

function canChangeStatus(
  request: BookingRequestRecord,
  nextStatus: BookingRequestDecision
) {
  if (request.status === 'pending') {
    return (
      nextStatus === 'approved' ||
      nextStatus === 'rejected'
    );
  }

  if (request.status === 'approved') {
    return nextStatus === 'cancelled';
  }

  return false;
}

export async function updateBookingRequestStatus(
  bookingRequestId: string,
  status: BookingRequestDecision
): Promise<BookingRequestStatusUpdateResult> {
  await new Promise((resolve) => {
    setTimeout(resolve, 250);
  });

  const currentRequest =
    getMockBookingRequests().find(
      (request) =>
        request.id === bookingRequestId
    );

  if (!currentRequest) {
    return {
      success: false,
      message: 'Заявка не найдена',
    };
  }

  if (
    !canChangeStatus(
      currentRequest,
      status
    )
  ) {
    return {
      success: false,
      message:
        'Для заявки недоступно выбранное изменение статуса',
    };
  }

  const updatedRequest =
    updateMockBookingRequestStatus(
      bookingRequestId,
      status
    );

  if (!updatedRequest) {
    return {
      success: false,
      message:
        'Не удалось изменить статус заявки',
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