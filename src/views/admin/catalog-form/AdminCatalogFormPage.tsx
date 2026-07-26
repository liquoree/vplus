import Link from 'next/link';

import './AdminCatalogFormPage.scss';

type AdminCatalogFormPageProps = {
  mode: 'create' | 'edit';
  itemId?: string;
};

export function AdminCatalogFormPage({
  mode,
  itemId,
}: AdminCatalogFormPageProps) {
  const isEditMode = mode === 'edit';

  return (
    <section className="admin-catalog-form-page">
      <Link
        className="admin-catalog-form-page__back"
        href="/admin/catalog"
      >
        <span aria-hidden="true">‹</span>
        Назад
      </Link>

      <h2 className="admin-catalog-form-page__title">
        {isEditMode
          ? 'Изменение позиции'
          : 'Добавление позиции'}
      </h2>

      <div className="admin-catalog-form-page__placeholder">
        <strong>
          {isEditMode
            ? 'Форма редактирования подготовлена'
            : 'Форма добавления подготовлена'}
        </strong>

        <p>
          На этапе общей формы здесь появятся
          основные данные позиции, опции
          бронирования и загрузка до трёх
          изображений.
        </p>

        {itemId && (
          <span className="admin-catalog-form-page__id">
            Идентификатор позиции: {itemId}
          </span>
        )}
      </div>
    </section>
  );
}