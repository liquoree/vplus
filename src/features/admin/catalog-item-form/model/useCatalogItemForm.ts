'use client';

import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useRef,
  useState,
} from 'react';

import type {
  CatalogBookingOption,
  CatalogCharacteristic,
  CatalogItem,
  CatalogItemKind,
} from '@/entities/catalog';

import type {
  CatalogBookingOptionFormValue,
  CatalogItemFormErrors,
  CatalogItemFormImage,
  CatalogItemFormMode,
  CatalogItemFormSubmitPayload,
  CatalogItemFormValues,
} from './types';

type UseCatalogItemFormParams = {
  mode: CatalogItemFormMode;

  item?: CatalogItem;

  initialBookingOptions:
    CatalogBookingOption[];

  catalogItems: CatalogItem[];

  onSubmit: (
    payload: CatalogItemFormSubmitPayload
  ) => Promise<void>;
};

const EMPTY_ERRORS: CatalogItemFormErrors = {
  optionRows: {},
};

const transliterationMap: Record<
  string,
  string
> = {
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'g',
  д: 'd',
  е: 'e',
  ё: 'e',
  ж: 'zh',
  з: 'z',
  и: 'i',
  й: 'y',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'h',
  ц: 'c',
  ч: 'ch',
  ш: 'sh',
  щ: 'sch',
  ъ: '',
  ы: 'y',
  ь: '',
  э: 'e',
  ю: 'yu',
  я: 'ya',
};

