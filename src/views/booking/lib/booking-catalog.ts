import type { BookingRequestItem } from '@/entities/booking';
import type {
  CatalogBookingOption,
  CatalogItem,
} from '@/entities/catalog';

import type {
  BookingLine,
  BookingSelectOption,
  InitialBookingParams,
} from '../model/types';

function formatDuration(durationMinutes: number) {
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;

  if (hours > 0 && minutes > 0) {
    return `${hours} ч. ${minutes} мин.`;
  }

  if (hours > 0) {
    return `${hours} ч.`;
  }

  return `${minutes} мин.`;
}

function formatPeopleCount(count: number) {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastDigit === 1 && lastTwoDigits !== 11) {
    return `${count} человек`;
  }

  if (
    lastDigit >= 2 &&
    lastDigit <= 4 &&
    (lastTwoDigits < 12 || lastTwoDigits > 14)
  ) {
    return `${count} человека`;
  }

  return `${count} человек`;
}

function sortBookingOptions(
  options: CatalogBookingOption[]
) {
  return [...options].sort(
    (first, second) =>
      first.sortOrder - second.sortOrder
  );
}

function getServiceItem(
  items: CatalogItem[],
  serviceId: string | null
) {
  if (!serviceId) {
    return undefined;
  }

  return items.find(
    (item) =>
      item.kind === 'service' &&
      item.id === serviceId
  );
}

export function getBookingOptionLabel(
  option: CatalogBookingOption
) {
  const people = formatPeopleCount(
    option.peopleCount
  );

  const duration = formatDuration(
    option.durationMinutes
  );

  const price = option.price.toLocaleString(
    'ru-RU'
  );

  return `${people}, ${duration} — ${price} ₽`;
}

export function getBookingOptionFullLabel(
  option: CatalogBookingOption,
  items: CatalogItem[]
) {
  const service = getServiceItem(
    items,
    option.serviceId
  );

  const serviceTitle =
    service?.title ?? 'Готовая программа';

  return `${serviceTitle} — ${getBookingOptionLabel(
    option
  )}`;
}

export function createEmptyBookingLine(): BookingLine {
  return {
    id: crypto.randomUUID(),

    serviceId: '',
    bookableItemId: '',
    bookingOptionId: '',

    selectionSource: null,

    date: '',
    time: '',
  };
}

export function createInitialBookingLine(
  items: CatalogItem[],
  bookingOptions: CatalogBookingOption[],
  params: InitialBookingParams
): BookingLine {
  const selectedBookableItem =
    items.find(
      (item) =>
        item.kind === 'vehicle' &&
        item.slug === params.initialVehicleSlug
    ) ??
    items.find(
      (item) =>
        item.kind === 'package' &&
        item.slug === params.initialPackageSlug
    );

  const selectedService = items.find(
    (item) =>
      item.kind === 'service' &&
      item.slug === params.initialServiceSlug
  );

  const selectionsAreCompatible =
    selectedBookableItem &&
    selectedService
      ? bookingOptions.some(
          (option) =>
            option.isActive &&
            option.bookableItemId ===
              selectedBookableItem.id &&
            option.serviceId === selectedService.id
        )
      : false;

  /*
   * Если одновременно переданы несовместимые service и vehicle,
   * сохраняем услугу, а технику просим выбрать заново.
   */
  const bookableItemId =
    selectedBookableItem &&
    (!selectedService || selectionsAreCompatible)
      ? selectedBookableItem.id
      : '';

  const selectionSource = selectedService
    ? 'service'
    : selectedBookableItem
      ? 'bookable'
      : null;

  return {
    id: crypto.randomUUID(),

    serviceId: selectedService?.id ?? '',
    bookableItemId,
    bookingOptionId: '',

    selectionSource,

    date: '',
    time: '',
  };
}

export function getCatalogItem(
  items: CatalogItem[],
  itemId: string
) {
  return items.find(
    (item) => item.id === itemId
  );
}

export function isPackageBookingLine(
  line: BookingLine,
  items: CatalogItem[]
) {
  const item = getCatalogItem(
    items,
    line.bookableItemId
  );

  return item?.kind === 'package';
}

