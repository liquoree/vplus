import {
  getCatalogBookingOptions,
  getCatalogItems,
} from '@/entities/catalog';

import { AdminCatalogFormPage } from '@/views/';

export default async function Page() {
  const [
    items,
    bookingOptions,
  ] = await Promise.all([
    getCatalogItems(),
    getCatalogBookingOptions(),
  ]);

  return (
    <AdminCatalogFormPage
      mode="create"
      initialItems={items}
      initialBookingOptions={
        bookingOptions
      }
    />
  );
}