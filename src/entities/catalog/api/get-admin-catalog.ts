import 'server-only';

import { headers } from 'next/headers';

import { serverApiClient } from '@/shared/api/server-client';

import type { CatalogBookingOption } from '../model/booking-option-types';

import type { CatalogCharacteristic, CatalogImage, PriceUnit, Season } from '../model/types';

import type { AdminCatalogItem, AdminCatalogSnapshot } from '../model/admin-types';

type AdminCatalogApiImage = {
    id: string;
    url: string;
    alt: string | null;
    sortOrder: number;
    isMain: boolean;
};

type AdminCatalogApiItemCommon = {
    id: string;
    slug: string;

    title: string;
    description: string;

    price: number;
    oldPrice: number | null;
    priceUnit: PriceUnit;

    images: AdminCatalogApiImage[];

    characteristics: CatalogCharacteristic[];

    isAvailable: boolean;

    version: number;
};

type AdminCatalogApiVehicle = AdminCatalogApiItemCommon & {
    kind: 'vehicle';
    season: Season;
};

type AdminCatalogApiService = AdminCatalogApiItemCommon & {
    kind: 'service';
};

type AdminCatalogApiPackage = AdminCatalogApiItemCommon & {
    kind: 'package';

    includedVehicleIds: string[];
    includedServiceIds: string[];
};

type AdminCatalogApiItem = AdminCatalogApiVehicle | AdminCatalogApiService | AdminCatalogApiPackage;

type AdminCatalogApiResponse = {
    items: AdminCatalogApiItem[];

    bookingOptions: CatalogBookingOption[];
};

function normalizeImages(images: AdminCatalogApiImage[]): CatalogImage[] {
    return images.map((image) => ({
        ...image,

        alt: image.alt ?? undefined,
    }));
}

function normalizeItem(item: AdminCatalogApiItem): AdminCatalogItem {
    const images = normalizeImages(item.images);

    if (item.kind === 'vehicle') {
        return {
            ...item,
            images,
        };
    }

    if (item.kind === 'service') {
        return {
            ...item,
            images,
        };
    }

    return {
        ...item,
        images,
    };
}

export async function getAdminCatalog(): Promise<AdminCatalogSnapshot> {
    const requestHeaders = await headers();

    const cookie = requestHeaders.get('cookie');

    const response = await serverApiClient.get<AdminCatalogApiResponse>('/admin/catalog', {
        headers: cookie
            ? {
                  Cookie: cookie,
              }
            : undefined,
    });

    return {
        items: response.data.items.map(normalizeItem),

        bookingOptions: response.data.bookingOptions,
    };
}
