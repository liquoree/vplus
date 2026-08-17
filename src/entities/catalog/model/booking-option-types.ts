export type CatalogBookingOption = {
    id: string;
    bookableItemId: string;
    serviceId: string | null;
    peopleCount: number;

    durationMinutes: number;

    price: number;
    isActive: boolean;
    sortOrder: number;
};
