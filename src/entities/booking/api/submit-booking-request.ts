import type {
  BookingRequestPayload,
  BookingSubmitResult,
} from '../model/types';
import { getBookingAvailability } from './get-booking-availability';
import { addMockReservations } from '../mock/booking-reservation-repository';
import { timeToMinutes, minutesToTime } from '../lib/time';

function getEndTime(startTime: string, durationHours: number) {
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = startMinutes + durationHours * 60;

  return minutesToTime(endMinutes);
}

export async function submitBookingRequest(
  payload: BookingRequestPayload
): Promise<BookingSubmitResult> {
  await new Promise((resolve) => {
    setTimeout(resolve, 400);
  });

  for (const item of payload.items) {
    const availability = await getBookingAvailability({
      catalogItemId: item.catalogItemId,
      date: item.date,
      durationMinutes: item.hours * 60,
    });

    const isStillAvailable = availability.slots.some(
      (slot) => slot.startTime === item.time
    );

    if (!isStillAvailable) {
      return {
        success: false,
        code: 'BOOKING_CONFLICT',
        message: `Время ${item.time} для «${item.catalogItemTitle}» уже недоступно`,
      };
    }
  }

  const bookingId = crypto.randomUUID();

  addMockReservations(
    payload.items.map((item) => ({
      id: crypto.randomUUID(),
      catalogItemId: item.catalogItemId,
      date: item.date,
      startTime: item.time,
      endTime: getEndTime(item.time, item.hours),
      status: 'pending',
    }))
  );

  return {
    success: true,
    bookingId,
  };
}