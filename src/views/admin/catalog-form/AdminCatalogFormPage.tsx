'use client';

import Link from 'next/link';
import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import type {
  CatalogBookingOption,
  CatalogItem,
} from '@/entities/catalog';

import { useAdminCatalogStore } from '@/entities/catalog/lib/use-admin-catalog-store';

import {
  deleteAdminCatalogItem,
  upsertAdminCatalogItem,
} from '@/entities/catalog/mock/admin-catalog-store';

import {
  CatalogItemDeleteModal,
  CatalogItemForm,
  type CatalogItemFormSubmitPayload,
} from '@/features/admin/';

import './AdminCatalogFormPage.scss';

type AdminCatalogFormPageProps = {
  mode: 'create' | 'edit';

  itemId?: string;

  initialItems: CatalogItem[];

  initialBookingOptions:
    CatalogBookingOption[];
};

export function AdminCatalogFormPage({
  mode,
  itemId,
  initialItems,
  initialBookingOptions,
}: AdminCatalogFormPageProps) {
  const router = useRouter();

  const catalog = useAdminCatalogStore(
    initialItems,
    initialBookingOptions
  );

  const [deleteTarget, setDeleteTarget] =
    useState<CatalogItem | null>(null);

  const [isDeleting, setIsDeleting] =
    useState(false);

  const [deleteError, setDeleteError] =
    useState('');

  const item = useMemo(
    () =>
      mode === 'edit'
        ? catalog.items.find(
            (catalogItem) =>
              catalogItem.id === itemId
          )
        : undefined,
    [catalog.items, itemId, mode]
  );

  /**
   * После синхронного удаления store сразу
   * уведомляет подписчиков. Сохраняем удаляемый
   * объект в deleteTarget, чтобы текущая страница
   * не перешла в состояние «не найдено» раньше,
   * чем завершится router.replace().
   */
  const formItem = item ?? deleteTarget ?? undefined;

  const itemBookingOptions = useMemo(() => {
    if (
      !formItem ||
      formItem.kind === 'service'
    ) {
      return [];
    }

    return catalog.bookingOptions.filter(
      (option) =>
        option.bookableItemId ===
        formItem.id
    );
  }, [catalog.bookingOptions, formItem]);

  const handleSubmit = async (
    payload: CatalogItemFormSubmitPayload
  ) => {
    upsertAdminCatalogItem(
      payload.item,
      payload.bookingOptions
    );

    router.push('/admin/catalog');
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

  const confirmDelete = useCallback(() => {
    if (!deleteTarget || isDeleting) {
      return;
    }

    setDeleteError('');
    setIsDeleting(true);

    try {
      const wasDeleted =
        deleteAdminCatalogItem(
          deleteTarget.id
        );

      if (!wasDeleted) {
        throw new Error(
          'Позиция уже удалена'
        );
      }

      /**
       * replace удаляет страницу редактирования
       * из истории браузера. После удаления
       * кнопка «Назад» не вернёт пользователя
       * на несуществующий маршрут.
       */
      router.replace('/admin/catalog');
    } catch {
      setDeleteError(
        'Не удалось удалить товар'
      );
      setIsDeleting(false);
    }
  }, [deleteTarget, isDeleting, router]);

  if (mode === 'edit' && !formItem) {
    return (
      <section className="admin-catalog-form-page">
        <Link
          className="admin-catalog-form-page__back"
          href="/admin/catalog"
        >
          <span aria-hidden="true">‹</span>
          Назад
        </Link>

        <div className="admin-catalog-form-page__not-found">
          <h2>Позиция не найдена</h2>

          <p>
            Возможно, позиция была удалена
            или ссылка устарела.
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="admin-catalog-form-page">
        <Link
          className="admin-catalog-form-page__back"
          href="/admin/catalog"
        >
          <span aria-hidden="true">‹</span>
          Назад
        </Link>

        <h2 className="admin-catalog-form-page__title">
          {mode === 'edit'
            ? 'Изменение товара'
            : 'Добавление товара'}
        </h2>

        <div className="admin-catalog-form-page__form">
          <CatalogItemForm
            mode={mode}
            item={formItem}
            initialBookingOptions={
              itemBookingOptions
            }
            catalogItems={catalog.items}
            onSubmit={handleSubmit}
            onDelete={
              mode === 'edit'
                ? openDeleteModal
                : undefined
            }
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