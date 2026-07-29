import {
  getCatalogBookingOptions,
  getCatalogItems,
} from '@/entities/catalog';

import { AdminCatalogFormPage } from '@/views/';

type AdminCatalogEditPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminCatalogEditPage({
  params,
}: AdminCatalogEditPageProps) {
  const { id } = await params;

  const [
    items,
    bookingOptions,
  ] = await Promise.all([
    getCatalogItems(),
    getCatalogBookingOptions(),
  ]);

  return (
    <AdminCatalogFormPage
      mode="edit"
      itemId={id}
      initialItems={items}
      initialBookingOptions={
        bookingOptions
      }
    />
  );
}