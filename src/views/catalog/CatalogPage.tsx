'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { CatalogCard } from '@/entities/catalog/ui/catalog-card/CatalogCard';
import { CatalogModal } from '@/entities/catalog/ui/catalog-modal/CatalogModal';
import type { CatalogItem } from '@/entities/catalog/model/types';
import { Footer, Header, HelpCta, TemplateInfoPage } from '@/widgets';
import { cn } from '@/shared/lib/cn';

import './CatalogPage.scss';

type CatalogPageProps = {
  items: CatalogItem[];
  selectedItem?: CatalogItem;
};

type CatalogFilter = 'all' | 'summer' | 'winter' | 'services';

const filters: Array<{
  value: CatalogFilter;
  label: string;
}> = [
  { value: 'all', label: 'Все' },
  { value: 'summer', label: 'Лето' },
  { value: 'winter', label: 'Зима' },
  { value: 'services', label: 'Услуги' },
];

function filterItems(items: CatalogItem[], filter: CatalogFilter) {
  if (filter === 'all') {
    return items;
  }

  if (filter === 'services') {
    return items.filter((item) => item.kind === 'service');
  }

  return items.filter((item) => {
    if (item.kind !== 'vehicle') {
      return false;
    }

    return item.season === filter || item.season === 'all_season';
  });
}

export function CatalogPage({ items, selectedItem }: CatalogPageProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const [activeFilter, setActiveFilter] = useState<CatalogFilter>('all');

  const selectedSlug = selectedItem?.slug ?? null;

  const [routeSlug, setRouteSlug] = useState<string | null>(selectedSlug);
  const [modalItem, setModalItem] = useState<CatalogItem | undefined>(selectedItem);

  if (selectedSlug !== routeSlug) {
    setRouteSlug(selectedSlug);
    setModalItem(selectedItem);
  }

  const filteredItems = filterItems(items, activeFilter);

  const openModal = (item: CatalogItem) => {
    setModalItem(item);

    startTransition(() => {
      router.push(`/catalog/${item.slug}`, {
        scroll: false,
      });
    });
  };

  const closeModal = () => {
    setModalItem(undefined);

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
                    activeFilter === filter.value && 'catalog-page__filter--active'
                  )}
                  type="button"
                  key={filter.value}
                  onClick={() => setActiveFilter(filter.value)}
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

        {modalItem && (
          <CatalogModal
            item={modalItem}
            items={items}
            onClose={closeModal}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}