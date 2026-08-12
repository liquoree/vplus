import {
  getCatalogBookingOptions,
  getCatalogItems,
} from '@/entities/catalog/server';

import { CatalogPage } from '@/views';

export const dynamic =
'force-dynamic';

export default async function Page() {
  const [items, bookingOptions] = await Promise.all([
    getCatalogItems(),
    getCatalogBookingOptions(),
  ]);

  return (
    <CatalogPage
      items={items}
      bookingOptions={bookingOptions}
    />
  );
}