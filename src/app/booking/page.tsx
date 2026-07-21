import { getCatalogItems } from '@/entities/catalog';
import { BookingPage } from '@/views';

type PageProps = {
  searchParams?: Promise<{
    vehicle?: string;
    service?: string;
    package?: string;
  }>;
};

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const items = await getCatalogItems();

  return (
    <BookingPage
      items={items}
      initialVehicleSlug={params?.vehicle}
      initialServiceSlug={params?.service}
      initialPackageSlug={params?.package}
    />
  );
}