import { notFound } from 'next/navigation';
import { getCatalogItems } from '@/entities/catalog';
import { CatalogPage } from '@/views';

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  const items = await getCatalogItems();
  const selectedItem = items.find((item) => item.slug === slug);

  if (!selectedItem) {
    notFound();
  }

  return <CatalogPage items={items} selectedItem={selectedItem} />;
}