import type { Metadata } from 'next';
import { ibmPlexSans, russoOne } from '@/shared/styles/fonts';
import './globals.scss';

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
    <html lang="ru" className={`${ibmPlexSans.variable} ${russoOne.variable}`}>
      <body>{children}</body>
    </html>
  );
}