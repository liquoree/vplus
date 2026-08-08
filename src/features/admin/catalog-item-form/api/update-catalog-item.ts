import axios from 'axios';

import {
  apiClient,
} from '@/shared/api/client';

import {
  CatalogMutationError,
} from './create-catalog-item';

import type {
  CatalogItemFormSubmitPayload,
} from '../model/types';

type CatalogAdminMutationResponse = {
  id: string;
  slug: string;
  version: number;
};

type ApiErrorResponse = {
  error?: {
    code?: string;
    message?: string;
    fields?: Record<
      string,
      string
    > | null;
    requestId?: string;
  };
};

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

function getFirstFieldError(
  fields:
    | Record<string, string>
    | null
    | undefined
) {
  if (!fields) {
    return null;
  }

  return (
    Object.values(fields).find(
      (message) =>
        typeof message === 'string' &&
        message.trim().length > 0
    ) ?? null
  );
}

function buildUpdateRequest(
  payload: CatalogItemFormSubmitPayload,
  version: number
) {
  const {
    item,
    bookingOptions,
    imageFiles,
  } = payload;

  let nextFileIndex = 0;

  const images = item.images.map(
    (image) => {
      const commonFields = {
        alt: image.alt ?? null,
        sortOrder: image.sortOrder,
        isMain: image.isMain,
      };

      if (isUuid(image.id)) {
        return {
          id: image.id,
          ...commonFields,
        };
      }

      const fileIndex =
        nextFileIndex;

      nextFileIndex += 1;

      return {
        fileIndex,
        ...commonFields,
      };
    }
  );

  if (
    nextFileIndex !==
    imageFiles.length
  ) {
    throw new CatalogMutationError(
      'Не удалось подготовить изображения к загрузке.',
      0
    );
  }

  const commonItem = {
    slug: item.slug || null,

    kind: item.kind,

    title: item.title,
    description: item.description,

    price: item.price,
    oldPrice: item.oldPrice,

    priceUnit: item.priceUnit,

    characteristics:
      item.characteristics,

    isAvailable:
      item.isAvailable,

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

            includedVehicleIds:
              item.includedVehicleIds,

            includedServiceIds:
              item.includedServiceIds,
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
      : bookingOptions.map(
          (option) => ({
            ...(isUuid(option.id)
              ? {
                  id: option.id,
                }
              : {}),

            serviceId:
              item.kind === 'package'
                ? null
                : option.serviceId,

            peopleCount:
              option.peopleCount,

            durationMinutes:
              option.durationMinutes,

            price: option.price,

            isActive:
              option.isActive,

            sortOrder:
              option.sortOrder,
          })
        );

  return {
    request: {
      item: requestItem,

      bookingOptions:
        requestBookingOptions,

      version,
    },

    files: imageFiles,
  };
}

export async function updateCatalogItem(
  itemId: string,
  payload: CatalogItemFormSubmitPayload,
  version: number
): Promise<CatalogAdminMutationResponse> {
  const {
    request,
    files,
  } = buildUpdateRequest(
    payload,
    version
  );

  const formData =
    new FormData();

  formData.append(
    'payload',
    JSON.stringify(request)
  );

  files.forEach((file) => {
    formData.append(
      'files',
      file
    );
  });

  try {
    const response =
      await apiClient.put<
        CatalogAdminMutationResponse
      >(
        `/admin/catalog/${itemId}`,
        formData
      );

    return response.data;
  } catch (error) {
    if (
      error instanceof
      CatalogMutationError
    ) {
      throw error;
    }

    if (
      !axios.isAxiosError<ApiErrorResponse>(
        error
      )
    ) {
      throw new CatalogMutationError(
        'Не удалось сохранить изменения.',
        0
      );
    }

    const backendError =
      error.response?.data?.error;

    throw new CatalogMutationError(
      getFirstFieldError(
        backendError?.fields
      ) ??
        backendError?.message ??
        'Не удалось сохранить изменения.',
      error.response?.status ?? 0
    );
  }
}