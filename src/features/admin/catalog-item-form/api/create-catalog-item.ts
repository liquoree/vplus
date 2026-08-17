import axios from 'axios';

import { apiClient } from '@/shared/api/client';

import type { CatalogItemFormSubmitPayload } from '../model/types';

export type CatalogAdminMutationResponse = {
    id: string;
    slug: string;
    version: number;
};

type ApiErrorResponse = {
    error?: {
        code?: string;
        message?: string;
        fields?: Record<string, string> | null;
        requestId?: string;
    };
};

export class CatalogMutationError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);

        this.name = 'CatalogMutationError';

        this.status = status;
    }
}

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

function buildCreateRequest(payload: CatalogItemFormSubmitPayload) {
    const { item, bookingOptions, imageFiles } = payload;

    if (item.images.length !== imageFiles.length) {
        throw new CatalogMutationError('Не удалось подготовить изображения к загрузке.', 0);
    }

    const images = item.images.map((image, index) => ({
        fileIndex: index,

        alt: image.alt ?? null,

        sortOrder: image.sortOrder,

        isMain: image.isMain,
    }));

    const commonItem = {
        slug: item.slug || null,

        kind: item.kind,

        title: item.title,
        description: item.description,

        price: item.price,
        oldPrice: item.oldPrice,

        priceUnit: item.priceUnit,

        characteristics: item.characteristics,

        isAvailable: item.isAvailable,

        images,
    };

    const requestItem =
        item.kind === 'vehicle'
            ? {
                  ...commonItem,

                  season: item.season,

                  includedVehicleIds: [],
                  includedServiceIds: [],
              }
            : item.kind === 'package'
              ? {
                    ...commonItem,

                    season: null,

                    includedVehicleIds: item.includedVehicleIds,

                    includedServiceIds: item.includedServiceIds,
                }
              : {
                    ...commonItem,

                    season: null,

                    includedVehicleIds: [],
                    includedServiceIds: [],
                };

    const requestBookingOptions =
        item.kind === 'service'
            ? []
            : bookingOptions.map((option) => ({
                  serviceId: item.kind === 'package' ? null : option.serviceId,

                  peopleCount: option.peopleCount,

                  durationMinutes: option.durationMinutes,

                  price: option.price,

                  isActive: option.isActive,

                  sortOrder: option.sortOrder,
              }));

    return {
        request: {
            item: requestItem,

            bookingOptions: requestBookingOptions,
        },

        files: imageFiles,
    };
}

export async function createCatalogItem(
    payload: CatalogItemFormSubmitPayload,
): Promise<CatalogAdminMutationResponse> {
    const { request, files } = buildCreateRequest(payload);

    const formData = new FormData();

    formData.append('payload', JSON.stringify(request));

    files.forEach((file) => {
        formData.append('files', file);
    });

    try {
        const response = await apiClient.post<CatalogAdminMutationResponse>(
            '/admin/catalog',
            formData,
        );

        return response.data;
    } catch (error) {
        if (error instanceof CatalogMutationError) {
            throw error;
        }

        if (!axios.isAxiosError<ApiErrorResponse>(error)) {
            throw new CatalogMutationError('Не удалось сохранить позицию.', 0);
        }

        const backendError = error.response?.data?.error;

        throw new CatalogMutationError(
            getFirstFieldError(backendError?.fields) ??
                backendError?.message ??
                'Не удалось сохранить позицию.',
            error.response?.status ?? 0,
        );
    }
}
