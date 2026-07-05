import type { Metadata } from 'next';
import { ibmPlexSans, russoOne } from '@/shared/styles/fonts';
import './globals.scss';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export const metadata: Metadata = {
  title: 'ВЕЗДЕХОД+ Карелия',
  description: 'Аренда техники для активного отдыха в Карелии',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${ibmPlexSans.variable} ${russoOne.variable}`} data-scroll-behavior="smooth">
      <body>
        {children}
      </body>
    </html>
  );
}