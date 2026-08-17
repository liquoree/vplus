import { notFound } from 'next/navigation';

import { getCatalogBookingOptions, getCatalogItems } from '@/entities/catalog/server';
import { CatalogPage } from '@/views';

type PageProps = {
    params: Promise<{
        slug: string;
    }>;
};

export default async function Page({ params }: PageProps) {
    const { slug } = await params;

    const [items, bookingOptions] = await Promise.all([
        getCatalogItems(),
        getCatalogBookingOptions(),
    ]);

    const selectedItem = items.find((item) => item.slug === slug);

    if (!selectedItem) {
        notFound();
    }

    return (
        <CatalogPage items={items} bookingOptions={bookingOptions} selectedItem={selectedItem} />
    );
}
