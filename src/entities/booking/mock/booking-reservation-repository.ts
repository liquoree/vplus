import type {
  BookingReservation,
  BookingReservationStatus,
} from '../model/availability-types';

import { initialBookingReservations } from './booking-reservations';

const STORAGE_KEY =
  'booking-reservations-v3';

const reservationStatuses =
  new Set<BookingReservationStatus>([
    'pending',
    'approved',
    'rejected',
    'cancelled',
  ]);

type ReservationDecisionStatus =
  | 'approved'
  | 'rejected'
  | 'cancelled';

function isBrowser() {
  return typeof window !== 'undefined';
}

function cloneInitialReservations() {
  return initialBookingReservations.map(
    (reservation) => ({
      ...reservation,
    })
  );
}

function isBookingReservation(
  value: unknown
): value is BookingReservation {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const reservation =
    value as Partial<BookingReservation>;

  return (
    typeof reservation.id === 'string' &&
    typeof reservation.bookingRequestId ===
      'string' &&
    typeof reservation.bookableItemId ===
      'string' &&
    typeof reservation.bookingOptionId ===
      'string' &&
    typeof reservation.date === 'string' &&
    typeof reservation.startTime === 'string' &&
    typeof reservation.endTime === 'string' &&
    typeof reservation.status === 'string' &&
    reservationStatuses.has(
      reservation.status as BookingReservationStatus
    )
  );
}

function saveReservations(
  reservations: BookingReservation[]
) {
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(reservations)
  );
}

export function getMockReservations(): BookingReservation[] {
  if (!isBrowser()) {
    return cloneInitialReservations();
  }

  const storedValue =
    window.localStorage.getItem(STORAGE_KEY);

  if (!storedValue) {
    const initialReservations =
      cloneInitialReservations();

    saveReservations(initialReservations);

    return initialReservations;
  }

  try {
    const parsedValue: unknown =
      JSON.parse(storedValue);

    if (
      !Array.isArray(parsedValue) ||
      !parsedValue.every(isBookingReservation)
    ) {
      throw new Error(
        'Некорректная структура бронирований'
      );
    }

    return parsedValue;
  } catch {
    const initialReservations =
      cloneInitialReservations();

    saveReservations(initialReservations);

    return initialReservations;
  }
}

export function addMockReservations(
  reservations: BookingReservation[]
) {
  if (!isBrowser()) {
    return;
  }

  const currentReservations =
    getMockReservations();

  saveReservations([
    ...currentReservations,
    ...reservations,
  ]);
}

export function updateMockReservationsStatusByRequestId(
  bookingRequestId: string,
  status: ReservationDecisionStatus
) {
  if (!isBrowser()) {
    return;
  }

  const currentReservations =
    getMockReservations();

  const nextReservations =
    currentReservations.map((reservation) => {
      if (
        reservation.bookingRequestId !==
        bookingRequestId
      ) {
        return reservation;
      }

      return {
        ...reservation,
        status,
      };
    });

  saveReservations(nextReservations);
}