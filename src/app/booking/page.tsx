import {
  getCatalogBookingOptions,
  getCatalogItems,
} from '@/entities/catalog';
import { BookingPage } from '@/views';

type BookingRouteProps = {
  searchParams: Promise<{
    vehicle?: string;
    service?: string;
    package?: string;
  }>;
};

export default async function Page({
  searchParams,
}: BookingRouteProps) {
  const params = await searchParams;

  const [items, bookingOptions] = await Promise.all([
    getCatalogItems(),
    getCatalogBookingOptions(),
  ]);

  return (
    <BookingPage
      items={items}
      bookingOptions={bookingOptions}
      initialVehicleSlug={params.vehicle}
      initialServiceSlug={params.service}
      initialPackageSlug={params.package}
    />
  );
}