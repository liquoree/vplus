import type {
  CatalogItem,
  Season,
  VehicleItem,
} from '../model/types';

const POPULAR_ITEMS_LIMIT = 4;

/**
 * Ноябрь–март считаем зимним периодом,
 * апрель–октябрь — летним.
 */
function getCurrentCatalogSeason(
  date: Date
): Extract<Season, 'summer' | 'winter'> {
  const month = date.getMonth();

  const isWinter =
    month >= 10 || month <= 2;

  return isWinter ? 'winter' : 'summer';
}

function isVehicleItem(
  item: CatalogItem
): item is VehicleItem {
  return item.kind === 'vehicle';
}

export function getSeasonalPopularItems(
  items: CatalogItem[],
  date = new Date(),
  limit = POPULAR_ITEMS_LIMIT
): VehicleItem[] {
  const currentSeason =
    getCurrentCatalogSeason(date);

  return items
    .filter(isVehicleItem)
    .filter((item) => item.isAvailable)
    .filter(
      (item) =>
        item.season === currentSeason ||
        item.season === 'all_season'
    )
    .slice(0, limit);
}