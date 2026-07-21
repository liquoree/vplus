import type { BookingReservation } from '../model/availability-types';
import { initialBookingReservations } from './booking-reservations';

const STORAGE_KEY = 'booking-reservations';

function isBrowser() {
  return typeof window !== 'undefined';
}

export function getMockReservations(): BookingReservation[] {
  if (!isBrowser()) {
    return initialBookingReservations;
  }

  const storedValue = window.localStorage.getItem(STORAGE_KEY);

  if (!storedValue) {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(initialBookingReservations)
    );

    return initialBookingReservations;
  }

  try {
    return JSON.parse(storedValue) as BookingReservation[];
  } catch {
    return initialBookingReservations;
  }
}

export function addMockReservations(
  reservations: BookingReservation[]
) {
  if (!isBrowser()) {
    return;
  }

  const currentReservations = getMockReservations();

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([
      ...currentReservations,
      ...reservations,
    ])
  );
}