import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/shared/config/site';

const PRIVATE_PATHS = ['/admin', '/api/'];

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: PRIVATE_PATHS,
            },

            {
                userAgent: [
                    'GPTBot',
                    'OAI-SearchBot',
                    'ClaudeBot',
                    'Claude-SearchBot',
                    'Claude-User',
                ],
                allow: '/',
                disallow: PRIVATE_PATHS,
            },
        ],

        sitemap: `${SITE_URL}/sitemap.xml`,
    };
}