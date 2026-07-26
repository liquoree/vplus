import type {
  BookingRequestPayload,
  BookingSubmitResult,
} from '../model/types';

import type { BookingReservation } from '../model/availability-types';

import {
  intervalsOverlap,
  minutesToTime,
  timeToMinutes,
} from '../lib/time';

import { addMockBookingRequest } from '../mock/booking-request-repository';

import { addMockReservations } from '../mock/booking-reservation-repository';

import { getBookingAvailability } from './get-booking-availability';

function getEndTime(
  startTime: string,
  durationMinutes: number
) {
  const startMinutes =
    timeToMinutes(startTime);

  return minutesToTime(
    startMinutes + durationMinutes
  );
}

function isValidTime(time: string) {
  const minutes = timeToMinutes(time);

  return (
    Number.isFinite(minutes) &&
    minutes >= 0 &&
    minutes < 24 * 60
  );
}

export async function submitBookingRequest(
  payload: BookingRequestPayload
): Promise<BookingSubmitResult> {
  await new Promise((resolve) => {
    setTimeout(resolve, 400);
  });

  if (
    payload.items.length === 0 ||
    !payload.customer.name.trim() ||
    !payload.customer.email.trim() ||
    !payload.customer.phone.trim()
  ) {
    return {
      success: false,
      code: 'VALIDATION_ERROR',
      message:
        'Данные заявки заполнены не полностью',
    };
  }

  const bookingId = crypto.randomUUID();

  const preparedReservations: BookingReservation[] =
    [];

  for (const item of payload.items) {
    if (
      !item.bookingOptionId ||
      !item.bookableItemId ||
      !item.date ||
      !isValidTime(item.time) ||
      !Number.isFinite(
        item.durationMinutes
      ) ||
      item.durationMinutes <= 0
    ) {
      return {
        success: false,
        code: 'VALIDATION_ERROR',
        message:
          'Одна или несколько позиций заявки заполнены некорректно',
      };
    }

    const availability =
      await getBookingAvailability({
        bookableItemId:
          item.bookableItemId,

        date: item.date,

        durationMinutes:
          item.durationMinutes,
      });

    const selectedSlot =
      availability.slots.find(
        (slot) =>
          slot.startTime === item.time
      );

    if (!selectedSlot) {
      return {
        success: false,
        code: 'BOOKING_CONFLICT',
        message: `Время ${item.time} для «${item.bookableItemTitle}» уже недоступно`,
      };
    }

    const startMinutes = timeToMinutes(
      selectedSlot.startTime
    );

    const endMinutes = timeToMinutes(
      selectedSlot.endTime
    );

    const hasConflictInsideRequest =
      preparedReservations.some(
        (reservation) =>
          reservation.bookableItemId ===
            item.bookableItemId &&
          reservation.date === item.date &&
          intervalsOverlap(
            startMinutes,
            endMinutes,
            timeToMinutes(
              reservation.startTime
            ),
            timeToMinutes(
              reservation.endTime
            )
          )
      );

    if (hasConflictInsideRequest) {
      return {
        success: false,
        code: 'BOOKING_CONFLICT',
        message: `В заявке пересекается время бронирования для «${item.bookableItemTitle}»`,
      };
    }

    preparedReservations.push({
      id: crypto.randomUUID(),
      bookingRequestId: bookingId,

      bookableItemId:
        item.bookableItemId,

      bookingOptionId:
        item.bookingOptionId,

      date: item.date,
      startTime: item.time,

      endTime: getEndTime(
        item.time,
        item.durationMinutes
      ),

      status: 'pending',
    });
  }

  addMockBookingRequest({
    id: bookingId,

    items: payload.items.map((item) => ({
      ...item,
    })),

    customer: {
      ...payload.customer,
    },

    totalPrice: payload.totalPrice,

    prepaymentPrice:
      payload.prepaymentPrice,

    status: 'pending',

    createdAt: new Date().toISOString(),
    reviewedAt: null,
  });

  addMockReservations(
    preparedReservations
  );

  return {
    success: true,
    bookingId,
  };
}