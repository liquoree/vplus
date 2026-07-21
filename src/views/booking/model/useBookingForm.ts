import type { FormEvent } from 'react';
import { useMemo, useRef, useState } from 'react';

import {
  getBookingAvailability,
  submitBookingRequest,
} from '@/entities/booking';
import type { BookingRequestItem } from '@/entities/booking';

import {
  buildBookingItems,
  createEmptyBookingLine,
  createInitialBookingLine,
  getBookingLinePrice,
  getBookingServiceOptions,
  getCatalogOptions,
  getSelectedBookingOption,
} from '../lib/booking-catalog';
import {
  getMaxBookingDateValue,
  getTodayDateValue,
} from '../lib/booking-date';
import {
  validateBookingLines,
  validateContacts,
} from '../lib/booking-validation';

import type {
  BookingLine,
  BookingLineAvailability,
  BookingLineErrors,
  BookingPageProps,
  ContactErrors,
  ContactValues,
} from './types';

const initialContacts: ContactValues = {
  name: '',
  email: '',
  phone: '',
  privacy: false,
  personalData: false,
};

export function useBookingForm({
  items,
  initialVehicleSlug,
  initialServiceSlug,
  initialPackageSlug,
}: BookingPageProps) {
  const [bookingLines, setBookingLines] = useState<BookingLine[]>(() => [
    createInitialBookingLine(items, {
      initialVehicleSlug,
      initialServiceSlug,
      initialPackageSlug,
    }),
  ]);

  const [bookingLineErrors, setBookingLineErrors] = useState<
    Record<string, BookingLineErrors>
  >({});

  const [availabilityByLine, setAvailabilityByLine] = useState<
    Record<string, BookingLineAvailability>
  >({});

  const [contacts, setContacts] =
    useState<ContactValues>(initialContacts);

  const [contactErrors, setContactErrors] =
    useState<ContactErrors>({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [modalStatus, setModalStatus] = useState<
    'success' | 'error' | null
  >(null);

  const [submittedBookingItems, setSubmittedBookingItems] =
    useState<BookingRequestItem[]>([]);

  /*
   * Номер последнего запроса для каждой строки.
   * Не даёт старому ответу API перезаписать новые слоты,
   * если пользователь быстро меняет дату или услугу.
   */
  const availabilityRequestIds = useRef<Record<string, number>>({});

  const catalogOptions = useMemo(() => {
    return getCatalogOptions(items);
  }, [items]);

  const totalPrice = useMemo(() => {
    return bookingLines.reduce((total, line) => {
      return total + getBookingLinePrice(line, items);
    }, 0);
  }, [bookingLines, items]);

  const prepaymentPrice = Math.ceil(totalPrice / 2);

  const minDate = getTodayDateValue();
  const maxDate = getMaxBookingDateValue();

  const clearBookingLineErrors = (
    id: string,
    patch: Partial<BookingLine>
  ) => {
    setBookingLineErrors((currentErrors) => {
      const currentLineErrors = currentErrors[id];

      if (!currentLineErrors) {
        return currentErrors;
      }

      const nextLineErrors = {
        ...currentLineErrors,
      };

      Object.keys(patch).forEach((key) => {
        if (key !== 'id') {
          delete nextLineErrors[key as keyof BookingLineErrors];
        }
      });

      const nextErrors = {
        ...currentErrors,
      };

      if (Object.keys(nextLineErrors).length === 0) {
        delete nextErrors[id];
      } else {
        nextErrors[id] = nextLineErrors;
      }

      return nextErrors;
    });
  };

  const updateBookingLine = (
    id: string,
    patch: Partial<BookingLine>
  ) => {
    setBookingLines((currentLines) =>
      currentLines.map((line) =>
        line.id === id
          ? {
              ...line,
              ...patch,
            }
          : line
      )
    );

    clearBookingLineErrors(id, patch);
  };

  const updateContact = <Key extends keyof ContactValues>(
    key: Key,
    value: ContactValues[Key]
  ) => {
    setContacts((currentContacts) => ({
      ...currentContacts,
      [key]: value,
    }));

    setContactErrors((currentErrors) => {
      if (!currentErrors[key]) {
        return currentErrors;
      }

      const nextErrors = {
        ...currentErrors,
      };

      delete nextErrors[key];

      return nextErrors;
    });
  };

  const clearAvailability = (lineId: string) => {
    availabilityRequestIds.current[lineId] =
      (availabilityRequestIds.current[lineId] ?? 0) + 1;

    setAvailabilityByLine((currentAvailability) => ({
      ...currentAvailability,
      [lineId]: {
        isLoading: false,
        timeOptions: [],
      },
    }));
  };

  const loadAvailability = async (line: BookingLine) => {
    const requestId =
      (availabilityRequestIds.current[line.id] ?? 0) + 1;

    availabilityRequestIds.current[line.id] = requestId;

    const selectedOption = getSelectedBookingOption(line, items);

    if (
      !line.catalogItemId ||
      !line.date ||
      !selectedOption?.durationHours
    ) {
      setAvailabilityByLine((currentAvailability) => ({
        ...currentAvailability,
        [line.id]: {
          isLoading: false,
          timeOptions: [],
        },
      }));

      return;
    }

    setAvailabilityByLine((currentAvailability) => ({
      ...currentAvailability,
      [line.id]: {
        isLoading: true,
        timeOptions: [],
      },
    }));

    try {
      const result = await getBookingAvailability({
        catalogItemId: line.catalogItemId,
        date: line.date,
        durationMinutes: selectedOption.durationHours * 60,
      });

      if (availabilityRequestIds.current[line.id] !== requestId) {
        return;
      }

      setAvailabilityByLine((currentAvailability) => ({
        ...currentAvailability,
        [line.id]: {
          isLoading: false,
          timeOptions: result.slots.map((slot) => ({
            value: slot.startTime,
            label: `${slot.startTime}–${slot.endTime}`,
          })),
        },
      }));
    } catch {
      if (availabilityRequestIds.current[line.id] !== requestId) {
        return;
      }

      setAvailabilityByLine((currentAvailability) => ({
        ...currentAvailability,
        [line.id]: {
          isLoading: false,
          timeOptions: [],
        },
      }));
    }
  };

  const handleCatalogChange = (
    line: BookingLine,
    catalogItemId: string
  ) => {
    updateBookingLine(line.id, {
      catalogItemId,
      bookingOptionId: '',
      time: '',
    });

    clearAvailability(line.id);
  };

  const handleServiceChange = (
    line: BookingLine,
    bookingOptionId: string
  ) => {
    const nextLine: BookingLine = {
      ...line,
      bookingOptionId,
      time: '',
    };

    updateBookingLine(line.id, {
      bookingOptionId,
      time: '',
    });

    void loadAvailability(nextLine);
  };

  const handleDateChange = (
    line: BookingLine,
    date: string
  ) => {
    const nextLine: BookingLine = {
      ...line,
      date,
      time: '',
    };

    updateBookingLine(line.id, {
      date,
      time: '',
    });

    void loadAvailability(nextLine);
  };

  const handleTimeChange = (
    lineId: string,
    time: string
  ) => {
    updateBookingLine(lineId, {
      time,
    });
  };

  const addBookingLine = () => {
    setBookingLines((currentLines) => [
      ...currentLines,
      createEmptyBookingLine(),
    ]);
  };

  const removeBookingLine = (lineId: string) => {
    availabilityRequestIds.current[lineId] =
      (availabilityRequestIds.current[lineId] ?? 0) + 1;

    setBookingLines((currentLines) =>
      currentLines.filter((line) => line.id !== lineId)
    );

    setBookingLineErrors((currentErrors) => {
      const nextErrors = {
        ...currentErrors,
      };

      delete nextErrors[lineId];

      return nextErrors;
    });

    setAvailabilityByLine((currentAvailability) => {
      const nextAvailability = {
        ...currentAvailability,
      };

      delete nextAvailability[lineId];

      return nextAvailability;
    });

    delete availabilityRequestIds.current[lineId];
  };

  const getServiceOptions = (line: BookingLine) => {
    return getBookingServiceOptions(line, items);
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const nextBookingLineErrors =
      validateBookingLines(bookingLines);

    const nextContactErrors =
      validateContacts(contacts);

    setBookingLineErrors(nextBookingLineErrors);
    setContactErrors(nextContactErrors);

    if (
      Object.keys(nextBookingLineErrors).length > 0 ||
      Object.keys(nextContactErrors).length > 0
    ) {
      return;
    }

    const bookingItems = buildBookingItems(
      bookingLines,
      items
    );

    setSubmittedBookingItems(bookingItems);
    setIsSubmitting(true);

    try {
      const result = await submitBookingRequest({
        items: bookingItems,
        customer: {
          name: contacts.name.trim(),
          email: contacts.email.trim(),
          phone: contacts.phone.trim(),
        },
        totalPrice,
        prepaymentPrice,
      });

      if (!result.success) {
        setModalStatus('error');
        return;
      }

      setModalStatus('success');
    } catch {
      setModalStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setModalStatus(null);
  };

  return {
    bookingLines,
    bookingLineErrors,
    availabilityByLine,

    contacts,
    contactErrors,

    catalogOptions,
    minDate,
    maxDate,

    totalPrice,
    prepaymentPrice,

    isSubmitting,
    modalStatus,
    submittedBookingItems,

    getServiceOptions,

    handleCatalogChange,
    handleServiceChange,
    handleDateChange,
    handleTimeChange,

    addBookingLine,
    removeBookingLine,

    updateContact,
    handleSubmit,
    closeModal,
  };
}