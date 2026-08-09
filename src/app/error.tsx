'use client';

import {
  useEffect,
} from 'react';

import {
  ErrorPage,
} from '@/views/error/ErrorPage';

type ErrorProps = {
  error: Error & {
    digest?: string;
  };

  reset: () => void;
};

export default function Error({
  error,
  reset,
}: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorPage
      code="500"
      title="Что-то пошло не так"
      description={
        'Произошла внутренняя ошибка. Попробуйте повторить действие или вернуться на главную.'
      }
      onRetry={reset}
    />
  );
}