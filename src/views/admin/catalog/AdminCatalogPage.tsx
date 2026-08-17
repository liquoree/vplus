'use client';

import Link from 'next/link';

import { useMemo, useState, useTransition } from 'react';

import { useRouter } from 'next/navigation';

import { AdminCatalogCard, type CatalogBookingOption, type CatalogItem } from '@/entities/catalog';

import { CatalogModal } from '@/entities/catalog/ui/catalog-modal/CatalogModal';

import { cn } from '@/shared/lib/cn';

import './AdminCatalogPage.scss';

type AdminCatalogPageProps = {
    initialItems: CatalogItem[];

    initialBookingOptions: CatalogBookingOption[];

    selectedItemId?: string;
};

type CatalogFilter = 'all' | 'summer' | 'winter' | 'services';

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

function filterCatalogItems(items: CatalogItem[], filter: CatalogFilter) {
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

export function AdminCatalogPage({
    initialItems,
    initialBookingOptions,
    selectedItemId,
}: AdminCatalogPageProps) {
    const router = useRouter();

    const [, startTransition] = useTransition();

    const [activeFilter, setActiveFilter] = useState<CatalogFilter>('all');

    const filteredItems = useMemo(
        () => filterCatalogItems(initialItems, activeFilter),
        [initialItems, activeFilter],
    );

    const selectedItem = useMemo(
        () =>
            selectedItemId ? initialItems.find((item) => item.id === selectedItemId) : undefined,
        [initialItems, selectedItemId],
    );

    const openItem = (item: CatalogItem) => {
        startTransition(() => {
            router.push(`/admin/catalog/${item.id}`, {
                scroll: false,
            });
        });
    };

    const closeItem = () => {
        startTransition(() => {
            router.push('/admin/catalog', {
                scroll: false,
            });
        });
    };

    return (
        <section className="admin-catalog-page">
            <div className="admin-catalog-page__header">
                <div>
                    <h1 className="admin-catalog-page__title">Каталог</h1>

                    <p className="admin-catalog-page__description">
                        Управление техникой, услугами и готовыми программами
                    </p>
                </div>

                <Link className="admin-catalog-page__add" href="/admin/catalog/new">
                    Добавить позицию
                </Link>
            </div>

            <div className="admin-catalog-page__filters" aria-label="Фильтры каталога">
                {filters.map((filter) => (
                    <button
                        className={cn(
                            'admin-catalog-page__filter',
                            activeFilter === filter.value && 'admin-catalog-page__filter--active',
                        )}
                        type="button"
                        aria-pressed={activeFilter === filter.value}
                        key={filter.value}
                        onClick={() => setActiveFilter(filter.value)}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            {filteredItems.length > 0 ? (
                <div className="admin-catalog-page__grid">
                    {filteredItems.map((item) => (
                        <AdminCatalogCard item={item} onOpen={openItem} key={item.id} />
                    ))}
                </div>
            ) : (
                <div className="admin-catalog-page__empty">
                    <strong>В этом разделе пока нет позиций</strong>

                    <p>Добавьте новую позицию или выберите другой фильтр.</p>
                </div>
            )}

            {selectedItem && (
                <CatalogModal
                    item={selectedItem}
                    items={initialItems}
                    bookingOptions={initialBookingOptions}
                    closeHref="/admin/catalog"
                    showBookingAction={false}
                    onClose={closeItem}
                />
            )}
        </section>
    );
}
