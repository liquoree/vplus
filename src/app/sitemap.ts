import type { MetadataRoute } from 'next';

import { getCatalogItems } from '@/entities/catalog/server';

import { SITE_URL } from '@/shared/config/site';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: SITE_URL,
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${SITE_URL}/catalog`,
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${SITE_URL}/booking`,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${SITE_URL}/directions`,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${SITE_URL}/about`,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${SITE_URL}/booking-terms`,
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${SITE_URL}/requisites`,
            changeFrequency: 'yearly',
            priority: 0.4,
        },
    ];

    try {
        const catalogItems = await getCatalogItems();

        const catalogPages: MetadataRoute.Sitemap = catalogItems.map((item) => ({
            url: `${SITE_URL}/catalog/${item.slug}`,
            changeFrequency: 'weekly',
            priority: 0.8,
        }));

        return [...staticPages, ...catalogPages];
    } catch {
        return staticPages;
    }
}
