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

export const dynamic =
  'force-dynamic';

export default async function Page({
  searchParams,
}: BookingRouteProps) {
  const params = await searchParams;

  const [
    itemsResult,
    bookingOptionsResult,
  ] = await Promise.allSettled([
    getCatalogItems(),
    getCatalogBookingOptions(),
  ]);

  if (
    itemsResult.status ===
      'rejected' ||
    bookingOptionsResult.status ===
      'rejected'
  ) {
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

  const items =
    itemsResult.value;

  const bookingOptions =
    bookingOptionsResult.value;

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
}