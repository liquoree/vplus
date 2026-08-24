'use client';

import { useMemo, useState } from 'react';

import {
    AdminBookingRequestCard,
    AdminRequestDecisionModal,
    cancelBookingRequest,
} from '@/entities/booking';
import type { AdminBookingRequestRecord } from '@/entities/booking';

import './AdminRequestsPage.scss';

type AdminRequestsPageProps = {
    initialRequests: AdminBookingRequestRecord[];
};

function sortByCreatedAt(first: AdminBookingRequestRecord, second: AdminBookingRequestRecord) {
    return new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime();
}

function sortByCancelledAt(first: AdminBookingRequestRecord, second: AdminBookingRequestRecord) {
    const firstDate = first.cancelledAt ?? first.createdAt;

    const secondDate = second.cancelledAt ?? second.createdAt;

    return new Date(secondDate).getTime() - new Date(firstDate).getTime();
}

export function AdminRequestsPage({ initialRequests }: AdminRequestsPageProps) {
    const [requests, setRequests] = useState<AdminBookingRequestRecord[]>(initialRequests);

    const [pendingCancellation, setPendingCancellation] =
        useState<AdminBookingRequestRecord | null>(null);

    const [updatingRequestId, setUpdatingRequestId] = useState<string | null>(null);

    const [error, setError] = useState('');

    const activeRequests = useMemo(
        () => requests.filter((request) => request.status === 'active').sort(sortByCreatedAt),
        [requests],
    );

    const cancelledRequests = useMemo(
        () => requests.filter((request) => request.status === 'cancelled').sort(sortByCancelledAt),
        [requests],
    );

    const handleRequestCancel = (requestId: string) => {
        const request = requests.find((currentRequest) => currentRequest.id === requestId);

        if (!request || request.status !== 'active') {
            return;
        }

        setError('');
        setPendingCancellation(request);
    };

    const closeCancelModal = () => {
        if (updatingRequestId) {
            return;
        }

        setPendingCancellation(null);
    };

    const confirmCancellation = async () => {
        if (!pendingCancellation || updatingRequestId) {
            return;
        }

        setError('');
        setUpdatingRequestId(pendingCancellation.id);

        try {
            const result = await cancelBookingRequest(
                pendingCancellation.id,
                pendingCancellation.version,
            );

            const updatedRequest = result.request;

            if (!result.success || !updatedRequest) {
                setError(result.message ?? 'Не удалось отменить заявку и оформить возврат');

                return;
            }

            setRequests((currentRequests) =>
                currentRequests.map((currentRequest) =>
                    currentRequest.id === updatedRequest.id ? updatedRequest : currentRequest,
                ),
            );

            setPendingCancellation(null);
        } catch {
            setError('Не удалось отменить заявку и оформить возврат');
        } finally {
            setUpdatingRequestId(null);
        }
    };

    return (
        <>
            <div className="admin-requests-page">
                {error && (
                    <p className="admin-requests-page__error" role="alert">
                        {error}
                    </p>
                )}

                <section className="admin-requests-page__section">
                    <h2 className="admin-requests-page__title">
                        Оплаченные заявки
                        <span>{activeRequests.length}</span>
                    </h2>

                    {activeRequests.length > 0 ? (
                        <div className="admin-requests-page__list">
                            {activeRequests.map((request) => (
                                <AdminBookingRequestCard
                                    request={request}
                                    isUpdating={updatingRequestId === request.id}
                                    onCancel={handleRequestCancel}
                                    key={request.id}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="admin-requests-page__empty">Оплаченных заявок пока нет</div>
                    )}
                </section>

                <section className="admin-requests-page__section">
                    <h2 className="admin-requests-page__title">
                        Отменённые
                        <span>{cancelledRequests.length}</span>
                    </h2>

                    {cancelledRequests.length > 0 ? (
                        <div className="admin-requests-page__list">
                            {cancelledRequests.map((request) => (
                                <AdminBookingRequestCard
                                    request={request}
                                    isUpdating={false}
                                    onCancel={handleRequestCancel}
                                    key={request.id}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="admin-requests-page__empty">Отменённых заявок пока нет</div>
                    )}
                </section>
            </div>

            {pendingCancellation && (
                <AdminRequestDecisionModal
                    request={pendingCancellation}
                    isSubmitting={updatingRequestId === pendingCancellation.id}
                    onConfirm={confirmCancellation}
                    onClose={closeCancelModal}
                />
            )}
        </>
    );
}
