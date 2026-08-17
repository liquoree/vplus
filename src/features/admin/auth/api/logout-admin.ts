import { apiClient } from '@/shared/api/client';

import type { AdminLogoutResponse } from '../model/types';

export async function logoutAdmin(): Promise<AdminLogoutResponse> {
    const response = await apiClient.post<AdminLogoutResponse>('/admin/auth/logout');

    return response.data;
}
