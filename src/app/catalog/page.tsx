import { getCatalogItems } from '@/entities/catalog';
import { CatalogPage } from '@/views';

export default async function Page() {
  const items = await getCatalogItems();

  return <CatalogPage items={items} />;
}