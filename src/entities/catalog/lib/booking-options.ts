import type { BookableCatalogItem, CatalogItem, ServiceItem } from '../model/types';
import type { CatalogBookingOption } from '../model/booking-option-types';

export function getBookingOptionById(options: CatalogBookingOption[], optionId: string) {
    return options.find((option) => option.id === optionId);
}

export function getBookingOptionsByBookableItem(
    options: CatalogBookingOption[],
    bookableItemId: string,
) {
    return options
        .filter((option) => option.bookableItemId === bookableItemId && option.isActive)
        .sort((first, second) => first.sortOrder - second.sortOrder);
}

export function getBookingOptionsByService(options: CatalogBookingOption[], serviceId: string) {
    return options
        .filter((option) => option.serviceId === serviceId && option.isActive)
        .sort((first, second) => first.sortOrder - second.sortOrder);
}

export function getBookingOptionsForSelection(
    options: CatalogBookingOption[],
    bookableItemId: string,
    serviceId: string | null,
) {
    return options
        .filter(
            (option) =>
                option.bookableItemId === bookableItemId &&
                option.serviceId === serviceId &&
                option.isActive,
        )
        .sort((first, second) => first.sortOrder - second.sortOrder);
}

export function getAvailableServices(
    items: CatalogItem[],
    options: CatalogBookingOption[],
    bookableItemId: string,
): ServiceItem[] {
    const serviceIds = new Set(
        options
            .filter(
                (option) =>
                    option.bookableItemId === bookableItemId &&
                    option.serviceId !== null &&
                    option.isActive,
            )
            .map((option) => option.serviceId),
    );

    return items.filter(
        (item): item is ServiceItem =>
            item.kind === 'service' && item.isAvailable && serviceIds.has(item.id),
    );
}

export function getAvailableBookableItems(
    items: CatalogItem[],
    options: CatalogBookingOption[],
    serviceId: string,
): BookableCatalogItem[] {
    const bookableItemIds = new Set(
        options
            .filter((option) => option.serviceId === serviceId && option.isActive)
            .map((option) => option.bookableItemId),
    );

    return items.filter(
        (item): item is BookableCatalogItem =>
            (item.kind === 'vehicle' || item.kind === 'package') &&
            item.isAvailable &&
            bookableItemIds.has(item.id),
    );
}

export function getBookableCatalogItems(items: CatalogItem[]): BookableCatalogItem[] {
    return items.filter(
        (item): item is BookableCatalogItem =>
            (item.kind === 'vehicle' || item.kind === 'package') && item.isAvailable,
    );
}

export function getServiceCatalogItems(items: CatalogItem[]): ServiceItem[] {
    return items.filter((item): item is ServiceItem => item.kind === 'service' && item.isAvailable);
}
