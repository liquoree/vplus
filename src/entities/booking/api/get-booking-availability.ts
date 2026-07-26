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
  BookingReservationStatus,
  BookingTimeSlot,
} from '../model/availability-types';

const blockingStatuses =
  new Set<BookingReservationStatus>([
    'pending',
    'approved',
  ]);

function formatLocalDateValue(date: Date) {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, '0');

  const day = String(
    date.getDate()
  ).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function createEmptyResult({
  bookableItemId,
  date,
  durationMinutes,
}: BookingAvailabilityQuery): BookingAvailabilityResult {
  return {
    bookableItemId,
    date,
    durationMinutes,
    slots: [],
  };
}

export async function getBookingAvailability({
  bookableItemId,
  date,
  durationMinutes,
}: BookingAvailabilityQuery): Promise<BookingAvailabilityResult> {
  await new Promise((resolve) => {
    setTimeout(resolve, 200);
  });

  const now = new Date();
  const todayValue = formatLocalDateValue(now);

  if (
    !bookableItemId ||
    !date ||
    date < todayValue ||
    !Number.isFinite(durationMinutes) ||
    durationMinutes <= 0
  ) {
    return createEmptyResult({
      bookableItemId,
      date,
      durationMinutes,
    });
  }

  const reservations = getMockReservations().filter(
    (reservation) =>
      reservation.bookableItemId === bookableItemId &&
      reservation.date === date &&
      blockingStatuses.has(reservation.status)
  );

  const currentMinutes =
    now.getHours() * 60 + now.getMinutes();

  const isToday = date === todayValue;

  const slots =
    BOOKING_SCHEDULE.workingIntervals.flatMap(
      (workingInterval) => {
        const intervalStart = timeToMinutes(
          workingInterval.startTime
        );

        const intervalEnd = timeToMinutes(
          workingInterval.endTime
        );

        const availableSlots: BookingTimeSlot[] = [];

        for (
          let start = intervalStart;
          start + durationMinutes <= intervalEnd;
          start += BOOKING_SCHEDULE.slotStepMinutes
        ) {
          const end = start + durationMinutes;

          if (isToday && start <= currentMinutes) {
            continue;
          }

          const hasConflict = reservations.some(
            (reservation) =>
              intervalsOverlap(
                start,
                end,
                timeToMinutes(
                  reservation.startTime
                ),
                timeToMinutes(
                  reservation.endTime
                )
              )
          );

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
    bookableItemId,
    date,
    durationMinutes,
    slots,
  };
}