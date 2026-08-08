import {
  getAdminCatalog,
} from '@/entities/catalog/server';

import {
  AdminCatalogFormPage,
} from '@/views/';

type AdminCatalogEditPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminCatalogEditPage({
  params,
}: AdminCatalogEditPageProps) {
  const { id } = await params;

  const {
    items,
    bookingOptions,
  } = await getAdminCatalog();

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