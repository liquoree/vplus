'use client';

import Image from 'next/image';
import Link from 'next/link';

import type { CatalogItem } from '../../model/types';

import { CatalogCard } from '../catalog-card/CatalogCard';

import './AdminCatalogCard.scss';

type AdminCatalogCardProps = {
  item: CatalogItem;

  onOpen: (
    item: CatalogItem
  ) => void;
};

export function AdminCatalogCard({
  item,
  onOpen,
}: AdminCatalogCardProps) {
  return (
    <article className="admin-catalog-card">
      <CatalogCard
        item={item}
        onOpen={() => onOpen(item)}
      />

      <Link
        className="admin-catalog-card__edit"
        href={`/admin/catalog/${item.id}/edit`}
        aria-label={`Изменить позицию «${item.title}»`}
        title="Изменить"
      >
        <Image
          src="/images/icons/edit-product.svg"
          alt=""
          width={22}
          height={22}
          aria-hidden="true"
        />
      </Link>
    </article>
  );
}