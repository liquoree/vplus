import 'server-only';

import {
  serverApiClient,
} from '@/shared/api/server-client';

import type {
  CatalogBookingOption,
} from '../model/booking-option-types';

export async function getCatalogBookingOptions():
  Promise<CatalogBookingOption[]> {
  const response =
    await serverApiClient.get<
      CatalogBookingOption[]
    >('/catalog/booking-options');

  return response.data;
}