'use client';

import { useState } from 'react';

import './AdminLogoutButton.scss';

export function AdminLogoutButton() {
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const handleLogout = async () => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(
        '/api/admin/auth/logout',
        {
          method: 'POST',
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error(
          'Не удалось завершить сессию'
        );
      }

      /*
       * Полная навигация гарантирует, что:
       * 1. сервер заново проверит cookie;
       * 2. клиентское состояние админки очистится;
       * 3. пользователь попадёт на страницу входа.
       */
      window.location.replace('/admin');
    } catch {
      setError(
        'Не удалось выйти. Попробуйте ещё раз.'
      );

      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-logout-button">
      <button
        className="admin-logout-button__control"
        type="button"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
        onClick={handleLogout}
      >
        <svg
          className="admin-logout-button__icon"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M10 17L15 12L10 7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <path
            d="M15 12H3"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />

          <path
            d="M14 4H19C20.1046 4 21 4.89543 21 6V18C21 19.1046 20.1046 20 19 20H14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>

        <span>
          {isSubmitting
            ? 'Выходим…'
            : 'Выйти'}
        </span>
      </button>

      {error && (
        <span
          className="admin-logout-button__error"
          role="alert"
        >
          {error}
        </span>
      )}
    </div>
  );
}