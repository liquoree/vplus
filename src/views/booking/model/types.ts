import type { CatalogItem } from '@/entities/catalog/model/types';

export type BookingPageProps = {
  items: CatalogItem[];
  initialVehicleSlug?: string;
  initialServiceSlug?: string;
  initialPackageSlug?: string;
};

export type InitialBookingParams = {
  initialVehicleSlug?: string;
  initialServiceSlug?: string;
  initialPackageSlug?: string;
};

export type BookingLine = {
  id: string;
  catalogItemId: string;
  bookingOptionId: string;
  date: string;
  time: string;
};

export type BookingLineErrors = Partial<
  Record<keyof Omit<BookingLine, 'id'>, string>
>;

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
  privacy: boolean;
  personalData: boolean;
};

export type ContactErrors = Partial<Record<keyof ContactValues, string>>;