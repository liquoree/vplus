import type { Metadata } from 'next';

import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from '@/shared/config/site';

import { COMPANY_LOCATION } from '@/shared/config/company-location';

import { ibmPlexSans, russoOne } from '@/shared/styles/fonts';

import './globals.scss';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),

    title: {
        default: `${SITE_TITLE} | ${SITE_NAME}`,
        template: `%s | ${SITE_NAME}`,
    },

    description: SITE_DESCRIPTION,

    applicationName: SITE_NAME,

    openGraph: {
        type: 'website',
        locale: 'ru_RU',
        url: SITE_URL,
        siteName: SITE_NAME,
        title: `${SITE_TITLE} | ${SITE_NAME}`,
        description: SITE_DESCRIPTION,
    },

    twitter: {
        card: 'summary_large_image',
        title: `${SITE_TITLE} | ${SITE_NAME}`,
        description: SITE_DESCRIPTION,
    },

    icons: {
        icon: './favicon.ico',
    },
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        url: SITE_URL,
        telephone: '+79114047303',
        address: {
            '@type': 'PostalAddress',
            addressCountry: 'RU',
            addressRegion: 'Республика Карелия',
            addressLocality: 'Прионежский район',
            streetAddress: COMPANY_LOCATION.address,
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: COMPANY_LOCATION.coordinates[1],
            longitude: COMPANY_LOCATION.coordinates[0],
        },
    };

    return (
        <html
            lang="ru"
            className={`${ibmPlexSans.variable} ${russoOne.variable}`}
            data-scroll-behavior="smooth"
        >
        <body>
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(structuredData),
            }}
        />

        {children}
        </body>
        </html>
    );
}