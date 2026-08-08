'use client';

import {
  useMemo,
  useState,
} from 'react';

import {
  AdminBookingRequestCard,
  AdminRequestDecisionModal,
  updateBookingRequestStatus,
} from '@/entities/booking';

import type {
  AdminBookingRequestRecord,
  BookingRequestDecision,
} from '@/entities/booking';

import './AdminRequestsPage.scss';

type AdminRequestsPageProps = {
  initialRequests: AdminBookingRequestRecord[];
};

type PendingDecision = {
  request: AdminBookingRequestRecord;
  decision: BookingRequestDecision;
};

function sortByCreatedAt(
  first: AdminBookingRequestRecord,
  second: AdminBookingRequestRecord
) {
  return (
    new Date(second.createdAt).getTime() -
    new Date(first.createdAt).getTime()
  );
}

function sortByReviewedAt(
  first: AdminBookingRequestRecord,
  second: AdminBookingRequestRecord
) {
  const firstDate =
    first.reviewedAt ?? first.createdAt;

  const secondDate =
    second.reviewedAt ?? second.createdAt;

  return (
    new Date(secondDate).getTime() -
    new Date(firstDate).getTime()
  );
}

function canApplyDecision(
  request: AdminBookingRequestRecord,
  decision: BookingRequestDecision
) {
  if (request.status === 'pending') {
    return (
      decision === 'approved' ||
      decision === 'rejected'
    );
  }

  if (request.status === 'approved') {
    return decision === 'cancelled';
  }

  return false;
}

export function AdminRequestsPage({
  initialRequests,
}: AdminRequestsPageProps) {
  const [
    requests,
    setRequests,
  ] = useState<
    AdminBookingRequestRecord[]
  >(initialRequests);

  const [
    pendingDecision,
    setPendingDecision,
  ] = useState<PendingDecision | null>(
    null
  );

  const [
    updatingRequestId,
    setUpdatingRequestId,
  ] = useState<string | null>(null);

  const [error, setError] =
    useState('');

  const pendingRequests = useMemo(
    () =>
      requests
        .filter(
          (request) =>
            request.status === 'pending'
        )
        .sort(sortByCreatedAt),
    [requests]
  );

  const processedRequests = useMemo(
    () =>
      requests
        .filter(
          (request) =>
            request.status !== 'pending'
        )
        .sort(sortByReviewedAt),
    [requests]
  );

  const handleRequestDecision = (
    requestId: string,
    decision: BookingRequestDecision
  ) => {
    const request =
      requests.find(
        (currentRequest) =>
          currentRequest.id === requestId
      );

    if (
      !request ||
      !canApplyDecision(
        request,
        decision
      )
    ) {
      return;
    }

    setError('');

    setPendingDecision({
      request,
      decision,
    });
  };

  const closeDecisionModal = () => {
    if (updatingRequestId) {
      return;
    }

    setPendingDecision(null);
  };

  const confirmDecision = async () => {
    if (
      !pendingDecision ||
      updatingRequestId
    ) {
      return;
    }

    const {
      request,
      decision,
    } = pendingDecision;

    setError('');
    setUpdatingRequestId(
      request.id
    );

    try {
      const result =
        await updateBookingRequestStatus(
          request.id,
          decision,
          request.version
        );

      const updatedRequest =
        result.request;

      if (
        !result.success ||
        !updatedRequest
      ) {
        setError(
          result.message ??
            'Не удалось изменить статус заявки'
        );

        return;
      }

      setRequests(
        (currentRequests) =>
          currentRequests.map(
            (currentRequest) =>
              currentRequest.id ===
              updatedRequest.id
                ? updatedRequest
                : currentRequest
          )
      );

      setPendingDecision(null);
    } catch {
      setError(
        'Не удалось изменить статус заявки'
      );
    } finally {
      setUpdatingRequestId(null);
    }
  };

  return (
    <>
      <div className="admin-requests-page">
        {error && (
          <p
            className="admin-requests-page__error"
            role="alert"
          >
            {error}
          </p>
        )}

        <section className="admin-requests-page__section">
          <h2 className="admin-requests-page__title">
            Непросмотренные

            <span>
              {pendingRequests.length}
            </span>
          </h2>

          {pendingRequests.length > 0 ? (
            <div className="admin-requests-page__list">
              {pendingRequests.map(
                (request) => (
                  <AdminBookingRequestCard
                    request={request}
                    isUpdating={
                      updatingRequestId ===
                      request.id
                    }
                    onChangeStatus={
                      handleRequestDecision
                    }
                    key={request.id}
                  />
                )
              )}
            </div>
          ) : (
            <div className="admin-requests-page__empty">
              Новых заявок пока нет
            </div>
          )}
        </section>

        <section className="admin-requests-page__section">
          <h2 className="admin-requests-page__title">
            Просмотренные

            <span>
              {processedRequests.length}
            </span>
          </h2>

          {processedRequests.length > 0 ? (
            <div className="admin-requests-page__list">
              {processedRequests.map(
                (request) => (
                  <AdminBookingRequestCard
                    request={request}
                    isUpdating={
                      updatingRequestId ===
                      request.id
                    }
                    onChangeStatus={
                      handleRequestDecision
                    }
                    key={request.id}
                  />
                )
              )}
            </div>
          ) : (
            <div className="admin-requests-page__empty">
              Обработанных заявок пока нет
            </div>
          )}
        </section>
      </div>

      {pendingDecision && (
        <AdminRequestDecisionModal
          request={
            pendingDecision.request
          }
          decision={
            pendingDecision.decision
          }
          isSubmitting={
            updatingRequestId ===
            pendingDecision.request.id
          }
          onConfirm={
            confirmDecision
          }
          onClose={
            closeDecisionModal
          }
        />
      )}
    </>
  );
}