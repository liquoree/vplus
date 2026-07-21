export type BookingRequestItem = {
  catalogItemId: string;
  catalogItemTitle: string;
  bookingOptionId?: string;
  bookingOptionTitle?: string;
  date: string;
  time: string;
  hours: number;
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

export type BookingSubmitResult = {
  success: boolean;
  bookingId?: string;
  message?: string;
  code?: 'BOOKING_CONFLICT' | 'UNKNOWN_ERROR';
};