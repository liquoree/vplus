import type {
  CatalogBookingOption,
  CatalogItem,
} from '@/entities/catalog/model/types';
import type { BookingRequestItem } from '@/entities/booking';
import type {
  BookingLine,
  BookingSelectOption,
  InitialBookingParams,
} from '../model/types';

export function createEmptyBookingLine(): BookingLine {
  return {
    id: crypto.randomUUID(),
    catalogItemId: '',
    bookingOptionId: '',
    date: '',
    time: '',
  };
}

export function createInitialBookingLine(
  items: CatalogItem[],
  params: InitialBookingParams
): BookingLine {
  const selectedItem =
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

  return {
    id: crypto.randomUUID(),
    catalogItemId: selectedItem?.id ?? '',
    bookingOptionId: selectedService
      ? `service:${selectedService.id}`
      : '',
    date: '',
    time: '',
  };
}

export function getCatalogItem(items: CatalogItem[], id: string) {
  return items.find((item) => item.id === id);
}

export function getCatalogOptions(
  items: CatalogItem[]
): BookingSelectOption[] {
  return items
    .filter(
      (item) =>
        item.kind === 'vehicle' ||
        item.kind === 'package'
    )
    .map((item) => ({
      value: item.id,
      label: item.title,
    }));
}

export function getBookingServiceOptions(
  line: BookingLine,
  items: CatalogItem[]
): BookingSelectOption[] {
  const selectedItem = getCatalogItem(items, line.catalogItemId);

  if (!selectedItem) {
    return [];
  }

  if (selectedItem.bookingOptions?.length) {
    return selectedItem.bookingOptions.map((option) => ({
      value: option.id,
      label: option.title,
    }));
  }

  return items
    .filter((item) => item.kind === 'service')
    .map((service) => ({
      value: `service:${service.id}`,
      label: service.title,
    }));
}

export function getSelectedBookingOption(
  line: BookingLine,
  items: CatalogItem[]
): CatalogBookingOption | undefined {
  const selectedItem = getCatalogItem(items, line.catalogItemId);

  if (selectedItem?.bookingOptions?.length) {
    return selectedItem.bookingOptions.find(
      (option) => option.id === line.bookingOptionId
    );
  }

  if (!line.bookingOptionId.startsWith('service:')) {
    return undefined;
  }

  const serviceId = line.bookingOptionId.replace('service:', '');

  const service = items.find(
    (item) =>
      item.id === serviceId &&
      item.kind === 'service'
  );

  if (!service) {
    return undefined;
  }

  return {
    id: `service:${service.id}`,
    title: service.title,
    price: service.price,
    relatedServiceSlug: service.slug,
  };
}

export function getBookingLinePrice(
  line: BookingLine,
  items: CatalogItem[]
) {
  return getSelectedBookingOption(line, items)?.price ?? 0;
}

export function buildBookingItems(
  lines: BookingLine[],
  items: CatalogItem[]
): BookingRequestItem[] {
  return lines.map((line) => {
    const catalogItem = getCatalogItem(items, line.catalogItemId);
    const selectedOption = getSelectedBookingOption(line, items);

    return {
      catalogItemId: catalogItem?.id ?? '',
      catalogItemTitle:
        catalogItem?.title ?? 'Не выбрана техника',
      bookingOptionId: selectedOption?.id,
      bookingOptionTitle: selectedOption?.title,
      date: line.date,
      time: line.time,
      hours: selectedOption?.durationHours ?? 0,
      price: selectedOption?.price ?? 0,
    };
  });
}