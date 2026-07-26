import type { BookingReservation } from '../model/availability-types';

function getRelativeDateValue(daysAhead: number) {
  const date = new Date();

  date.setDate(date.getDate() + daysAhead);

  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, '0');

  const day = String(
    date.getDate()
  ).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

const tomorrow = getRelativeDateValue(1);
const dayAfterTomorrow = getRelativeDateValue(2);
const thirdDay = getRelativeDateValue(3);

export const initialBookingReservations: BookingReservation[] =
  [
    {
      id: 'reservation-1',
      bookingRequestId:
        'booking-request-1',

      bookableItemId: 'quad-bike',
      bookingOptionId:
        'quad-base-2-2h',

      date: tomorrow,
      startTime: '10:00',
      endTime: '12:00',

      status: 'pending',
    },
    {
      id: 'reservation-2',
      bookingRequestId:
        'booking-request-2',

      bookableItemId: 'quad-bike',
      bookingOptionId:
        'quad-fishing-2-3h',

      date: dayAfterTomorrow,
      startTime: '14:00',
      endTime: '17:00',

      status: 'approved',
    },
    {
      id: 'reservation-3',
      bookingRequestId:
        'booking-request-3',

      bookableItemId: 'snowmobile',
      bookingOptionId:
        'snowmobile-base-1-1h',

      date: thirdDay,
      startTime: '10:00',
      endTime: '11:00',

      status: 'rejected',
    },
  ];