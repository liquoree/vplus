'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useId, useMemo } from 'react';

import type {
  CatalogBookingOption,
  CatalogItem,
  CatalogItemKind,
  PriceUnit,
} from '@/entities/catalog';

import {
  Button,
  SelectField,
  TextField,
} from '@/shared/ui';

import type {
  CatalogItemFormMode,
  CatalogItemFormSubmitPayload,
} from '../model/types';

import { useCatalogItemForm } from '../model/useCatalogItemForm';

import './CatalogItemForm.scss';

type CatalogItemFormProps = {
  mode: CatalogItemFormMode;

  item?: CatalogItem;

  initialBookingOptions:
    CatalogBookingOption[];

  catalogItems: CatalogItem[];

  onSubmit: (
    payload: CatalogItemFormSubmitPayload
  ) => Promise<void>;

  onDelete?: () => void;
  isDeleting?: boolean;
};

const kindOptions: Array<{
  value: CatalogItemKind;
  label: string;
}> = [
  {
    value: 'vehicle',
    label: 'Техника',
  },
  {
    value: 'service',
    label: 'Услуга',
  },
  {
    value: 'package',
    label: 'Пакет',
  },
];

const priceUnitOptions: Array<{
  value: PriceUnit;
  label: string;
}> = [
  {
    value: 'hour',
    label: '₽/ч',
  },
  {
    value: 'fixed',
    label: '₽',
  },
];

const peopleOptions = [1, 2, 3, 4].map(
  (value) => ({
    value: String(value),
    label: String(value),
  })
);

const seasonOptions = [
  {
    value: 'all_season',
    label: 'Всесезонный',
  },
  {
    value: 'summer',
    label: 'Лето',
  },
  {
    value: 'winter',
    label: 'Зима',
  },
];