function createId(prefix: string) {
  if (
    typeof crypto !== 'undefined' &&
    'randomUUID' in crypto
  ) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random()
    .toString(16)
    .slice(2)}`;
}

function createSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .split('')
    .map(
      (character) =>
        transliterationMap[character] ??
        character
    )
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getUniqueSlug(
  title: string,
  catalogItems: CatalogItem[],
  currentItemId?: string
) {
  const baseSlug =
    createSlug(title) || 'catalog-item';

  const existingSlugs = new Set(
    catalogItems
      .filter(
        (item) => item.id !== currentItemId
      )
      .map((item) => item.slug)
  );

  if (!existingSlugs.has(baseSlug)) {
    return baseSlug;
  }

  let index = 2;

  while (
    existingSlugs.has(
      `${baseSlug}-${index}`
    )
  ) {
    index += 1;
  }

  return `${baseSlug}-${index}`;
}

function characteristicsToText(
  item?: CatalogItem
) {
  if (!item) {
    return '';
  }

  return item.characteristics
    .map(
      (characteristic) =>
        `${characteristic.name}: ${characteristic.value}`
    )
    .join(';\n');
}

function parseCharacteristics(
  value: string
): CatalogCharacteristic[] {
  return value
    .split(/[;\n]+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const separatorIndex =
        line.indexOf(':');

      if (separatorIndex === -1) {
        return {
          name: 'Характеристика',
          value: line,
        };
      }

      return {
        name: line
          .slice(0, separatorIndex)
          .trim(),

        value: line
          .slice(separatorIndex + 1)
          .trim(),
      };
    })
    .filter(
      (characteristic) =>
        characteristic.name &&
        characteristic.value
    );
}

function createInitialValues(
  item: CatalogItem | undefined,
  bookingOptions: CatalogBookingOption[]
): CatalogItemFormValues {
  const kind = item?.kind ?? 'vehicle';

  return {
    id: item?.id ?? '',
    slug: item?.slug ?? '',

    kind,

    title: item?.title ?? '',
    description: item?.description ?? '',

    price:
      typeof item?.price === 'number'
        ? String(item.price)
        : '',

    priceUnit:
      item?.priceUnit ?? 'hour',

    characteristicsText:
      characteristicsToText(item),

    season:
      item?.kind === 'vehicle'
        ? item.season
        : 'all_season',

    includedVehicleIds:
      item?.kind === 'package'
        ? [...item.includedVehicleIds]
        : [],

    includedServiceIds:
      item?.kind === 'package'
        ? [...item.includedServiceIds]
        : [],

    isAvailable:
      item?.isAvailable ?? true,

    images:
      item?.images
        .slice()
        .sort(
          (first, second) =>
            first.sortOrder -
            second.sortOrder
        )
        .map((image) => ({
          id: image.id,
          url: image.url,
          alt: image.alt ?? item.title,
        })) ?? [],

    bookingOptions:
      bookingOptions
        .slice()
        .sort(
          (first, second) =>
            first.sortOrder -
            second.sortOrder
        )
        .map((option) => ({
          id: option.id,
          serviceId:
            option.serviceId ?? '',

          peopleCount: String(
            option.peopleCount
          ),

          durationHours: String(
            option.durationMinutes / 60
          ),

          price: String(option.price),

          isActive: option.isActive,
        })),
  };
}

function validateValues(
  values: CatalogItemFormValues
): CatalogItemFormErrors {
  const errors: CatalogItemFormErrors = {
    optionRows: {},
  };

  if (!values.title.trim()) {
    errors.title =
      'Введите название позиции';
  }

  const price = Number(values.price);

  if (
    !Number.isFinite(price) ||
    price <= 0
  ) {
    errors.price =
      'Укажите цену больше нуля';
  }

  if (values.images.length === 0) {
    errors.images =
      'Добавьте хотя бы одно изображение';
  }

  if (values.images.length > 3) {
    errors.images =
      'Можно добавить не более трёх изображений';
  }

  if (
    values.kind === 'package' &&
    values.includedVehicleIds.length === 0 &&
    values.includedServiceIds.length === 0
  ) {
    errors.packageItems =
      'Добавьте в пакет технику или услугу';
  }

  if (
    values.kind !== 'service' &&
    values.bookingOptions.length === 0
  ) {
    errors.bookingOptions =
      'Добавьте хотя бы одну опцию бронирования';
  }

  const optionKeys = new Set<string>();

  values.bookingOptions.forEach(
    (option) => {
      if (values.kind === 'service') {
        return;
      }

      const peopleCount = Number(
        option.peopleCount
      );

      const durationHours = Number(
        option.durationHours
      );

      const optionPrice = Number(
        option.price
      );

      if (
        values.kind === 'vehicle' &&
        !option.serviceId
      ) {
        errors.optionRows[option.id] =
          'Выберите услугу';

        return;
      }

      if (
        !Number.isInteger(peopleCount) ||
        peopleCount < 1 ||
        peopleCount > 4
      ) {
        errors.optionRows[option.id] =
          'Выберите количество человек';

        return;
      }

      if (
        !Number.isInteger(durationHours) ||
        durationHours < 1 ||
        durationHours > 6
      ) {
        errors.optionRows[option.id] =
          'Выберите продолжительность';

        return;
      }

      if (
        !Number.isFinite(optionPrice) ||
        optionPrice <= 0
      ) {
        errors.optionRows[option.id] =
          'Укажите цену опции';

        return;
      }

      const uniqueKey = [
        values.kind === 'package'
          ? 'package'
          : option.serviceId,
        peopleCount,
        durationHours,
      ].join('-');

      if (optionKeys.has(uniqueKey)) {
        errors.optionRows[option.id] =
          'Такая комбинация уже добавлена';

        return;
      }

      optionKeys.add(uniqueKey);
    }
  );

  return errors;
}

function hasErrors(
  errors: CatalogItemFormErrors
) {
  return Boolean(
    errors.title ||
      errors.price ||
      errors.images ||
      errors.packageItems ||
      errors.bookingOptions ||
      Object.keys(errors.optionRows)
        .length > 0
  );
}

export function useCatalogItemForm({
  mode,
  item,
  initialBookingOptions,
  catalogItems,
  onSubmit,
}: UseCatalogItemFormParams) {
  const [values, setValues] =
    useState<CatalogItemFormValues>(() =>
      createInitialValues(
        item,
        initialBookingOptions
      )
    );

  const [errors, setErrors] =
    useState<CatalogItemFormErrors>(
      EMPTY_ERRORS
    );

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const createdObjectUrlsRef = useRef(
    new Set<string>()
  );

  const preserveObjectUrlsRef =
    useRef(false);

    useEffect(() => {
    const objectUrls =
        createdObjectUrlsRef.current;

    const preserveState =
        preserveObjectUrlsRef;

    return () => {
        if (preserveState.current) {
        return;
        }

        objectUrls.forEach((url) => {
        URL.revokeObjectURL(url);
        });

        objectUrls.clear();
    };
    }, []);

  const clearError = (
    field: keyof Omit<
      CatalogItemFormErrors,
      'optionRows'
    >
  ) => {
    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: undefined,
    }));
  };

  const setField = <
    Field extends keyof CatalogItemFormValues,
  >(
    field: Field,
    value: CatalogItemFormValues[Field]
  ) => {
    setValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));
  };

  const setTitle = (title: string) => {
    clearError('title');

    setValues((currentValues) => ({
      ...currentValues,
      title,

      slug:
        mode === 'create'
          ? createSlug(title)
          : currentValues.slug,
    }));
  };

  const setKind = (
    kind: CatalogItemKind
  ) => {
    setValues((currentValues) => ({
      ...currentValues,
      kind,

      priceUnit:
        kind === 'package'
          ? 'fixed'
          : currentValues.priceUnit,

      bookingOptions:
        kind === 'service'
          ? []
          : currentValues.bookingOptions.map(
              (option) => ({
                ...option,
                serviceId:
                  kind === 'package'
                    ? ''
                    : option.serviceId,
              })
            ),
    }));

    setErrors(EMPTY_ERRORS);
  };

  const addBookingOption = () => {
    setValues((currentValues) => ({
      ...currentValues,

      bookingOptions: [
        ...currentValues.bookingOptions,
        {
          id: createId('booking-option'),
          serviceId: '',
          peopleCount: '1',
          durationHours: '1',
          price: '',
          isActive: true,
        },
      ],
    }));

    clearError('bookingOptions');
  };

  const updateBookingOption = (
    optionId: string,
    patch: Partial<CatalogBookingOptionFormValue>
  ) => {
    setValues((currentValues) => ({
      ...currentValues,

      bookingOptions:
        currentValues.bookingOptions.map(
          (option) =>
            option.id === optionId
              ? {
                  ...option,
                  ...patch,
                }
              : option
        ),
    }));

    setErrors((currentErrors) => {
      const nextOptionRows = {
        ...currentErrors.optionRows,
      };

      delete nextOptionRows[optionId];

      return {
        ...currentErrors,
        optionRows: nextOptionRows,
      };
    });
  };

  const removeBookingOption = (
    optionId: string
  ) => {
    setValues((currentValues) => ({
      ...currentValues,

      bookingOptions:
        currentValues.bookingOptions.filter(
          (option) =>
            option.id !== optionId
        ),
    }));

    setErrors((currentErrors) => {
      const nextOptionRows = {
        ...currentErrors.optionRows,
      };

      delete nextOptionRows[optionId];

      return {
        ...currentErrors,
        optionRows: nextOptionRows,
      };
    });
  };

  const addImages = (
    files: FileList | null
  ) => {
    if (!files) {
      return;
    }

    const availableCount =
      3 - values.images.length;

    if (availableCount <= 0) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        images:
          'Можно добавить не более трёх изображений',
      }));

      return;
    }

    const selectedFiles = Array.from(
      files
    ).slice(0, availableCount);

    const newImages: CatalogItemFormImage[] =
      selectedFiles.map((file) => {
        const url =
          URL.createObjectURL(file);

        createdObjectUrlsRef.current.add(
          url
        );

        return {
          id: createId('catalog-image'),
          url,
          alt:
            values.title ||
            'Изображение позиции каталога',
          file,
        };
      });

    setValues((currentValues) => ({
      ...currentValues,

      images: [
        ...currentValues.images,
        ...newImages,
      ],
    }));

    clearError('images');
  };

  const removeImage = (
    imageId: string
  ) => {
    const image = values.images.find(
      (currentImage) =>
        currentImage.id === imageId
    );

    if (
      image?.file &&
      createdObjectUrlsRef.current.has(
        image.url
      )
    ) {
      URL.revokeObjectURL(image.url);

      createdObjectUrlsRef.current.delete(
        image.url
      );
    }

    setValues((currentValues) => ({
      ...currentValues,

      images: currentValues.images.filter(
        (currentImage) =>
          currentImage.id !== imageId
      ),
    }));
  };

  const toggleIncludedItem = (
    field:
      | 'includedVehicleIds'
      | 'includedServiceIds',
    itemId: string
  ) => {
    setValues((currentValues) => {
      const currentIds =
        currentValues[field];

      const nextIds = currentIds.includes(
        itemId
      )
        ? currentIds.filter(
            (id) => id !== itemId
          )
        : [...currentIds, itemId];

      return {
        ...currentValues,
        [field]: nextIds,
      };
    });

    clearError('packageItems');
  };

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    addImages(event.target.files);

    event.target.value = '';
  };

  const buildPayload =
    (): CatalogItemFormSubmitPayload => {
      const slug =
        mode === 'edit' && values.slug
          ? values.slug
          : getUniqueSlug(
              values.title,
              catalogItems,
              item?.id
            );

      const id =
        item?.id ||
        slug ||
        createId('catalog-item');

      const images = values.images.map(
        (image, index) => ({
          id: image.id,
          url: image.url,
          alt:
            image.alt ||
            values.title.trim(),

          sortOrder: index,
          isMain: index === 0,
        })
      );

      const commonFields = {
        id,
        slug,

        title: values.title.trim(),
        description:
          values.description.trim(),

        price: Number(values.price),
        priceUnit: values.priceUnit,

        images,

        characteristics:
          parseCharacteristics(
            values.characteristicsText
          ),

        isAvailable:
          values.isAvailable,
      };

      let catalogItem: CatalogItem;

      if (values.kind === 'vehicle') {
        catalogItem = {
          ...commonFields,
          kind: 'vehicle',
          season: values.season,
        };
      } else if (
        values.kind === 'service'
      ) {
        catalogItem = {
          ...commonFields,
          kind: 'service',
        };
      } else {
        catalogItem = {
          ...commonFields,
          kind: 'package',

          includedVehicleIds: [
            ...values.includedVehicleIds,
          ],

          includedServiceIds: [
            ...values.includedServiceIds,
          ],
        };
      }

      const bookingOptions =
        values.kind === 'service'
          ? []
          : values.bookingOptions.map(
              (option, index) => ({
                id: option.id,

                bookableItemId: id,

                serviceId:
                  values.kind === 'package'
                    ? null
                    : option.serviceId,

                peopleCount: Number(
                  option.peopleCount
                ),

                durationMinutes:
                  Number(
                    option.durationHours
                  ) * 60,

                price: Number(option.price),

                isActive:
                  option.isActive,

                sortOrder: index,
              })
            );

      return {
        item: catalogItem,
        bookingOptions,

        imageFiles: values.images
          .map((image) => image.file)
          .filter(
            (file): file is File =>
              Boolean(file)
          ),
      };
    };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const nextErrors =
      validateValues(values);

    if (hasErrors(nextErrors)) {
      setErrors(nextErrors);
      return;
    }

    setErrors(EMPTY_ERRORS);
    setIsSubmitting(true);

    try {
      const payload = buildPayload();

      await onSubmit(payload);

      preserveObjectUrlsRef.current = true;
    } catch {
      setErrors({
        optionRows: {},

        submit:
          'Не удалось сохранить позицию',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    values,
    errors,
    isSubmitting,

    setField,
    setTitle,
    setKind,

    addBookingOption,
    updateBookingOption,
    removeBookingOption,

    handleFileChange,
    removeImage,

    toggleIncludedItem,

    handleSubmit,
  };
}