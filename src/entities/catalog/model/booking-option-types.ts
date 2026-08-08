export type CatalogBookingOption = {
  id: string;

  /**
   * ID техники или пакета.
   */
  bookableItemId: string;

  /**
   * ID услуги.
   *
   * null допустим для пакета, который бронируется
   * как самостоятельная готовая программа.
   */
  serviceId: string | null;

  peopleCount: number;

  /**
   * Продолжительность всегда храним в минутах.
   *
   * 1 час = 60
   * 1,5 часа = 90
   * 3 часа = 180
   */
  durationMinutes: number;

  /**
   * Точная стоимость этой комбинации.
   */
  price: number;

  isActive: boolean;
  sortOrder: number;
};
