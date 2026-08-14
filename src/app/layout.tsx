import type {
  Metadata,
} from 'next';

import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
} from '@/shared/config/site';

import {
  ibmPlexSans,
  russoOne,
} from '@/shared/styles/fonts';

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

    description:
      SITE_DESCRIPTION,
  },

  twitter: {
    card: 'summary_large_image',

    title: `${SITE_TITLE} | ${SITE_NAME}`,

    description:
      SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${ibmPlexSans.variable} ${russoOne.variable}`}
      data-scroll-behavior="smooth"
    >
      <body>
        {children}
      </body>
    </html>
  );
}