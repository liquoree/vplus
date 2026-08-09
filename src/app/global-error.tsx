'use client';

import {
  ErrorPage,
} from '@/views/error/ErrorPage';

type GlobalErrorProps = {
  error: Error & {
    digest?: string;
  };

  reset: () => void;
};

export default function GlobalError({
  reset,
}: GlobalErrorProps) {
  return (
    <html lang="ru">
      <body className="global-error-body">
        <ErrorPage
          code="500"
          title="Сайт временно недоступен"
          description={
            'Произошла внутренняя ошибка. Попробуйте загрузить страницу ещё раз.'
          }
          onRetry={reset}
        />
      </body>
    </html>
  );
}