export function CatalogItemForm({
  mode,
  item,
  initialBookingOptions,
  catalogItems,
  onSubmit,
  onDelete,
  isDeleting = false,
}: CatalogItemFormProps) {
  const uploadInputId = useId();

  const {
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
  } = useCatalogItemForm({
    mode,
    item,
    initialBookingOptions,
    catalogItems,
    onSubmit,
  });

  const serviceItems = useMemo(
    () =>
      catalogItems.filter(
        (catalogItem) =>
          catalogItem.kind === 'service'
      ),
    [catalogItems]
  );

  const vehicleItems = useMemo(
    () =>
      catalogItems.filter(
        (catalogItem) =>
          catalogItem.kind === 'vehicle'
      ),
    [catalogItems]
  );

  const serviceOptions = serviceItems.map(
    (service) => ({
      value: service.id,
      label: service.title,
    })
  );

  return (
    <form
      className="catalog-item-form"
      onSubmit={handleSubmit}
    >
      <TextField
        label="Название*"
        value={values.title}
        placeholder='Например, «Квадроцикл»'
        error={errors.title}
        onChange={(event) =>
          setTitle(event.target.value)
        }
      />

      <div className="catalog-item-form__price-row">
        <TextField
          className="catalog-item-form__price"
          label="Минимальная цена*"
          type="number"
          min="1"
          step="1"
          value={values.price}
          placeholder='Например, «3500»'
          error={errors.price}
          onChange={(event) =>
            setField(
              'price',
              event.target.value
            )
          }
        />

        <label className="catalog-item-form__old-price">
          <span className="catalog-item-form__label">
            Старая цена (до скидки)
          </span>

          <input
            className="catalog-item-form__old-price-input"
            type="number"
            min="1"
            step="1"
            inputMode="numeric"
            value={values.oldPrice}
            placeholder="Например, 10 000"
            aria-invalid={Boolean(
              errors.oldPrice
            )}
            disabled={isSubmitting}
            onChange={(event) => {
              setField(
                'oldPrice',
                event.target.value
              );
            }}
          />

          <span className="catalog-item-form__old-price-hint">
            Необязательное поле. Цена должна
            быть больше текущей.
          </span>

          {errors.oldPrice && (
            <span className="catalog-item-form__error">
              {errors.oldPrice}
            </span>
          )}
        </label>

        <fieldset className="catalog-item-form__radio-fieldset">
          <legend>Единица цены*</legend>

          <div className="catalog-item-form__radio-group">
            {priceUnitOptions.map(
              (option) => (
                <label
                  className="catalog-item-form__radio"
                  key={option.value}
                >
                  <input
                    type="radio"
                    name="price-unit"
                    value={option.value}
                    checked={
                      values.priceUnit ===
                      option.value
                    }
                    onChange={() =>
                      setField(
                        'priceUnit',
                        option.value
                      )
                    }
                  />

                  <span>
                    {option.label}
                  </span>
                </label>
              )
            )}
          </div>
        </fieldset>
      </div>

      <fieldset className="catalog-item-form__radio-fieldset">
        <legend>Тип позиции*</legend>

        <div className="catalog-item-form__radio-group catalog-item-form__radio-group--inline">
          {kindOptions.map((option) => (
            <label
              className="catalog-item-form__radio"
              key={option.value}
            >
              <input
                type="radio"
                name="catalog-kind"
                value={option.value}
                checked={
                  values.kind ===
                  option.value
                }
                onChange={() =>
                  setKind(option.value)
                }
              />

              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="catalog-item-form__textarea-field">
        <span className="catalog-item-form__label">
          Описание
        </span>

        <textarea
          value={values.description}
          placeholder="Описание позиции каталога"
          onChange={(event) =>
            setField(
              'description',
              event.target.value
            )
          }
        />
      </label>

      <label className="catalog-item-form__textarea-field">
        <span className="catalog-item-form__label">
          Характеристики
        </span>

        <span className="catalog-item-form__hint">
          Записывайте через точку с запятой
          или с новой строки в формате
          «Название: значение».
        </span>

        <textarea
          value={
            values.characteristicsText
          }
          placeholder={
            'Мощность: 500 куб. см;\nМаршрут: лесные трассы'
          }
          onChange={(event) =>
            setField(
              'characteristicsText',
              event.target.value
            )
          }
        />
      </label>

      {values.kind === 'vehicle' && (
        <SelectField
          className="catalog-item-form__season"
          label="Сезон"
          value={values.season}
          placeholder="Выберите сезон"
          options={seasonOptions}
          required
          onChange={(value) =>
            setField(
              'season',
              value as typeof values.season
            )
          }
        />
      )}

      {values.kind === 'package' && (
        <section className="catalog-item-form__section">
          <div className="catalog-item-form__section-heading">
            <h3>Состав пакета</h3>

            <p>
              Выберите технику и услуги,
              входящие в готовую программу.
            </p>
          </div>

          <div className="catalog-item-form__package-columns">
            <fieldset className="catalog-item-form__checkbox-group">
              <legend>Техника</legend>

              {vehicleItems.map(
                (vehicle) => (
                  <label
                    className="catalog-item-form__checkbox"
                    key={vehicle.id}
                  >
                    <input
                      type="checkbox"
                      checked={values.includedVehicleIds.includes(
                        vehicle.id
                      )}
                      onChange={() =>
                        toggleIncludedItem(
                          'includedVehicleIds',
                          vehicle.id
                        )
                      }
                    />

                    <span>
                      {vehicle.title}
                    </span>
                  </label>
                )
              )}
            </fieldset>

            <fieldset className="catalog-item-form__checkbox-group">
              <legend>Услуги</legend>

              {serviceItems.map(
                (service) => (
                  <label
                    className="catalog-item-form__checkbox"
                    key={service.id}
                  >
                    <input
                      type="checkbox"
                      checked={values.includedServiceIds.includes(
                        service.id
                      )}
                      onChange={() =>
                        toggleIncludedItem(
                          'includedServiceIds',
                          service.id
                        )
                      }
                    />

                    <span>
                      {service.title}
                    </span>
                  </label>
                )
              )}
            </fieldset>
          </div>

          {errors.packageItems && (
            <p className="catalog-item-form__error">
              {errors.packageItems}
            </p>
          )}
        </section>
      )}

      {values.kind !== 'service' && (
        <section className="catalog-item-form__section">
          <div className="catalog-item-form__section-heading">
            <h3>Опции бронирования</h3>

            <p>
              Для техники выбирается услуга,
              количество человек,
              продолжительность в часах и
              точная цена.
            </p>
          </div>

          <div className="catalog-item-form__options">
            {values.bookingOptions.map(
              (option, index) => (
                <div
                  className="catalog-item-form__option"
                  key={option.id}
                >
                  <div className="catalog-item-form__option-number">
                    Опция {index + 1}
                  </div>

                  <div className="catalog-item-form__option-fields">
                    <SelectField
                      label="Услуга"
                      value={
                        option.serviceId
                      }
                      placeholder={
                        values.kind ===
                        'package'
                          ? 'Готовая программа'
                          : 'Выберите услугу'
                      }
                      options={
                        serviceOptions
                      }
                      required={
                        values.kind ===
                        'vehicle'
                      }
                      isDisabled={
                        values.kind ===
                        'package'
                      }
                      onChange={(value) =>
                        updateBookingOption(
                          option.id,
                          {
                            serviceId:
                              value,
                          }
                        )
                      }
                    />

                    <SelectField
                      label="Человек"
                      value={
                        option.peopleCount
                      }
                      placeholder="Количество"
                      options={
                        peopleOptions
                      }
                      required
                      onChange={(value) =>
                        updateBookingOption(
                          option.id,
                          {
                            peopleCount:
                              value,
                          }
                        )
                      }
                    />

                    <TextField
                      label="Время, ч."
                      type="number"
                      min="0.5"
                      max="6"
                      step="0.5"
                      value={
                        option.durationHours
                      }
                      placeholder="1,5"
                      onChange={(event) =>
                        updateBookingOption(
                          option.id,
                          {
                            durationHours:
                              event.target
                                .value,
                          }
                        )
                      }
                    />

                    <TextField
                      label="Цена"
                      type="number"
                      min="1"
                      step="1"
                      value={option.price}
                      placeholder="3500"
                      onChange={(event) =>
                        updateBookingOption(
                          option.id,
                          {
                            price:
                              event.target
                                .value,
                          }
                        )
                      }
                    />

                    <button
                      className="catalog-item-form__remove-option"
                      type="button"
                      onClick={() =>
                        removeBookingOption(
                          option.id
                        )
                      }
                    >
                      Удалить
                    </button>
                  </div>

                  {errors.optionRows[
                    option.id
                  ] && (
                    <p className="catalog-item-form__error">
                      {
                        errors.optionRows[
                          option.id
                        ]
                      }
                    </p>
                  )}
                </div>
              )
            )}
          </div>

          <button
            className="catalog-item-form__add-option"
            type="button"
            onClick={addBookingOption}
          >
            Добавить опцию
          </button>

          {errors.bookingOptions && (
            <p className="catalog-item-form__error">
              {errors.bookingOptions}
            </p>
          )}
        </section>
      )}

      {values.kind === 'service' && (
        <div className="catalog-item-form__notice">
          Эта услуга доступна только вместе с
          техникой. Цена, продолжительность и
          количество человек настраиваются в
          опциях бронирования соответствующей
          техники.
        </div>
      )}

      <section className="catalog-item-form__section">
        <div className="catalog-item-form__section-heading">
          <h3>Изображения</h3>

          <p>
            Можно добавить до трёх
            изображений. Первое изображение
            будет главным.
          </p>
        </div>

        <input
          className="catalog-item-form__file-input"
          id={uploadInputId}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleFileChange}
        />

        <label
          className="catalog-item-form__upload"
          htmlFor={uploadInputId}
          aria-disabled={
            values.images.length >= 3
          }
        >
          Загрузить фото
        </label>

        {values.images.length > 0 && (
          <div className="catalog-item-form__images">
            {values.images.map(
              (image, index) => (
                <article
                  className="catalog-item-form__image-card"
                  key={image.id}
                >
                  <div className="catalog-item-form__image-wrap">
                    <Image
                      src={image.url}
                      alt={
                        image.alt ||
                        values.title
                      }
                      fill
                      sizes="180px"
                      unoptimized={image.url.startsWith(
                        'blob:'
                      )}
                    />
                  </div>

                  <div className="catalog-item-form__image-info">
                    <span>
                      {index === 0
                        ? 'Главное изображение'
                        : `Изображение ${
                            index + 1
                          }`}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        removeImage(
                          image.id
                        )
                      }
                    >
                      Удалить
                    </button>
                  </div>
                </article>
              )
            )}
          </div>
        )}

        {errors.images && (
          <p className="catalog-item-form__error">
            {errors.images}
          </p>
        )}
      </section>

      <div className="catalog-item-form__flags">
        <label className="catalog-item-form__checkbox">
          <input
            type="checkbox"
            checked={values.isAvailable}
            onChange={(event) =>
              setField(
                'isAvailable',
                event.target.checked
              )
            }
          />

          <span>В наличии</span>
        </label>
      </div>

      {errors.submit && (
        <p
          className="catalog-item-form__submit-error"
          role="alert"
        >
          {errors.submit}
        </p>
      )}

      <div className="catalog-item-form__actions">
        <Button
          type="submit"
          text={
            mode === 'edit'
              ? 'Сохранить изменения'
              : 'Добавить товар'
          }
          variant="mid"
          isLoading={isSubmitting}
          isDisabled={isDeleting}
          className="catalog-item-form__submit"
        />

        <Link
          className="catalog-item-form__cancel"
          href="/admin/catalog"
          aria-disabled={isDeleting}
          onClick={(event) => {
            if (isDeleting) {
              event.preventDefault();
            }
          }}
        >
          Отмена
        </Link>

        {mode === 'edit' && onDelete && (
          <button
            className="catalog-item-form__delete"
            type="button"
            disabled={
              isSubmitting || isDeleting
            }
            onClick={onDelete}
          >
            {isDeleting
              ? 'Удаление...'
              : 'Удалить товар'}
          </button>
        )}
      </div>
    </form>
  );
}