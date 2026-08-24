export type BookingRequestItem = {
    bookingOptionId: string;

    bookableItemId: string;
    bookableItemTitle: string;

    serviceId: string | null;
    serviceTitle?: string | null;

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

export type BookingRequestStatus = 'active' | 'cancelled';

export type BookingRequestDecision = 'cancelled';

export type BookingRequestRecord = {
    id: string;

    items: BookingRequestItem[];
    customer: BookingCustomer;

    totalPrice: number;
    prepaymentPrice: number;

    status: BookingRequestStatus;

    createdAt: string;
    cancelledAt: string | null;
};

export type AdminBookingRequestRecord = BookingRequestRecord & {
    publicNumber: string;
    version: number;
};

export type BookingCancelResult = {
    success: boolean;
    request?: AdminBookingRequestRecord;
    message?: string;
};

export type BookingSubmitResult = {
    success: boolean;

    bookingId?: string;
    publicNumber?: string;

    totalPrice?: number;
    prepaymentPrice?: number;

    status?: BookingRequestStatus;

    message?: string;

    code?:
        | 'BOOKING_CONFLICT'
        | 'BOOKING_OUTSIDE_SEASON'
        | 'CAPTCHA_FAILED'
        | 'CAPTCHA_UNAVAILABLE'
        | 'VALIDATION_ERROR'
        | 'UNKNOWN_ERROR';
};

export type BookingRequestStatusUpdateResult = BookingCancelResult;
