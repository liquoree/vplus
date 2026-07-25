export type CatalogItemKind = 'vehicle' | 'service' | 'package';

export type Season = 'summer' | 'winter' | 'all_season';

export type PriceUnit = 'hour' | 'fixed';

export type ServiceBookingMode =
  | 'requires_bookable_item'
  | 'standalone';

export type CatalogCharacteristic = {
  name: string;
  value: string;
};

export type CatalogImage = {
  id: string;
  url: string;
  alt?: string;
  sortOrder: number;
  isMain: boolean;
};

export type CatalogItemBase = {
  id: string;
  slug: string;
  kind: CatalogItemKind;
  title: string;
  description: string;

  /**
   * Минимальная цена для отображения карточки:
   * «от 3 500 ₽/ч».
   *
   * Точная стоимость бронирования хранится
   * в CatalogBookingOption.
   */
  price: number;
  priceUnit: PriceUnit;

  images: CatalogImage[];
  characteristics: CatalogCharacteristic[];

  isAvailable: boolean;
  isPopular: boolean;
};

export type VehicleItem = CatalogItemBase & {
  kind: 'vehicle';
  season: Season;
};

export type ServiceItem = CatalogItemBase & {
  kind: 'service';
  bookingMode: ServiceBookingMode;
};

export type PackageItem = CatalogItemBase & {
  kind: 'package';
  includedVehicleIds: string[];
  includedServiceIds: string[];
};

export type CatalogItem =
  | VehicleItem
  | ServiceItem
  | PackageItem;

export type BookableCatalogItem =
  | VehicleItem
  | PackageItem;