import { Hero } from './hero/Hero';
import { WhyChooseUs } from './why-choose-us/WhyChooseUs';
import { HowRent } from './how-rent/HowRent';
import { Popular } from './popular/Popular';
import { WhereUs } from './where-us/WhereUs';

import { Footer, Header } from '@/widgets';
import { getCatalogItems } from '@/entities/catalog';

import './HomePage.scss';

export async function HomePage() {
  const catalogItems = await getCatalogItems();

  const popularItems = catalogItems
    .filter((item) => item.isPopular && item.kind !== 'service')
    .slice(0, 4);
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