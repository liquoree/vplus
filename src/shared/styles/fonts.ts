import { IBM_Plex_Sans, Russo_One } from 'next/font/google';

export const ibmPlexSans = IBM_Plex_Sans({
    subsets: ['latin', 'cyrillic'],
    weight: ['400', '500', '600', '700'],
    display: 'swap',
    variable: '--font-main',
});

export const russoOne = Russo_One({
    subsets: ['latin', 'cyrillic'],
    weight: '400',
    display: 'swap',
    variable: '--font-accent',
});
