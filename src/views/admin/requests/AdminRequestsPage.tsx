'use client';

import {
  useMemo,
  useState,
  useSyncExternalStore,
} from 'react';

import {
  AdminBookingRequestCard,
  AdminRequestDecisionModal,
  getBookingRequestsServerSnapshot,
  getBookingRequestsSnapshot,
  parseBookingRequestsSnapshot,
  subscribeBookingRequests,
  updateBookingRequestStatus,
} from '@/entities/booking';

import type {
  BookingRequestDecision,
  BookingRequestRecord,
} from '@/entities/booking';

import './AdminRequestsPage.scss';

type PendingDecision = {
  request: BookingRequestRecord;
  decision: BookingRequestDecision;
};

function sortByCreatedAt(
  first: BookingRequestRecord,
  second: BookingRequestRecord
) {
  return (
    new Date(second.createdAt).getTime() -
    new Date(first.createdAt).getTime()
  );
}

function sortByReviewedAt(
  first: BookingRequestRecord,
  second: BookingRequestRecord
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

export function AdminRequestsPage() {
  const snapshot = useSyncExternalStore(
    subscribeBookingRequests,
    getBookingRequestsSnapshot,
    getBookingRequestsServerSnapshot
  );

  const requests = useMemo(
    () =>
      parseBookingRequestsSnapshot(
        snapshot
      ),
    [snapshot]
  );

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

  const [error, setError] = useState('');

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
    const request = requests.find(
      (currentRequest) =>
        currentRequest.id === requestId
    );

    if (
      !request ||
      request.status !== 'pending'
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
    setUpdatingRequestId(request.id);

    try {
      const result =
        await updateBookingRequestStatus(
          request.id,
          decision
        );

      if (!result.success) {
        setError(
          result.message ??
            'Не удалось изменить статус заявки'
        );

        return;
      }

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
          request={pendingDecision.request}
          decision={
            pendingDecision.decision
          }
          isSubmitting={
            updatingRequestId ===
            pendingDecision.request.id
          }
          onConfirm={confirmDecision}
          onClose={closeDecisionModal}
        />
      )}
    </>
  );
}