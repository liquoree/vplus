import type { ReactNode } from 'react';

import {
  AdminLogoutButton,
} from './admin-logout-button/AdminLogoutButton';

import { Header } from '@/widgets';
import {
  AdminNavigation,
} from '@/widgets/admin-navigation/AdminNavigation';

import './AdminShell.scss';

type AdminShellProps = {
  children: ReactNode;
};

export function AdminShell({
  children,
}: AdminShellProps) {
  return (
    <div className="admin-shell">
      <Header mobileTitle="Админ-панель" />

      <main className="admin-shell__main">
        <div className="admin-shell__container">
          <header className="admin-shell__heading">
            <div className="admin-shell__heading-content">
              <h1 className="admin-shell__title">
                Админ-панель
              </h1>

              <p className="admin-shell__description">
                Управляйте информацией на сайте и
                заявками
              </p>
            </div>

            <div className="admin-shell__logout">
              <AdminLogoutButton />
            </div>
          </header>

          <div className="admin-shell__navigation">
            <AdminNavigation />
          </div>

          <div className="admin-shell__content">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}