import type {
  CatalogBookingOption,
  CatalogItem,
} from '@/entities/catalog';

export type BookingPageProps = {
  items: CatalogItem[];
  bookingOptions: CatalogBookingOption[];

  initialVehicleSlug?: string;
  initialServiceSlug?: string;
  initialPackageSlug?: string;
};

export type InitialBookingParams = {
  initialVehicleSlug?: string;
  initialServiceSlug?: string;
  initialPackageSlug?: string;
};

export type BookingSelectionSource =
  | 'service'
  | 'bookable'
  | null;

export type BookingLine = {
  id: string;

  serviceId: string;
  bookableItemId: string;
  bookingOptionId: string;

  /**
   * Поле, с которого пользователь начал подбор.
   *
   * Если service — список услуг остаётся полным,
   * а техника фильтруется по услуге.
   *
   * Если bookable — список техники остаётся полным,
   * а услуги фильтруются по технике.
   */
  selectionSource: BookingSelectionSource;

  date: string;
  time: string;
};

export type BookingLineErrors = {
  serviceId?: string;
  bookableItemId?: string;
  bookingOptionId?: string;
  date?: string;
  time?: string;
};

export type BookingSelectOption = {
  value: string;
  label: string;
};

export type BookingLineAvailability = {
  isLoading: boolean;
  timeOptions: BookingSelectOption[];
};

export type ContactValues = {
  name: string;
  email: string;
  phone: string;
  bookingTerms: boolean;
  personalData: boolean;
};

export type ContactErrors = Partial<
  Record<keyof ContactValues, string>
>;