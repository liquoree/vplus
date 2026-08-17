import { Hero } from './hero/Hero';
import { WhyChooseUs } from './why-choose-us/WhyChooseUs';
import { HowRent } from './how-rent/HowRent';
import { Popular } from './popular/Popular';
import { WhereUs } from './where-us/WhereUs';

import { Footer, Header } from '@/widgets';
import { getSeasonalPopularItems } from '@/entities/catalog';
import { getCatalogItems } from '@/entities/catalog/server';

import './HomePage.scss';

export async function HomePage() {
    const catalogItems = await getCatalogItems();

    const popularItems = getSeasonalPopularItems(catalogItems);
    return (
        <div className="home-page">
            <Header />

            <main className="home-page__main">
                <Hero />
                <WhyChooseUs />
                <Popular items={popularItems} />
                <HowRent />
                <WhereUs />
            </main>

            <Footer />
        </div>
    );
}
