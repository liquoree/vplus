import type {
  BookingCustomer,
  BookingRequestItem,
  BookingRequestRecord,
  BookingRequestStatus,
} from '../model/types';

import { initialBookingRequests } from './booking-requests';

const STORAGE_KEY = 'booking-requests-v1';

const INITIAL_SNAPSHOT = JSON.stringify(
  initialBookingRequests
);

const subscribers = new Set<() => void>();

function isBrowser() {
  return typeof window !== 'undefined';
}

function isBookingRequestStatus(
  value: unknown
): value is BookingRequestStatus {
  return (
    value === 'pending' ||
    value === 'approved' ||
    value === 'rejected'
  );
}

function isBookingCustomer(
  value: unknown
): value is BookingCustomer {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const customer =
    value as Partial<BookingCustomer>;

  return (
    typeof customer.name === 'string' &&
    typeof customer.email === 'string' &&
    typeof customer.phone === 'string'
  );
}

function isBookingRequestItem(
  value: unknown
): value is BookingRequestItem {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const item =
    value as Partial<BookingRequestItem>;

  return (
    typeof item.bookingOptionId === 'string' &&
    typeof item.bookableItemId === 'string' &&
    typeof item.bookableItemTitle === 'string' &&
    (typeof item.serviceId === 'string' ||
      item.serviceId === null) &&
    (typeof item.serviceTitle === 'string' ||
      typeof item.serviceTitle === 'undefined') &&
    typeof item.bookingOptionTitle === 'string' &&
    typeof item.date === 'string' &&
    typeof item.time === 'string' &&
    typeof item.durationMinutes === 'number' &&
    typeof item.price === 'number'
  );
}

function isBookingRequestRecord(
  value: unknown
): value is BookingRequestRecord {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const request =
    value as Partial<BookingRequestRecord>;

  return (
    typeof request.id === 'string' &&
    Array.isArray(request.items) &&
    request.items.every(
      isBookingRequestItem
    ) &&
    isBookingCustomer(request.customer) &&
    typeof request.totalPrice === 'number' &&
    typeof request.prepaymentPrice ===
      'number' &&
    isBookingRequestStatus(request.status) &&
    typeof request.createdAt === 'string' &&
    (typeof request.reviewedAt === 'string' ||
      request.reviewedAt === null)
  );
}

function isValidSnapshot(snapshot: string) {
  try {
    const value: unknown = JSON.parse(snapshot);

    return (
      Array.isArray(value) &&
      value.every(isBookingRequestRecord)
    );
  } catch {
    return false;
  }
}

function emitChange() {
  subscribers.forEach((subscriber) => {
    subscriber();
  });
}

function saveBookingRequests(
  requests: BookingRequestRecord[]
) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(requests)
  );

  emitChange();
}

export function parseBookingRequestsSnapshot(
  snapshot: string
): BookingRequestRecord[] {
  try {
    const value: unknown = JSON.parse(snapshot);

    if (
      Array.isArray(value) &&
      value.every(isBookingRequestRecord)
    ) {
      return value;
    }
  } catch {
    // Возвращаем начальные данные ниже.
  }

  return initialBookingRequests.map(
    (request) => ({
      ...request,
      customer: {
        ...request.customer,
      },
      items: request.items.map((item) => ({
        ...item,
      })),
    })
  );
}

export function getBookingRequestsSnapshot() {
  if (!isBrowser()) {
    return INITIAL_SNAPSHOT;
  }

  const storedValue =
    window.localStorage.getItem(STORAGE_KEY);

  if (
    !storedValue ||
    !isValidSnapshot(storedValue)
  ) {
    return INITIAL_SNAPSHOT;
  }

  return storedValue;
}

export function getBookingRequestsServerSnapshot() {
  return INITIAL_SNAPSHOT;
}

export function subscribeBookingRequests(
  subscriber: () => void
) {
  subscribers.add(subscriber);

  const handleStorage = (
    event: StorageEvent
  ) => {
    if (event.key === STORAGE_KEY) {
      subscriber();
    }
  };

  if (isBrowser()) {
    window.addEventListener(
      'storage',
      handleStorage
    );
  }

  return () => {
    subscribers.delete(subscriber);

    if (isBrowser()) {
      window.removeEventListener(
        'storage',
        handleStorage
      );
    }
  };
}

export function getMockBookingRequests() {
  return parseBookingRequestsSnapshot(
    getBookingRequestsSnapshot()
  );
}

export function addMockBookingRequest(
  request: BookingRequestRecord
) {
  const currentRequests =
    getMockBookingRequests();

  saveBookingRequests([
    request,
    ...currentRequests,
  ]);
}

export function updateMockBookingRequestStatus(
  requestId: string,
  status: Exclude<
    BookingRequestStatus,
    'pending'
  >
) {
  const currentRequests =
    getMockBookingRequests();

  let updatedRequest:
    | BookingRequestRecord
    | undefined;

  const nextRequests =
    currentRequests.map((request) => {
      if (request.id !== requestId) {
        return request;
      }

      updatedRequest = {
        ...request,
        status,
        reviewedAt: new Date().toISOString(),
      };

      return updatedRequest;
    });

  if (!updatedRequest) {
    return undefined;
  }

  saveBookingRequests(nextRequests);

  return updatedRequest;
}