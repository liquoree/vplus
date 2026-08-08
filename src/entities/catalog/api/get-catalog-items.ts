import 'server-only';

import {
  serverApiClient,
} from '@/shared/api/server-client';

import type {
  CatalogItem,
} from '../model/types';

type CatalogApiItem =
  Omit<CatalogItem, 'images'> & {
    images: Array<
      Omit<
        CatalogItem['images'][number],
        'alt'
      > & {
        alt: string | null;
      }
    >;
  };

function normalizeCatalogItem(
  item: CatalogApiItem
): CatalogItem {
  return {
    ...item,
    images: item.images.map(
      (image) => ({
        ...image,
        alt:
          image.alt ??
          undefined,
      })
    ),
  } as CatalogItem;
}

export async function getCatalogItems():
  Promise<CatalogItem[]> {
  const response =
    await serverApiClient.get<
      CatalogApiItem[]
    >('/catalog');

  return response.data.map(
    normalizeCatalogItem
  );
}