import axios from 'axios';

import { apiClient } from '@/shared/api/client';

import { CatalogMutationError } from './create-catalog-item';

type CatalogAdminDeleteResponse = {
    success: boolean;
};

type ApiErrorResponse = {
    error?: {
        code?: string;
        message?: string;
        fields?: Record<string, string> | null;
        requestId?: string;
    };
};

function getFirstFieldError(fields: Record<string, string> | null | undefined) {
    if (!fields) {
        return null;
    }

    return (
        Object.values(fields).find(
            (message) => typeof message === 'string' && message.trim().length > 0,
        ) ?? null
    );
}

export async function deleteCatalogItem(
    itemId: string,
    version: number,
): Promise<CatalogAdminDeleteResponse> {
    try {
        const response = await apiClient.delete<CatalogAdminDeleteResponse>(
            `/admin/catalog/${itemId}`,
            {
                params: {
                    version,
                },
            },
        );

        return response.data;
    } catch (error) {
        if (!axios.isAxiosError<ApiErrorResponse>(error)) {
            throw new CatalogMutationError('Не удалось удалить позицию.', 0);
        }

        const backendError = error.response?.data?.error;

        throw new CatalogMutationError(
            getFirstFieldError(backendError?.fields) ??
                backendError?.message ??
                'Не удалось удалить позицию.',
            error.response?.status ?? 0,
        );
    }
}
