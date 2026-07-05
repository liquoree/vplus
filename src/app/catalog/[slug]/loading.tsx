import { Footer, Header, TemplateInfoPage } from '@/widgets';
import { CatalogModalSkeleton } from '@/entities/catalog/';

export default function Loading() {
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
              <button className="catalog-page__filter catalog-page__filter--active">
                Все
              </button>
              <button className="catalog-page__filter">Лето</button>
              <button className="catalog-page__filter">Зима</button>
              <button className="catalog-page__filter">Услуги</button>
            </div>
          </div>
        </TemplateInfoPage>

        <CatalogModalSkeleton />
      </main>

      <Footer />
    </div>
  );
}