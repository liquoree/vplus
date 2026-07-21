export type CatalogItemKind = 'vehicle' | 'service' | 'package';

export type Season = 'summer' | 'winter' | 'all_season';

export type PriceUnit = 'hour' | 'fixed';

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

export type CatalogBookingOption = {
  id: string;
  title: string;
  price: number;
  durationHours?: number;
  relatedServiceSlug?: string;
};

export type CatalogItemBase = {
  id: string;
  slug: string;
  kind: CatalogItemKind;
  title: string;
  description: string;
  price: number;
  priceUnit: PriceUnit;
  images: CatalogImage[];
  characteristics?: CatalogCharacteristic[];
  bookingOptions?: CatalogBookingOption[];
  availableHours?: number[];
  isAvailable: boolean;
  isPopular: boolean;
};

export type VehicleItem = CatalogItemBase & {
  kind: 'vehicle';
  season: Season;
  serviceIds: string[];
};

export type ServiceItem = CatalogItemBase & {
  kind: 'service';
  bookingMode: 'requires_vehicle';
};

export type PackageItem = CatalogItemBase & {
  kind: 'package';
  includedVehicleIds: string[];
  includedServiceIds: string[];
};

export type CatalogItem = VehicleItem | ServiceItem | PackageItem;