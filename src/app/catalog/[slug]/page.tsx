import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getCatalogBookingOptions, getCatalogItems } from '@/entities/catalog/server';
import { SITE_NAME, SITE_URL } from '@/shared/config/site';
import { CatalogPage } from '@/views';

type PageProps = {
    params: Promise<{
        slug: string;
    }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;

    const items = await getCatalogItems();

    const selectedItem = items.find((item) => item.slug === slug);

    if (!selectedItem) {
        return {};
    }

    const title = `${selectedItem.title} — аренда в Карелии`;

    const description =
        selectedItem.description ||
        `${selectedItem.title} в аренду в Карелии. Прокат техники для активного отдыха от ${SITE_NAME}.`;

    const canonicalUrl = `${SITE_URL}/catalog/${selectedItem.slug}`;

    const mainImage = selectedItem.images.find((image) => image.isMain) ?? selectedItem.images[0];

    return {
        title,
        description,

        alternates: {
            canonical: canonicalUrl,
        },

        openGraph: {
            type: 'website',
            locale: 'ru_RU',
            url: canonicalUrl,
            siteName: SITE_NAME,
            title: `${title} | ${SITE_NAME}`,
            description,
            images: mainImage
                ? [
                    {
                        url: mainImage.url,
                        alt: mainImage.alt || selectedItem.title,
                    },
                ]
                : undefined,
        },

        twitter: {
            card: 'summary_large_image',
            title: `${title} | ${SITE_NAME}`,
            description,
            images: mainImage ? [mainImage.url] : undefined,
        },
    };
}

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