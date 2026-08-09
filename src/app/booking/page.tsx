import {
  getCatalogBookingOptions,
  getCatalogItems,
} from '@/entities/catalog/server';

import {
  ErrorPage,
} from '@/views/error/ErrorPage';

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

  try {
    const [
      items,
      bookingOptions,
    ] = await Promise.all([
      getCatalogItems(),
      getCatalogBookingOptions(),
    ]);

    return (
      <BookingPage
        items={items}
        bookingOptions={bookingOptions}
        initialVehicleSlug={
          params.vehicle
        }
        initialServiceSlug={
          params.service
        }
        initialPackageSlug={
          params.package
        }
      />
    );
  } catch {
    return (
      <ErrorPage
        code="503"
        title="Бронирование временно недоступно"
        description={
          'Не удалось связаться с сервером бронирования. Попробуйте обновить страницу немного позже.'
        }
      />
    );
  }
}