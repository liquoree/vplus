'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { MouseEvent } from 'react';
import { Navigation, Pagination } from 'swiper/modules';

import { Button } from '@/shared/ui';
import type { CatalogItem } from '../../model/types';

import './CatalogModal.scss';

type CatalogModalProps = {
  item: CatalogItem;
  items: CatalogItem[];
  onClose?: () => void;
};

function getBookingHref(item: CatalogItem) {
  if (item.kind === 'package') {
    return `/booking?package=${item.slug}`;
  }

  if (item.kind === 'service') {
    return `/booking?service=${item.slug}`;
  }

  return `/booking?vehicle=${item.slug}`;
}

function getPriceLabel(item: CatalogItem) {
  const unit = item.priceUnit === 'hour' ? '/ч' : '';

  return `от ${item.price}₽${unit}`;
}

function getSeasonLabel(item: CatalogItem) {
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

function getProgramNames(item: CatalogItem, items: CatalogItem[]) {
  if (item.kind === 'vehicle') {
    return item.serviceIds
      .map((id) => items.find((catalogItem) => catalogItem.id === id)?.title)
      .filter(Boolean);
  }

  if (item.kind === 'package') {
    return item.includedServiceIds
      .map((id) => items.find((catalogItem) => catalogItem.id === id)?.title)
      .filter(Boolean);
  }

  return [];
}

export function CatalogModal({ item, items, onClose }: CatalogModalProps) {
  const images = [...item.images].sort((a, b) => a.sortOrder - b.sortOrder);
  const programs = getProgramNames(item, items);

    const handleCloseClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!onClose) {
        return;
    }

    event.preventDefault();
    onClose();
    };

  return (
    <div className="catalog-modal">
      <div className="catalog-modal__overlay" />

      <article className="catalog-modal__dialog">
        <Link
          className="catalog-modal__close"
          href="/catalog"
          aria-label="Закрыть"
          onClick={handleCloseClick}
        >
          <Image
            src="/images/close.svg"
            alt=""
            width={20}
            height={20}
          />
        </Link>

        <div className="catalog-modal__gallery">
          <Swiper
            className="catalog-modal__swiper"
            modules={[Navigation, Pagination]}
            navigation={images.length > 1}
            pagination={images.length > 1 ? { clickable: true } : false}
            slidesPerView={1}
            loop={images.length > 1}
          >
            {images.map((image) => (
              <SwiperSlide className="catalog-modal__slide" key={image.id}>
                <div className="catalog-modal__image-wrap">
                  <Image
                    className="catalog-modal__image"
                    src={image.url}
                    alt={image.alt ?? item.title}
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
            <h2 className="catalog-modal__title">{item.title}</h2>
            <span className="catalog-modal__season">{getSeasonLabel(item)}</span>
          </div>

          <div className="catalog-modal__price-row">
            <p className="catalog-modal__price">{getPriceLabel(item)}</p>

            <span className="catalog-modal__status">
              {item.isAvailable ? 'В наличии' : 'Нет в наличии'}
            </span>
          </div>

          <p className="catalog-modal__description">{item.description}</p>

          {item.characteristics && item.characteristics.length > 0 && (
            <div className="catalog-modal__block">
              <h3 className="catalog-modal__subtitle">Характеристики</h3>

              <ul className="catalog-modal__list">
                {item.characteristics.map((characteristic) => (
                  <li className="catalog-modal__list-item" key={characteristic.name}>
                    <span>{characteristic.name}: </span>
                    {characteristic.value}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {programs.length > 0 && (
            <div className="catalog-modal__block">
              <h3 className="catalog-modal__subtitle">Доступные программы</h3>

              <ul className="catalog-modal__list">
                {programs.map((program) => (
                  <li className="catalog-modal__list-item" key={program}>
                    {program}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="catalog-modal__actions">
            <Button
              as="link"
              href={getBookingHref(item)}
              text="Забронировать"
              variant="hero"
              className="catalog-modal__booking"
              isDisabled={!item.isAvailable}
            />

            <Button
              as="link"
              href="/catalog"
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