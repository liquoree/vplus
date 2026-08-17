import type { CatalogBookingOption } from './booking-option-types';

import type { CatalogItem } from './types';

export type AdminCatalogItem = CatalogItem & {
    version: number;
};

export type AdminCatalogSnapshot = {
    items: AdminCatalogItem[];

    bookingOptions: CatalogBookingOption[];
};
