import type { FormEvent } from 'react';
import {
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  getBookingAvailability,
  submitBookingRequest,
} from '@/entities/booking';
import type { BookingRequestItem } from '@/entities/booking';

import {
  buildBookingItems,
  createEmptyBookingLine,
  createInitialBookingLine,
  getBookableItemOptions,
  getBookingLinePrice,
  getCatalogItem,
  getProgramOptions,
  getSelectedBookingOption,
  getServiceOptions,
  isBookableItemCompatibleWithService,
  isPackageBookingLine,
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
  bookingOptions,
  initialVehicleSlug,
  initialServiceSlug,
  initialPackageSlug,
}: BookingPageProps) {
  const [bookingLines, setBookingLines] =
    useState<BookingLine[]>(() => [
      createInitialBookingLine(
        items,
        bookingOptions,
        {
          initialVehicleSlug,
          initialServiceSlug,
          initialPackageSlug,
        }
      ),
    ]);

  const [
    bookingLineErrors,
    setBookingLineErrors,
  ] = useState<
    Record<string, BookingLineErrors>
  >({});

  const [
    availabilityByLine,
    setAvailabilityByLine,
  ] = useState<
    Record<string, BookingLineAvailability>
  >({});

  const [contacts, setContacts] =
    useState<ContactValues>(initialContacts);

  const [contactErrors, setContactErrors] =
    useState<ContactErrors>({});

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [modalStatus, setModalStatus] =
    useState<
      'success' | 'error' | null
    >(null);

  const [
    submittedBookingItems,
    setSubmittedBookingItems,
  ] = useState<BookingRequestItem[]>([]);

  const availabilityRequestIds = useRef<
    Record<string, number>
  >({});

  const totalPrice = useMemo(() => {
    return bookingLines.reduce(
      (total, line) =>
        total +
        getBookingLinePrice(
          line,
          bookingOptions
        ),
      0
    );
  }, [bookingLines, bookingOptions]);

  const prepaymentPrice =
    Math.ceil(totalPrice / 2);

  const minDate = getTodayDateValue();
  const maxDate = getMaxBookingDateValue();

  const clearBookingLineErrors = (
    lineId: string,
    patch: Partial<BookingLine>
  ) => {
    setBookingLineErrors((currentErrors) => {
      const currentLineErrors =
        currentErrors[lineId];

      if (!currentLineErrors) {
        return currentErrors;
      }

      const nextLineErrors = {
        ...currentLineErrors,
      };

      const errorFields: Array<
        keyof BookingLineErrors
      > = [
        'serviceId',
        'bookableItemId',
        'bookingOptionId',
        'date',
        'time',
      ];

      errorFields.forEach((field) => {
        if (field in patch) {
          delete nextLineErrors[field];
        }
      });

      const nextErrors = {
        ...currentErrors,
      };

      if (
        Object.keys(nextLineErrors).length === 0
      ) {
        delete nextErrors[lineId];
      } else {
        nextErrors[lineId] = nextLineErrors;
      }

      return nextErrors;
    });
  };

  const updateBookingLine = (
    lineId: string,
    patch: Partial<BookingLine>
  ) => {
    setBookingLines((currentLines) =>
      currentLines.map((line) =>
        line.id === lineId
          ? {
              ...line,
              ...patch,
            }
          : line
      )
    );

    clearBookingLineErrors(lineId, patch);
  };

  const updateContact = <
    Key extends keyof ContactValues,
  >(
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

  const clearAvailability = (
    lineId: string
  ) => {
    availabilityRequestIds.current[lineId] =
      (availabilityRequestIds.current[lineId] ??
        0) + 1;

    setAvailabilityByLine(
      (currentAvailability) => ({
        ...currentAvailability,
        [lineId]: {
          isLoading: false,
          timeOptions: [],
        },
      })
    );
  };

  const loadAvailability = async (
    line: BookingLine
  ) => {
    const requestId =
      (availabilityRequestIds.current[line.id] ??
        0) + 1;

    availabilityRequestIds.current[line.id] =
      requestId;

    const selectedOption =
      getSelectedBookingOption(
        line,
        bookingOptions
      );

    if (
      !line.bookableItemId ||
      !line.date ||
      !selectedOption ||
      selectedOption.durationMinutes <= 0
    ) {
      setAvailabilityByLine(
        (currentAvailability) => ({
          ...currentAvailability,
          [line.id]: {
            isLoading: false,
            timeOptions: [],
          },
        })
      );

      return;
    }

    setAvailabilityByLine(
      (currentAvailability) => ({
        ...currentAvailability,
        [line.id]: {
          isLoading: true,
          timeOptions: [],
        },
      })
    );

    try {
        const result =
        await getBookingAvailability({
            bookableItemId:
            line.bookableItemId,

            date: line.date,

            durationMinutes:
            selectedOption.durationMinutes,
        });

      if (
        availabilityRequestIds.current[
          line.id
        ] !== requestId
      ) {
        return;
      }

      setAvailabilityByLine(
        (currentAvailability) => ({
          ...currentAvailability,
          [line.id]: {
            isLoading: false,

            timeOptions: result.slots.map(
              (slot) => ({
                value: slot.startTime,
                label: `${slot.startTime}–${slot.endTime}`,
              })
            ),
          },
        })
      );
    } catch {
      if (
        availabilityRequestIds.current[
          line.id
        ] !== requestId
      ) {
        return;
      }

      setAvailabilityByLine(
        (currentAvailability) => ({
          ...currentAvailability,
          [line.id]: {
            isLoading: false,
            timeOptions: [],
          },
        })
      );
    }
  };

  const handleServiceChange = (
    line: BookingLine,
    serviceId: string
  ) => {
    if (!serviceId) {
      updateBookingLine(line.id, {
        serviceId: '',
        bookingOptionId: '',

        selectionSource:
          line.bookableItemId
            ? 'bookable'
            : null,

        time: '',
      });

      clearAvailability(line.id);
      return;
    }

    const canKeepBookableItem =
      isBookableItemCompatibleWithService(
        line.bookableItemId,
        serviceId,
        bookingOptions
      );

    const nextBookableItemId =
      canKeepBookableItem
        ? line.bookableItemId
        : '';

    /*
     * Если техника сохранилась, сохраняем и первоначальный
     * источник выбора.
     *
     * Если технику пришлось очистить, новой основной
     * точкой выбора становится услуга.
     */
    const nextSelectionSource =
      nextBookableItemId
        ? line.selectionSource ?? 'service'
        : 'service';

    updateBookingLine(line.id, {
      serviceId,
      bookableItemId:
        nextBookableItemId,

      bookingOptionId: '',
      selectionSource:
        nextSelectionSource,

      time: '',
    });

    clearAvailability(line.id);
  };

  const handleBookableItemChange = (
    line: BookingLine,
    bookableItemId: string
  ) => {
    if (!bookableItemId) {
      updateBookingLine(line.id, {
        bookableItemId: '',
        bookingOptionId: '',

        selectionSource:
          line.serviceId
            ? 'service'
            : null,

        time: '',
      });

      clearAvailability(line.id);
      return;
    }

    const selectedItem = getCatalogItem(
      items,
      bookableItemId
    );

    if (selectedItem?.kind === 'package') {
      updateBookingLine(line.id, {
        serviceId: '',
        bookableItemId,
        bookingOptionId: '',

        /*
         * Пакет является самостоятельной программой,
         * поэтому источник выбора становится bookable.
         */
        selectionSource: 'bookable',

        time: '',
      });

      clearAvailability(line.id);
      return;
    }

    const canKeepService =
      isBookableItemCompatibleWithService(
        bookableItemId,
        line.serviceId,
        bookingOptions
      );

    const nextServiceId =
      canKeepService
        ? line.serviceId
        : '';

    /*
     * Если услуга сохранилась, не меняем первоначальный
     * источник подбора.
     *
     * Если услуга несовместима и была очищена,
     * основной точкой выбора становится техника.
     */
    const nextSelectionSource =
      nextServiceId
        ? line.selectionSource ?? 'bookable'
        : 'bookable';

    updateBookingLine(line.id, {
      serviceId: nextServiceId,
      bookableItemId,
      bookingOptionId: '',

      selectionSource:
        nextSelectionSource,

      time: '',
    });

    clearAvailability(line.id);
  };

  const handleBookingOptionChange = (
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

    if (
      bookingOptionId &&
      nextLine.date
    ) {
      void loadAvailability(nextLine);
      return;
    }

    clearAvailability(line.id);
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

  const removeBookingLine = (
    lineId: string
  ) => {
    availabilityRequestIds.current[lineId] =
      (availabilityRequestIds.current[lineId] ??
        0) + 1;

    setBookingLines((currentLines) =>
      currentLines.filter(
        (line) => line.id !== lineId
      )
    );

    setBookingLineErrors((currentErrors) => {
      const nextErrors = {
        ...currentErrors,
      };

      delete nextErrors[lineId];

      return nextErrors;
    });

    setAvailabilityByLine(
      (currentAvailability) => {
        const nextAvailability = {
          ...currentAvailability,
        };

        delete nextAvailability[lineId];

        return nextAvailability;
      }
    );

    delete availabilityRequestIds.current[
      lineId
    ];
  };

  const getLineServiceOptions = (
    line: BookingLine
  ) => {
    return getServiceOptions(
      line,
      items,
      bookingOptions
    );
  };

  const getLineBookableOptions = (
    line: BookingLine
  ) => {
    return getBookableItemOptions(
      line,
      items,
      bookingOptions
    );
  };

  const getLineProgramOptions = (
    line: BookingLine
  ) => {
    return getProgramOptions(
      line,
      bookingOptions
    );
  };

  const isLinePackage = (
    line: BookingLine
  ) => {
    return isPackageBookingLine(
      line,
      items
    );
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const nextBookingLineErrors =
      validateBookingLines(
        bookingLines,
        items,
        bookingOptions
      );

    const nextContactErrors =
      validateContacts(contacts);

    setBookingLineErrors(
      nextBookingLineErrors
    );

    setContactErrors(
      nextContactErrors
    );

    if (
      Object.keys(
        nextBookingLineErrors
      ).length > 0 ||
      Object.keys(
        nextContactErrors
      ).length > 0
    ) {
      return;
    }

    const bookingItems =
      buildBookingItems(
        bookingLines,
        items,
        bookingOptions
      );

    setSubmittedBookingItems(
      bookingItems
    );

    setIsSubmitting(true);

    try {
      const result =
        await submitBookingRequest({
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

    minDate,
    maxDate,

    totalPrice,
    prepaymentPrice,

    isSubmitting,
    modalStatus,
    submittedBookingItems,

    getLineServiceOptions,
    getLineBookableOptions,
    getLineProgramOptions,
    isLinePackage,

    handleServiceChange,
    handleBookableItemChange,
    handleBookingOptionChange,
    handleDateChange,
    handleTimeChange,

    addBookingLine,
    removeBookingLine,

    updateContact,
    handleSubmit,
    closeModal,
  };
}