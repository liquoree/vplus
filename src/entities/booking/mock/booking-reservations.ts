import type { BookingReservation } from '../model/availability-types';

export const initialBookingReservations: BookingReservation[] = [
  {
    id: 'reservation-1',
    catalogItemId: 'quad-bike',
    date: '2026-07-25',
    startTime: '10:00',
    endTime: '12:00',
    status: 'approved',
  },
  {
    id: 'reservation-2',
    catalogItemId: 'quad-bike',
    date: '2026-07-25',
    startTime: '14:00',
    endTime: '17:00',
    status: 'pending',
  },
  {
    id: 'reservation-3',
    catalogItemId: 'snowmobile',
    date: '2026-07-25',
    startTime: '10:00',
    endTime: '11:00',
    status: 'approved',
  },
];