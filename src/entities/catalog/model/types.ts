export type CatalogItemKind = 'vehicle' | 'service' | 'package';

export type Season = 'summer' | 'winter' | 'all_season';

export type PriceUnit = 'hour' | 'fixed';

export type DurationUnit = 'minutes' | 'hours';

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

    price: number;
    oldPrice: number | null;
    priceUnit: PriceUnit;

    images: CatalogImage[];
    characteristics: CatalogCharacteristic[];

    isAvailable: boolean;
};

export type VehicleItem = CatalogItemBase & {
    kind: 'vehicle';
    season: Season;
};

export type ServiceItem = CatalogItemBase & {
    kind: 'service';
};

export type PackageItem = CatalogItemBase & {
    kind: 'package';
    includedVehicleIds: string[];
    includedServiceIds: string[];
};

export type CatalogItem = VehicleItem | ServiceItem | PackageItem;

export type BookableCatalogItem = VehicleItem | PackageItem;
