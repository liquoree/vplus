import {
  getCatalogBookingOptions,
  getCatalogItems,
} from '@/entities/catalog';

import { AdminCatalogPage } from '@/views/';

type AdminCatalogItemPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminCatalogItemPage({
  params,
}: AdminCatalogItemPageProps) {
  const { id } = await params;

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
      selectedItemId={id}
    />
  );
}