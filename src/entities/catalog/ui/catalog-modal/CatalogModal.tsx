'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { MouseEvent } from 'react';

import {
  Navigation,
  Pagination,
} from 'swiper/modules';

import {
  Swiper,
  SwiperSlide,
} from 'swiper/react';

import { Button } from '@/shared/ui';

import {
  getAvailableBookableItems,
  getAvailableServices,
} from '../../lib/booking-options';

import type { CatalogBookingOption } from '../../model/booking-option-types';
import type { CatalogItem } from '../../model/types';

import './CatalogModal.scss';
import { cn } from '@/shared/lib/cn';

type CatalogModalProps = {
  item: CatalogItem;
  items: CatalogItem[];
  bookingOptions: CatalogBookingOption[];

  onClose?: () => void;

  /**
   * В публичном каталоге показываем кнопку
   * бронирования. В административном — скрываем.
   */
  showBookingAction?: boolean;

  /**
   * Маршрут, на который ведут крестик
   * и кнопка закрытия.
   */
  closeHref?: string;
};

function getBookingHref(
  item: CatalogItem
) {
  if (item.kind === 'package') {
    return `/booking?package=${item.slug}`;
  }

  if (item.kind === 'service') {
    return `/booking?service=${item.slug}`;
  }

  return `/booking?vehicle=${item.slug}`;
}

function getPriceLabel(
  item: CatalogItem
) {
  const unit =
    item.priceUnit === 'hour'
      ? '/ч'
      : '';

  return `от ${item.price.toLocaleString(
    'ru-RU'
  )}₽${unit}`;
}

function getSeasonLabel(
  item: CatalogItem
) {
  if (item.kind === 'package') {
    return 'Пакет';
  }

  if (item.kind === 'service') {
    return 'Услуга';
  }

  const seasonLabels = {
    summer: 'Лето',
    winter: 'Зима',
    all_season: 'Всесезонный',
  };

  return seasonLabels[item.season];
}

function getRelatedItemNames(
  item: CatalogItem,
  items: CatalogItem[],
  bookingOptions: CatalogBookingOption[]
) {
  if (item.kind === 'vehicle') {
    return getAvailableServices(
      items,
      bookingOptions,
      item.id
    ).map((service) => service.title);
  }

  if (item.kind === 'service') {
    return getAvailableBookableItems(
      items,
      bookingOptions,
      item.id
    ).map(
      (bookableItem) =>
        bookableItem.title
    );
  }

  return item.includedServiceIds
    .map((serviceId) => {
      return items.find(
        (catalogItem) =>
          catalogItem.kind === 'service' &&
          catalogItem.id === serviceId
      )?.title;
    })
    .filter(
      (title): title is string =>
        Boolean(title)
    );
}

function getRelatedItemsTitle(
  item: CatalogItem
) {
  if (item.kind === 'service') {
    return 'Доступная техника';
  }

  return 'Доступные программы';
}

export function CatalogModal({
  item,
  items,
  bookingOptions,
  onClose,

  showBookingAction = true,
  closeHref = '/catalog',
}: CatalogModalProps) {
  const images = [...item.images].sort(
    (first, second) =>
      first.sortOrder -
      second.sortOrder
  );

  const relatedItemNames =
    getRelatedItemNames(
      item,
      items,
      bookingOptions
    );

  const handleCloseClick = (
    event: MouseEvent<HTMLAnchorElement>
  ) => {
    if (!onClose) {
      return;
    }

    event.preventDefault();
    onClose();
  };

  const actionsClassName =
    showBookingAction
      ? 'catalog-modal__actions'
      : [
          'catalog-modal__actions',
          'catalog-modal__actions--single',
        ].join(' ');

  return (
    <div className="catalog-modal">
      <div className="catalog-modal__overlay" />

      <article className="catalog-modal__dialog">
        <Link
          className="catalog-modal__close"
          href={closeHref}
          aria-label="Закрыть"
          onClick={handleCloseClick}
        >
          <Image
            className="catalog-modal__close-icon"
            src="/images/close.svg"
            alt=""
            width={20}
            height={20}
          />
        </Link>

        <div className="catalog-modal__gallery">
          <Swiper
            className="catalog-modal__swiper"
            modules={[
              Navigation,
              Pagination,
            ]}
            navigation={images.length > 1}
            pagination={
              images.length > 1
                ? {
                    clickable: true,
                  }
                : false
            }
            slidesPerView={1}
            loop={images.length > 1}
          >
            {images.map((image) => (
              <SwiperSlide
                className="catalog-modal__slide"
                key={image.id}
              >
                <div className="catalog-modal__image-wrap">
                  <Image
                    className="catalog-modal__image"
                    src={image.url}
                    alt={
                      image.alt ??
                      item.title
                    }
                    fill
                    sizes="(max-width: 768px) 100vw, 560px"
                    priority
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="catalog-modal__body">
          <div className="catalog-modal__header">
            <h2 className="catalog-modal__title">
              {item.title}
            </h2>

            <span className="catalog-modal__season">
              {getSeasonLabel(item)}
            </span>
          </div>

          <div className="catalog-modal__price-row">
            <p className="catalog-modal__price">
              {getPriceLabel(item)}
            </p>

            <span
              className={cn(
                'catalog-modal__status',
                !item.isAvailable &&
                  'catalog-modal__status--unavailable'
              )}
            >
              {item.isAvailable
                ? 'В наличии'
                : 'Нет в наличии'}
            </span>
          </div>

          <p className="catalog-modal__description">
            {item.description}
          </p>

          {item.characteristics.length >
            0 && (
            <div className="catalog-modal__block">
              <h3 className="catalog-modal__subtitle">
                Характеристики
              </h3>

              <ul className="catalog-modal__list">
                {item.characteristics.map(
                  (characteristic) => (
                    <li
                      className="catalog-modal__list-item"
                      key={[
                        characteristic.name,
                        characteristic.value,
                      ].join('-')}
                    >
                      <span>
                        {characteristic.name}:{' '}
                      </span>

                      {characteristic.value}
                    </li>
                  )
                )}
              </ul>
            </div>
          )}

          {relatedItemNames.length > 0 && (
            <div className="catalog-modal__block">
              <h3 className="catalog-modal__subtitle">
                {getRelatedItemsTitle(
                  item
                )}
              </h3>

              <ul className="catalog-modal__list">
                {relatedItemNames.map(
                  (name) => (
                    <li
                      className="catalog-modal__list-item"
                      key={name}
                    >
                      {name}
                    </li>
                  )
                )}
              </ul>
            </div>
          )}

          <div className={actionsClassName}>
            {showBookingAction && (
              <Button
                as="link"
                href={getBookingHref(item)}
                text="Забронировать"
                variant="hero"
                className="catalog-modal__booking"
                isDisabled={
                  !item.isAvailable
                }
              />
            )}

            <Button
              as="link"
              href={closeHref}
              text="Закрыть"
              variant="hero"
              className="catalog-modal__cancel"
              onClick={onClose}
            />
          </div>
        </div>
      </article>
    </div>
  );
}