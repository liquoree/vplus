import {
  getCatalogBookingOptions,
  getCatalogItems,
} from '@/entities/catalog';
import { CatalogPage } from '@/views';

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