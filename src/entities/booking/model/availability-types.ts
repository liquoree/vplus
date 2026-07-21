export type BookingAvailabilityQuery = {
  catalogItemId: string;
  date: string;
  durationMinutes: number;
};

export type BookingTimeSlot = {
  startTime: string;
  endTime: string;
};

export type BookingAvailabilityResult = {
  date: string;
  catalogItemId: string;
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
  catalogItemId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: BookingReservationStatus;
};