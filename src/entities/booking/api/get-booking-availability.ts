import { BOOKING_SCHEDULE } from '../config/booking-schedule';
import {
  intervalsOverlap,
  minutesToTime,
  timeToMinutes,
} from '../lib/time';
import { getMockReservations } from '../mock/booking-reservation-repository';
import type {
  BookingAvailabilityQuery,
  BookingAvailabilityResult,
} from '../model/availability-types';

const blockingStatuses = new Set([
  'pending',
  'approved',
]);

export async function getBookingAvailability({
  catalogItemId,
  date,
  durationMinutes,
}: BookingAvailabilityQuery): Promise<BookingAvailabilityResult> {
  await new Promise((resolve) => {
    setTimeout(resolve, 200);
  });

  const reservations = getMockReservations().filter(
    (reservation) =>
      reservation.catalogItemId === catalogItemId &&
      reservation.date === date &&
      blockingStatuses.has(reservation.status)
  );

  const slots = BOOKING_SCHEDULE.workingIntervals.flatMap(
    (workingInterval) => {
      const intervalStart = timeToMinutes(workingInterval.startTime);
      const intervalEnd = timeToMinutes(workingInterval.endTime);

      const availableSlots = [];

      for (
        let start = intervalStart;
        start + durationMinutes <= intervalEnd;
        start += BOOKING_SCHEDULE.slotStepMinutes
      ) {
        const end = start + durationMinutes;

        const hasConflict = reservations.some((reservation) => {
          return intervalsOverlap(
            start,
            end,
            timeToMinutes(reservation.startTime),
            timeToMinutes(reservation.endTime)
          );
        });

        if (!hasConflict) {
          availableSlots.push({
            startTime: minutesToTime(start),
            endTime: minutesToTime(end),
          });
        }
      }

      return availableSlots;
    }
  );

  return {
    catalogItemId,
    date,
    durationMinutes,
    slots,
  };
}