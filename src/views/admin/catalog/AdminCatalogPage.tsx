import Link from 'next/link';

import './AdminCatalogPage.scss';

export function AdminCatalogPage() {
  return (
    <section className="admin-catalog-page">
      <div className="admin-catalog-page__header">
        <div>
          <h2 className="admin-catalog-page__title">
            Каталог
          </h2>

          <p className="admin-catalog-page__description">
            Управление техникой, услугами и
            готовыми программами
          </p>
        </div>

        <Link
          className="admin-catalog-page__add"
          href="/admin/catalog/new"
        >
          Добавить позицию
        </Link>
      </div>

      <div className="admin-catalog-page__empty">
        <strong>
          Административный каталог подготовлен
        </strong>

        <p>
          На следующем этапе выведем реальные
          позиции каталога, добавим карандаш для
          редактирования и удаление через
          модальное подтверждение.
        </p>
      </div>
    </section>
  );
}