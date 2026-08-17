import { getAdminCatalog } from '@/entities/catalog/server';

import { AdminCatalogFormPage } from '@/views/';

export default async function Page() {
    const { items, bookingOptions } = await getAdminCatalog();

    return (
        <AdminCatalogFormPage
            mode="create"
            initialItems={items}
            initialBookingOptions={bookingOptions}
        />
    );
}
