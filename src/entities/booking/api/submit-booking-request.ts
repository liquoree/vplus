import axios from 'axios';

import {
  apiClient,
} from '@/shared/api/client';

import type {
  BookingRequestPayload,
  BookingRequestStatus,
  BookingSubmitResult,
} from '../model/types';

type BookingCreateRequest = {
  items: {
    bookingOptionId: string;
    bookableItemId: string;
    date: string;
    time: string;
  }[];

  customer: {
    name: string;
    email: string;
    phone: string;
  };

  captchaToken: string;
};

type BookingCreateResponse = {
  success?: true;

  bookingId: string;
  publicNumber: string;

  totalPrice: number;
  prepaymentPrice: number;

  status: BookingRequestStatus;

  message: string;
};

type ApiErrorResponse = {
  error?: {
    code?: string;
    message?: string;

    fields?: Record<
      string,
      string
    > | null;

    requestId?: string;
  };
};

function prepareBookingRequest(
  payload: BookingRequestPayload,
  captchaToken: string
): BookingCreateRequest {
  return {
    items: payload.items.map(
      (item) => ({
        bookingOptionId:
          item.bookingOptionId,

        bookableItemId:
          item.bookableItemId,

        date: item.date,
        time: item.time,
      })
    ),

    customer: {
      name:
        payload.customer.name.trim(),

      email:
        payload.customer.email.trim(),

      phone:
        payload.customer.phone.trim(),
    },

    captchaToken,
  };
}

function getSubmitErrorCode(
  backendCode: string | undefined,
  status: number | undefined
): NonNullable<
  BookingSubmitResult['code']
> {
  if (
    backendCode ===
    'BOOKING_CONFLICT'
  ) {
    return 'BOOKING_CONFLICT';
  }

  if (
    backendCode ===
    'BOOKING_OUTSIDE_SEASON'
  ) {
    return 'BOOKING_OUTSIDE_SEASON';
  }

  if (
    backendCode ===
    'CAPTCHA_FAILED'
  ) {
    return 'CAPTCHA_FAILED';
  }

  if (
    backendCode ===
    'CAPTCHA_UNAVAILABLE'
  ) {
    return 'CAPTCHA_UNAVAILABLE';
  }

  if (
    backendCode ===
      'VALIDATION_ERROR' ||
    status === 422
  ) {
    return 'VALIDATION_ERROR';
  }

  return 'UNKNOWN_ERROR';
}

function getFirstFieldError(
  fields:
    | Record<string, string>
    | null
    | undefined
) {
  if (!fields) {
    return null;
  }

  const message =
    Object.values(fields).find(
      (value) =>
        typeof value === 'string' &&
        value.trim().length > 0
    );

  return message ?? null;
}

export async function submitBookingRequest(
  payload: BookingRequestPayload,
  captchaToken: string
): Promise<BookingSubmitResult> {
  if (
    payload.items.length === 0 ||
    !payload.customer.name.trim() ||
    !payload.customer.email.trim() ||
    !payload.customer.phone.trim() ||
    !captchaToken.trim()
  ) {
    return {
      success: false,
      code: 'VALIDATION_ERROR',
      message:
        'Данные заявки заполнены не полностью',
    };
  }

  const request =
    prepareBookingRequest(
      payload,
      captchaToken
    );

  const idempotencyKey =
    crypto.randomUUID();

  try {
    const response =
      await apiClient.post<
        BookingCreateResponse
      >(
        '/bookings',
        request,
        {
          headers: {
            'Idempotency-Key':
              idempotencyKey,
          },
        }
      );

    return {
      success: true,

      bookingId:
        response.data.bookingId,

      publicNumber:
        response.data.publicNumber,

      totalPrice:
        response.data.totalPrice,

      prepaymentPrice:
        response.data.prepaymentPrice,

      status:
        response.data.status,

      message:
        response.data.message,
    };
  } catch (error) {
    if (
      !axios.isAxiosError<ApiErrorResponse>(
        error
      )
    ) {
      return {
        success: false,
        code: 'UNKNOWN_ERROR',
        message:
          'Не удалось отправить заявку',
      };
    }

    const status =
      error.response?.status;

    const backendError =
      error.response?.data?.error;

    return {
      success: false,

      code: getSubmitErrorCode(
        backendError?.code,
        status
      ),

      message:
        getFirstFieldError(
          backendError?.fields
        ) ??
        backendError?.message ??
        'Не удалось отправить заявку',
    };
  }
}