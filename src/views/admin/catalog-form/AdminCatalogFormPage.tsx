'use client';

import Link from 'next/link';

import { useCallback, useMemo, useState } from 'react';

import type { AdminCatalogItem, CatalogBookingOption } from '@/entities/catalog';

import { createCatalogItem } from '@/features/admin/catalog-item-form/api/create-catalog-item';

import { deleteCatalogItem } from '@/features/admin/catalog-item-form/api/delete-catalog-item';

import { updateCatalogItem } from '@/features/admin/catalog-item-form/api/update-catalog-item';

import {
    CatalogItemDeleteModal,
    CatalogItemForm,
    type CatalogItemFormSubmitPayload,
} from '@/features/admin/';

import './AdminCatalogFormPage.scss';

type AdminCatalogFormPageProps = {
    mode: 'create' | 'edit';

    itemId?: string;

    initialItems: AdminCatalogItem[];

    initialBookingOptions: CatalogBookingOption[];
};

export function AdminCatalogFormPage({
    mode,
    itemId,
    initialItems,
    initialBookingOptions,
}: AdminCatalogFormPageProps) {
    const [deleteTarget, setDeleteTarget] = useState<AdminCatalogItem | null>(null);

    const [isDeleting, setIsDeleting] = useState(false);

    const [deleteError, setDeleteError] = useState('');

    const item = useMemo(
        () =>
            mode === 'edit'
                ? initialItems.find((catalogItem) => catalogItem.id === itemId)
                : undefined,
        [initialItems, itemId, mode],
    );

    const itemBookingOptions = useMemo(() => {
        if (!item || item.kind === 'service') {
            return [];
        }

        return initialBookingOptions.filter((option) => option.bookableItemId === item.id);
    }, [initialBookingOptions, item]);

    const handleSubmit = async (payload: CatalogItemFormSubmitPayload) => {
        if (mode === 'create') {
            await createCatalogItem(payload);

            window.location.replace('/admin/catalog');

            return;
        }

        if (!item) {
            throw new Error('Позиция не найдена.');
        }

        await updateCatalogItem(item.id, payload, item.version);

        window.location.replace('/admin/catalog');
    };

    const openDeleteModal = useCallback(() => {
        if (!item || isDeleting) {
            return;
        }

        setDeleteError('');
        setDeleteTarget(item);
    }, [isDeleting, item]);

    const closeDeleteModal = useCallback(() => {
        if (isDeleting) {
            return;
        }

        setDeleteError('');
        setDeleteTarget(null);
    }, [isDeleting]);

    const confirmDelete = useCallback(async () => {
        if (!deleteTarget || isDeleting) {
            return;
        }

        setDeleteError('');
        setIsDeleting(true);

        try {
            const result = await deleteCatalogItem(deleteTarget.id, deleteTarget.version);

            if (!result.success) {
                throw new Error('Не удалось удалить позицию.');
            }

            window.location.replace('/admin/catalog');
        } catch (error) {
            setDeleteError(error instanceof Error ? error.message : 'Не удалось удалить товар');

            setIsDeleting(false);
        }
    }, [deleteTarget, isDeleting]);

    if (mode === 'edit' && !item) {
        return (
            <section className="admin-catalog-form-page">
                <Link href="/admin/catalog" className="admin-catalog-form-page__back">
                    ‹ Назад
                </Link>

                <div className="admin-catalog-form-page__not-found">
                    <h2>Позиция не найдена</h2>

                    <p>Возможно, позиция была удалена или ссылка устарела.</p>
                </div>
            </section>
        );
    }

    return (
        <>
            <section className="admin-catalog-form-page">
                <Link href="/admin/catalog" className="admin-catalog-form-page__back">
                    ‹ Назад
                </Link>

                <h2 className="admin-catalog-form-page__title">
                    {mode === 'edit' ? 'Изменение товара' : 'Добавление товара'}
                </h2>

                <div className="admin-catalog-form-page__form">
                    <CatalogItemForm
                        mode={mode}
                        item={item}
                        initialBookingOptions={itemBookingOptions}
                        catalogItems={initialItems}
                        onSubmit={handleSubmit}
                        onDelete={mode === 'edit' ? openDeleteModal : undefined}
                        isDeleting={isDeleting}
                    />
                </div>
            </section>

            {deleteTarget && (
                <CatalogItemDeleteModal
                    itemTitle={deleteTarget.title}
                    isDeleting={isDeleting}
                    error={deleteError}
                    onConfirm={confirmDelete}
                    onClose={closeDeleteModal}
                />
            )}
        </>
    );
}
