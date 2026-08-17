import { CatalogModalSkeleton } from '@/entities/catalog';
import { Footer, Header, TemplateInfoPage } from '@/widgets';

const filters = ['Все', 'Лето', 'Зима', 'Услуги'];

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
                        <div className="catalog-page__filters" aria-hidden="true">
                            {filters.map((filter, index) => (
                                <button
                                    className={
                                        index === 0
                                            ? 'catalog-page__filter catalog-page__filter--active'
                                            : 'catalog-page__filter'
                                    }
                                    type="button"
                                    disabled
                                    key={filter}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>
                    </div>
                </TemplateInfoPage>

                <CatalogModalSkeleton />
            </main>

            <Footer />
        </div>
    );
}
