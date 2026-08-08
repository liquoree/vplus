import {
  apiClient,
} from '@/shared/api/client';

import type {
  BookingAvailabilityQuery,
  BookingAvailabilityResult,
} from '../model/availability-types';

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
  if (
    !bookableItemId ||
    !date ||
    !Number.isFinite(durationMinutes) ||
    durationMinutes <= 0
  ) {
    return createEmptyResult({
      bookableItemId,
      date,
      durationMinutes,
    });
  }

  const response =
    await apiClient.get<BookingAvailabilityResult>(
      '/bookings/availability',
      {
        params: {
          bookableItemId,
          date,
          durationMinutes,
        },
      }
    );

  return response.data;
}