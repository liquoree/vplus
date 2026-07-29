import type { CatalogBookingOption } from '../model/booking-option-types';
import type { CatalogItem } from '../model/types';

export type AdminCatalogStoreState = {
  items: CatalogItem[];
  bookingOptions: CatalogBookingOption[];
};

const EMPTY_STATE: AdminCatalogStoreState = {
  items: [],
  bookingOptions: [],
};

let storeState: AdminCatalogStoreState | null =
  null;

const subscribers = new Set<() => void>();

function cloneValue<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function createAdminCatalogSnapshot(
  items: CatalogItem[],
  bookingOptions: CatalogBookingOption[]
): AdminCatalogStoreState {
  return {
    items: cloneValue(items),
    bookingOptions: cloneValue(bookingOptions),
  };
}

export function initializeAdminCatalogStore(
  items: CatalogItem[],
  bookingOptions: CatalogBookingOption[]
) {
  if (storeState) {
    return;
  }

  storeState = createAdminCatalogSnapshot(
    items,
    bookingOptions
  );
}

export function getAdminCatalogStoreSnapshot() {
  return storeState ?? EMPTY_STATE;
}

export function subscribeAdminCatalogStore(
  subscriber: () => void
) {
  subscribers.add(subscriber);

  return () => {
    subscribers.delete(subscriber);
  };
}

function emitChange() {
  subscribers.forEach((subscriber) => {
    subscriber();
  });
}

export function upsertAdminCatalogItem(
  item: CatalogItem,
  bookingOptions: CatalogBookingOption[]
) {
  if (!storeState) {
    throw new Error(
      'Хранилище каталога не инициализировано'
    );
  }

  const existingItemIndex =
    storeState.items.findIndex(
      (currentItem) =>
        currentItem.id === item.id
    );

  const nextItems = [...storeState.items];

  if (existingItemIndex === -1) {
    nextItems.push(item);
  } else {
    nextItems[existingItemIndex] = item;
  }

  const nextBookingOptions =
    storeState.bookingOptions.filter(
      (option) =>
        option.bookableItemId !== item.id
    );

  if (item.kind !== 'service') {
    nextBookingOptions.push(
      ...bookingOptions
    );
  }

  storeState = {
    items: nextItems,
    bookingOptions: nextBookingOptions,
  };

  emitChange();
}

export function deleteAdminCatalogItem(
  itemId: string
) {
  if (!storeState) {
    throw new Error(
      'Хранилище каталога не инициализировано'
    );
  }

  const itemToDelete = storeState.items.find(
    (item) => item.id === itemId
  );

  if (!itemToDelete) {
    return false;
  }

  const nextItems = storeState.items
    .filter((item) => item.id !== itemId)
    .map((item) => {
      if (item.kind !== 'package') {
        return item;
      }

      return {
        ...item,
        includedVehicleIds:
          item.includedVehicleIds.filter(
            (includedId) =>
              includedId !== itemId
          ),
        includedServiceIds:
          item.includedServiceIds.filter(
            (includedId) =>
              includedId !== itemId
          ),
      };
    });

  const nextBookingOptions =
    storeState.bookingOptions.filter(
      (option) =>
        option.bookableItemId !== itemId &&
        option.serviceId !== itemId
    );

  storeState = {
    items: nextItems,
    bookingOptions: nextBookingOptions,
  };

  emitChange();

  return true;
}