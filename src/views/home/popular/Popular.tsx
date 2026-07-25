'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

import {
  CatalogCard,
  type CatalogItem,
} from '@/entities/catalog';
import { Button } from '@/shared/ui';

import './Popular.scss';

type PopularProps = {
  items: CatalogItem[];
};

export function Popular({ items }: PopularProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const openCatalogItem = (item: CatalogItem) => {
    startTransition(() => {
      router.push(`/catalog/${item.slug}`, {
        scroll: false,
      });
    });
  };

  return (
    <section className="popular-section">
      <div className="popular-section__inner">
        <h2 className="popular-section__title">
          Популярная техника
        </h2>

        <div className="popular-section__grid">
          {items.map((item) => (
            <CatalogCard
              item={item}
              key={item.id}
              onOpen={openCatalogItem}
            />
          ))}
        </div>

        <Button
          as="link"
          href="/catalog"
          text="Посмотреть ещё"
          variant="hero"
          className="popular-section__more"
        />
      </div>
    </section>
  );
}