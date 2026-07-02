'use client';

import { useState } from 'react';
import { CatalogCard } from '@/entities/catalog/ui/CatalogCard';
import type { CatalogItem } from '@/entities/catalog/model/types';
import { Footer, Header, HelpCta, TemplateInfoPage } from '@/widgets';
import { cn } from '@/shared/lib/cn';

import './CatalogPage.scss';

type CatalogPageProps = {
  items: CatalogItem[];
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

export function CatalogPage({ items }: CatalogPageProps) {
  const [activeFilter, setActiveFilter] = useState<CatalogFilter>('all');

  const filteredItems = filterItems(items, activeFilter);

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
                <CatalogCard item={item} key={item.id} />
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
      </main>

      <Footer />
    </div>
  );
}