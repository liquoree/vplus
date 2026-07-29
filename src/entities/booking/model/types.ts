export type BookingRequestItem = {
  bookingOptionId: string;

  bookableItemId: string;
  bookableItemTitle: string;

  serviceId: string | null;
  serviceTitle?: string;

  bookingOptionTitle: string;

  date: string;
  time: string;

  durationMinutes: number;
  price: number;
};

export type BookingCustomer = {
  name: string;
  email: string;
  phone: string;
};

export type BookingRequestPayload = {
  items: BookingRequestItem[];
  customer: BookingCustomer;

  totalPrice: number;
  prepaymentPrice: number;
};

export type BookingRequestStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'cancelled';

export type BookingRequestDecision = Exclude<
  BookingRequestStatus,
  'pending'
>;

export type BookingRequestRecord = {
  id: string;

  items: BookingRequestItem[];
  customer: BookingCustomer;

  totalPrice: number;
  prepaymentPrice: number;

  status: BookingRequestStatus;

  createdAt: string;
  reviewedAt: string | null;
};

export type BookingSubmitResult = {
  success: boolean;
  bookingId?: string;
  message?: string;

  code?:
    | 'BOOKING_CONFLICT'
    | 'VALIDATION_ERROR'
    | 'UNKNOWN_ERROR';
};

export type BookingRequestStatusUpdateResult = {
  success: boolean;
  request?: BookingRequestRecord;
  message?: string;
};