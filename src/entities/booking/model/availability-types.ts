export type BookingAvailabilityQuery = {
  bookableItemId: string;
  date: string;
  durationMinutes: number;
};

export type BookingTimeSlot = {
  startTime: string;
  endTime: string;
};

export type BookingAvailabilityResult = {
  date: string;
  bookableItemId: string;
  durationMinutes: number;
  slots: BookingTimeSlot[];
};

export type BookingReservationStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'cancelled';

export type BookingReservation = {
  id: string;
  bookingRequestId: string;

  bookableItemId: string;
  bookingOptionId: string;

  date: string;
  startTime: string;
  endTime: string;

  status: BookingReservationStatus;
};