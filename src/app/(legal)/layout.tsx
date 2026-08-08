import type {
  ReactNode,
} from 'react';

import {
  Header,
} from '@/widgets';

import './LegalLayout.scss';

type LegalLayoutProps = {
  children: ReactNode;
};

export default function LegalLayout({
  children,
}: LegalLayoutProps) {
  return (
    <div className="legal-shell">
      <Header />

      <main className="legal-shell__main">
        <div className="legal-shell__container">
          <header className="legal-shell__heading">
            <div className="legal-shell__heading-content">
              <h1 className="legal-shell__title">
                Документы
              </h1>

              <p className="legal-shell__description">
                Правовая информация и условия
                использования услуг
                «Вездеход+ Карелия»
              </p>
            </div>
          </header>

          <div className="legal-shell__content">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}