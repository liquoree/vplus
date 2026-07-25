'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

import { CatalogCard } from '@/entities/catalog/ui/catalog-card/CatalogCard';
import { CatalogModal } from '@/entities/catalog/ui/catalog-modal/CatalogModal';
import type { CatalogBookingOption } from '@/entities/catalog/model/booking-option-types';
import type { CatalogItem } from '@/entities/catalog/model/types';
import { cn } from '@/shared/lib/cn';
import {
  Footer,
  Header,
  HelpCta,
  TemplateInfoPage,
} from '@/widgets';

import './CatalogPage.scss';

type CatalogPageProps = {
  items: CatalogItem[];
  bookingOptions: CatalogBookingOption[];
  selectedItem?: CatalogItem;
};

type CatalogFilter =
  | 'all'
  | 'summer'
  | 'winter'
  | 'services';

const filters: Array<{
  value: CatalogFilter;
  label: string;
}> = [
  {
    value: 'all',
    label: 'Все',
  },
  {
    value: 'summer',
    label: 'Лето',
  },
  {
    value: 'winter',
    label: 'Зима',
  },
  {
    value: 'services',
    label: 'Услуги',
  },
];

function filterItems(
  items: CatalogItem[],
  filter: CatalogFilter
) {
  if (filter === 'all') {
    return items;
  }

  if (filter === 'services') {
    return items.filter(
      (item) => item.kind === 'service'
    );
  }

  return items.filter((item) => {
    if (item.kind !== 'vehicle') {
      return false;
    }

    return (
      item.season === filter ||
      item.season === 'all_season'
    );
  });
}

export function CatalogPage({
  items,
  bookingOptions,
  selectedItem,
}: CatalogPageProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const [activeFilter, setActiveFilter] =
    useState<CatalogFilter>('all');

  const filteredItems = filterItems(
    items,
    activeFilter
  );

  const openModal = (item: CatalogItem) => {
    startTransition(() => {
      router.push(`/catalog/${item.slug}`, {
        scroll: false,
      });
    });
  };

  const closeModal = () => {
    startTransition(() => {
      router.push('/catalog', {
        scroll: false,
      });
    });
  };

  return (
    <div className="catalog-page">
      <Header />

      <main className="catalog-page__main">
        <TemplateInfoPage
          title="Каталог"
          description="Выберите технику и забронируйте онлайн за пару минут"
        >
          <div className="catalog-page__content">
            <div className="catalog-page__filters">
              {filters.map((filter) => (
                <button
                  className={cn(
                    'catalog-page__filter',
                    activeFilter === filter.value &&
                      'catalog-page__filter--active'
                  )}
                  type="button"
                  key={filter.value}
                  onClick={() =>
                    setActiveFilter(filter.value)
                  }
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <div className="catalog-page__grid">
              {filteredItems.map((item) => (
                <CatalogCard
                  item={item}
                  key={item.id}
                  onOpen={openModal}
                />
              ))}
            </div>

            <HelpCta
              icon="question-mark-bubble"
              title="Не знаете, что выбрать?"
              description="Мы поможем подобрать технику под ваши желания и подскажем лучшую программу"
              buttonText="Связаться с менеджером"
              href="/contacts"
            />
          </div>
        </TemplateInfoPage>

        {selectedItem && (
          <CatalogModal
            item={selectedItem}
            items={items}
            bookingOptions={bookingOptions}
            onClose={closeModal}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}