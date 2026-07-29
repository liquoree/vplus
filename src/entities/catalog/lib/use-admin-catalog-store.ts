'use client';

import {
  useCallback,
  useMemo,
  useSyncExternalStore,
} from 'react';

import type { CatalogBookingOption } from '../model/booking-option-types';
import type { CatalogItem } from '../model/types';

import {
  createAdminCatalogSnapshot,
  getAdminCatalogStoreSnapshot,
  initializeAdminCatalogStore,
  subscribeAdminCatalogStore,
} from '../mock/admin-catalog-store';

export function useAdminCatalogStore(
  initialItems: CatalogItem[],
  initialBookingOptions: CatalogBookingOption[]
) {
  if (typeof window !== 'undefined') {
    initializeAdminCatalogStore(
      initialItems,
      initialBookingOptions
    );
  }

  const serverSnapshot = useMemo(
    () =>
      createAdminCatalogSnapshot(
        initialItems,
        initialBookingOptions
      ),
    [initialItems, initialBookingOptions]
  );

  const getServerSnapshot = useCallback(
    () => serverSnapshot,
    [serverSnapshot]
  );

  return useSyncExternalStore(
    subscribeAdminCatalogStore,
    getAdminCatalogStoreSnapshot,
    getServerSnapshot
  );
}