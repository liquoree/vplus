'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { MouseEvent } from 'react';

import { cn } from '@/shared/lib/cn';

import type { CatalogItem } from '../../model/types';

type CatalogCardProps = {
    item: CatalogItem;
    onOpen?: (item: CatalogItem) => void;
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

function getCurrentPriceLabel(item: CatalogItem) {
    const unit = item.priceUnit === 'hour' ? '/ч' : '';

    return `${item.price.toLocaleString('ru-RU')}₽${unit}`;
}

function getOldPriceLabel(item: CatalogItem) {
    const oldPrice = item.oldPrice;

    if (typeof oldPrice !== 'number' || !Number.isFinite(oldPrice) || oldPrice <= item.price) {
        return null;
    }

    return oldPrice.toLocaleString('ru-RU');
}

function getMainImage(item: CatalogItem) {
    return item.images.find((image) => image.isMain) ?? item.images[0];
}

export function CatalogCard({ item, onOpen }: CatalogCardProps) {
    const mainImage = getMainImage(item);

    const oldPriceLabel = getOldPriceLabel(item);

    const handleImageClick = (event: MouseEvent<HTMLAnchorElement>) => {
        if (!onOpen) {
            return;
        }

        event.preventDefault();
        onOpen(item);
    };

    return (
        <article className="catalog-card">
            {mainImage && (
                <Link
                    className="catalog-card__image-link"
                    href={`/catalog/${item.slug}`}
                    onClick={handleImageClick}
                    prefetch
                >
                    <Image
                        className="catalog-card__image"
                        src={mainImage.url}
                        alt={mainImage.alt ?? item.title}
                        fill
                        sizes="(max-width: 768px) 50vw, 270px"
                    />
                </Link>
            )}

            <div className="catalog-card__body">
                <h3 className="catalog-card__title">{item.title}</h3>

                <p className="catalog-card__description">{item.description}</p>

                <div className="catalog-card__prices">
                    <span className="catalog-card__price-prefix">от</span>

                    {oldPriceLabel && (
                        <span className="catalog-card__old-price">{oldPriceLabel}</span>
                    )}

                    <span className="catalog-card__price">{getCurrentPriceLabel(item)}</span>
                </div>

                <div
                    className={cn(
                        'catalog-card__status',
                        !item.isAvailable && 'catalog-card__status--unavailable',
                    )}
                >
                    <span className="catalog-card__status-dot" />

                    {item.isAvailable ? 'В наличии' : 'Нет в наличии'}
                </div>
            </div>

            <Link
                className="catalog-card__button"
                href={getBookingHref(item)}
                aria-disabled={!item.isAvailable}
            >
                Забронировать
            </Link>
        </article>
    );
}
