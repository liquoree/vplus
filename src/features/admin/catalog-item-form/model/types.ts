import type {
  CatalogBookingOption,
  CatalogItem,
  CatalogItemKind,
  PriceUnit,
  Season,
} from '@/entities/catalog';

export type CatalogItemFormMode =
  | 'create'
  | 'edit';

export type CatalogItemFormImage = {
  id: string;
  url: string;
  alt: string;
  file?: File;
};

export type CatalogBookingOptionFormValue = {
  id: string;
  serviceId: string;
  peopleCount: string;
  durationHours: string;
  price: string;
  isActive: boolean;
};

export type CatalogItemFormValues = {
  id: string;
  slug: string;

  kind: CatalogItemKind;

  title: string;
  description: string;

  price: string;
  oldPrice: string;
  priceUnit: PriceUnit;

  characteristicsText: string;

  season: Season;

  includedVehicleIds: string[];
  includedServiceIds: string[];

  isAvailable: boolean;

  images: CatalogItemFormImage[];

  bookingOptions:
    CatalogBookingOptionFormValue[];
};

export type CatalogItemFormErrors = {
  title?: string;
  price?: string;
  oldPrice?: string;
  images?: string;
  packageItems?: string;
  bookingOptions?: string;
  submit?: string;

  optionRows: Record<string, string>;
};

export type CatalogItemFormSubmitPayload = {
  item: CatalogItem;
  bookingOptions: CatalogBookingOption[];

  /**
   * При подключении FastAPI эти файлы
   * отправляются через multipart/form-data.
   */
  imageFiles: File[];
};