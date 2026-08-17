import 'server-only';

import { headers } from 'next/headers';

import { serverApiClient } from '@/shared/api/server-client';

import type { AdminBookingRequestRecord } from '../model/types';

type AdminBookingRequestListResponse = {
    items: AdminBookingRequestRecord[];
    total: number;
    limit: number;
    offset: number;
};

export async function getAdminBookingRequests(): Promise<AdminBookingRequestRecord[]> {
    const requestHeaders = await headers();

    const cookie = requestHeaders.get('cookie');

    const response = await serverApiClient.get<AdminBookingRequestListResponse>('/admin/bookings', {
        params: {
            limit: 100,
            offset: 0,
        },

        headers: cookie
            ? {
                  Cookie: cookie,
              }
            : undefined,
    });

    return response.data.items;
}
