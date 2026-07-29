import {
  getCatalogBookingOptions,
  getCatalogItems,
} from '@/entities/catalog';

import { AdminCatalogPage } from '@/views/';

export default async function Page() {
  const [
    items,
    bookingOptions,
  ] = await Promise.all([
    getCatalogItems(),
    getCatalogBookingOptions(),
  ]);

  return (
    <AdminCatalogPage
      initialItems={items}
      initialBookingOptions={
        bookingOptions
      }
    />
  );
}