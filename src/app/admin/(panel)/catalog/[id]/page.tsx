import {
  getAdminCatalog,
} from '@/entities/catalog/server';

import {
  AdminCatalogPage,
} from '@/views/';

type AdminCatalogItemPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminCatalogItemPage({
  params,
}: AdminCatalogItemPageProps) {
  const { id } = await params;

  const {
    items,
    bookingOptions,
  } = await getAdminCatalog();

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