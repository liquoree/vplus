import 'server-only';

import axios from 'axios';

import {
  headers,
} from 'next/headers';

import {
  serverApiClient,
} from '@/shared/api/server-client';

import type {
  AdminPublic,
} from '../model/types';

export async function getCurrentAdmin():
  Promise<AdminPublic | null> {
  const requestHeaders =
    await headers();

  const cookie =
    requestHeaders.get('cookie');

  try {
    const response =
      await serverApiClient.get<AdminPublic>(
        '/admin/auth/me',
        {
          headers: cookie
            ? {
                Cookie: cookie,
              }
            : undefined,
        }
      );

    return response.data;
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401
    ) {
      return null;
    }

    throw error;
  }
}