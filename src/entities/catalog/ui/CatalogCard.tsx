import Image from 'next/image';
import Link from 'next/link';
import type { CatalogItem } from '../model/types';

type CatalogCardProps = {
  item: CatalogItem;
};

function getBookingHref(item: CatalogItem) {
  if (item.kind === 'package') {
    return `/rent?package=${item.slug}`;
  }

  if (item.kind === 'service') {
    return `/rent?service=${item.slug}`;
  }

  return `/rent?vehicle=${item.slug}`;
}

function getPriceLabel(item: CatalogItem) {
  const unit = item.priceUnit === 'hour' ? '/ч' : '';

  return `от ${item.price}₽${unit}`;
}

function getMainImage(item: CatalogItem) {
  return item.images.find((image) => image.isMain) ?? item.images[0];
}

export function CatalogCard({ item }: CatalogCardProps) {
  const mainImage = getMainImage(item);

  return (
    <article className="catalog-card">
      {mainImage && (
        <Link className="catalog-card__image-link" href={`/catalog/${item.slug}`}>
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

        <div className="catalog-card__price">{getPriceLabel(item)}</div>

        <div className="catalog-card__status">
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