export function getBookableItemOptions(
  line: BookingLine,
  items: CatalogItem[],
  bookingOptions: CatalogBookingOption[]
): BookingSelectOption[] {
  const shouldFilterByService =
    line.selectionSource === 'service' &&
    Boolean(line.serviceId);

  const availableBookableItemIds = new Set(
    bookingOptions
      .filter((option) => {
        if (!option.isActive) {
          return false;
        }

        if (!shouldFilterByService) {
          return true;
        }

        return option.serviceId === line.serviceId;
      })
      .map((option) => option.bookableItemId)
  );

  return items
    .filter(
      (item) =>
        (item.kind === 'vehicle' ||
          item.kind === 'package') &&
        item.isAvailable &&
        availableBookableItemIds.has(item.id)
    )
    .map((item) => ({
      value: item.id,
      label: item.title,
    }));
}

export function getServiceOptions(
  line: BookingLine,
  items: CatalogItem[],
  bookingOptions: CatalogBookingOption[]
): BookingSelectOption[] {
  const selectedBookableItem = getCatalogItem(
    items,
    line.bookableItemId
  );

  if (selectedBookableItem?.kind === 'package') {
    return [];
  }

  const shouldFilterByBookableItem =
    line.selectionSource === 'bookable' &&
    Boolean(line.bookableItemId);

  const availableServiceIds = new Set(
    bookingOptions
      .filter((option) => {
        if (
          !option.isActive ||
          option.serviceId === null
        ) {
          return false;
        }

        if (!shouldFilterByBookableItem) {
          return true;
        }

        return (
          option.bookableItemId ===
          line.bookableItemId
        );
      })
      .map((option) => option.serviceId)
  );

  return items
    .filter(
      (item) =>
        item.kind === 'service' &&
        item.isAvailable &&
        availableServiceIds.has(item.id)
    )
    .map((service) => ({
      value: service.id,
      label: service.title,
    }));
}

export function getProgramOptions(
  line: BookingLine,
  bookingOptions: CatalogBookingOption[]
): BookingSelectOption[] {
  if (!line.bookableItemId) {
    return [];
  }

  const options = bookingOptions.filter(
    (option) => {
      if (
        !option.isActive ||
        option.bookableItemId !==
          line.bookableItemId
      ) {
        return false;
      }

      if (option.serviceId === null) {
        return line.serviceId === '';
      }

      return option.serviceId === line.serviceId;
    }
  );

  return sortBookingOptions(options).map(
    (option) => ({
      value: option.id,
      label: getBookingOptionLabel(option),
    })
  );
}

export function getSelectedBookingOption(
  line: BookingLine,
  bookingOptions: CatalogBookingOption[]
): CatalogBookingOption | undefined {
  return bookingOptions.find((option) => {
    if (
      !option.isActive ||
      option.id !== line.bookingOptionId ||
      option.bookableItemId !==
        line.bookableItemId
    ) {
      return false;
    }

    if (option.serviceId === null) {
      return line.serviceId === '';
    }

    return option.serviceId === line.serviceId;
  });
}

export function getBookingLinePrice(
  line: BookingLine,
  bookingOptions: CatalogBookingOption[]
) {
  return (
    getSelectedBookingOption(
      line,
      bookingOptions
    )?.price ?? 0
  );
}

export function isBookableItemCompatibleWithService(
  bookableItemId: string,
  serviceId: string,
  bookingOptions: CatalogBookingOption[]
) {
  if (!bookableItemId || !serviceId) {
    return false;
  }

  return bookingOptions.some(
    (option) =>
      option.isActive &&
      option.bookableItemId === bookableItemId &&
      option.serviceId === serviceId
  );
}

export function buildBookingItems(
  lines: BookingLine[],
  items: CatalogItem[],
  bookingOptions: CatalogBookingOption[]
): BookingRequestItem[] {
  return lines.map((line) => {
    const bookableItem = getCatalogItem(
      items,
      line.bookableItemId
    );

    const selectedOption =
      getSelectedBookingOption(
        line,
        bookingOptions
      );

    return {
      /*
       * Временная совместимость со старой
       * моделью entities/booking.
       */
      catalogItemId: bookableItem?.id ?? '',

      catalogItemTitle:
        bookableItem?.title ??
        'Не выбрана техника',

      bookingOptionId: selectedOption?.id,

      bookingOptionTitle: selectedOption
        ? getBookingOptionFullLabel(
            selectedOption,
            items
          )
        : undefined,

      date: line.date,
      time: line.time,

      hours: selectedOption
        ? selectedOption.durationMinutes / 60
        : 0,

      price: selectedOption?.price ?? 0,
    };
  });
}