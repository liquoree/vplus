import type {
  BookingRequestDecision,
  BookingRequestItem,
  BookingRequestRecord,
} from '../../model/types';

import './AdminBookingRequestCard.scss';

type AdminBookingRequestCardProps = {
  request: BookingRequestRecord;
  isUpdating?: boolean;

  onChangeStatus: (
    requestId: string,
    status: BookingRequestDecision
  ) => void;
};

function formatDate(dateValue: string) {
  const date = new Date(
    `${dateValue}T00:00:00`
  );

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return date.toLocaleDateString('ru-RU');
}

function formatDuration(
  durationMinutes: number
) {
  const hours = Math.floor(
    durationMinutes / 60
  );

  const minutes =
    durationMinutes % 60;

  if (hours && minutes) {
    return `${hours} ч. ${minutes} мин.`;
  }

  if (hours) {
    return `${hours} ч.`;
  }

  return `${minutes} мин.`;
}

const createdAtFormatter =
  new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Europe/Moscow',
  });

function formatPrice(price: number) {
  return `${price.toLocaleString(
    'ru-RU'
  )} ₽`;
}

function getStatusText(
  status: BookingRequestRecord['status']
) {
  if (status === 'approved') {
    return 'Одобрено';
  }

  if (status === 'rejected') {
    return 'Отклонено';
  }

  if (status === 'cancelled') {
    return 'Отменено';
  }

  return 'Ожидает решения';
}

function BookingItemFields({
  item,
  index,
  itemCount,
}: {
  item: BookingRequestItem;
  index: number;
  itemCount: number;
}) {
  return (
    <div className="admin-booking-request-card__booking-item">
      {itemCount > 1 && (
        <h4 className="admin-booking-request-card__item-title">
          Позиция {index + 1}
        </h4>
      )}

      <div className="admin-booking-request-card__fields">
        <div className="admin-booking-request-card__field">
          <span>Услуга</span>

          <strong>
            {item.serviceTitle ??
              'Готовая программа'}
          </strong>
        </div>

        <div className="admin-booking-request-card__field">
          <span>Техника или пакет</span>

          <strong>
            {item.bookableItemTitle}
          </strong>
        </div>

        <div className="admin-booking-request-card__field admin-booking-request-card__field--wide">
          <span>Опция</span>

          <strong>
            {item.bookingOptionTitle}
          </strong>
        </div>

        <div className="admin-booking-request-card__field">
          <span>Дата</span>

          <strong>
            {formatDate(item.date)}
          </strong>
        </div>

        <div className="admin-booking-request-card__field">
          <span>Время</span>

          <strong>{item.time}</strong>
        </div>

        <div className="admin-booking-request-card__field">
          <span>Продолжительность</span>

          <strong>
            {formatDuration(
              item.durationMinutes
            )}
          </strong>
        </div>

        <div className="admin-booking-request-card__field">
          <span>Стоимость</span>

          <strong>
            {formatPrice(item.price)}
          </strong>
        </div>
      </div>
    </div>
  );
}

export function AdminBookingRequestCard({
  request,
  isUpdating = false,
  onChangeStatus,
}: AdminBookingRequestCardProps) {
  const isPending =
    request.status === 'pending';

  const canCancel =
    request.status === 'approved';

  const phoneHref = `tel:${request.customer.phone.replace(
    /[^\d+]/g,
    ''
  )}`;

  return (
    <article className="admin-booking-request-card">
      <div className="admin-booking-request-card__panel">
        <header className="admin-booking-request-card__header">
          <div className="admin-booking-request-card__customer">
            <strong>
              {request.customer.name}
            </strong>

            <a href={phoneHref}>
              {request.customer.phone}
            </a>

            <a
              href={`mailto:${request.customer.email}`}
            >
              {request.customer.email}
            </a>
          </div>

            <time
                className="admin-booking-request-card__created"
                dateTime={request.createdAt}
            >
                {createdAtFormatter.format(
                new Date(request.createdAt)
                )}
            </time>
        </header>

        <div className="admin-booking-request-card__items">
          {request.items.map(
            (item, index) => (
              <BookingItemFields
                item={item}
                index={index}
                itemCount={
                  request.items.length
                }
                key={[
                  item.bookableItemId,
                  item.bookingOptionId,
                  item.date,
                  item.time,
                  index,
                ].join('-')}
              />
            )
          )}
        </div>

        <div className="admin-booking-request-card__summary">
          <span>
            Итог:{' '}
            <b>
              {formatPrice(
                request.totalPrice
              )}
            </b>
          </span>

          <span>
            Предоплата:{' '}
            <b>
              {formatPrice(
                request.prepaymentPrice
              )}
            </b>
          </span>
        </div>
      </div>

      <div className="admin-booking-request-card__actions">
        {isPending ? (
          <>
            <button
              className="admin-booking-request-card__action admin-booking-request-card__action--approve"
              type="button"
              disabled={isUpdating}
              onClick={() =>
                onChangeStatus(
                  request.id,
                  'approved'
                )
              }
            >
              {isUpdating
                ? 'Обработка...'
                : 'Одобрить'}
            </button>

            <button
              className="admin-booking-request-card__action admin-booking-request-card__action--reject"
              type="button"
              disabled={isUpdating}
              onClick={() =>
                onChangeStatus(
                  request.id,
                  'rejected'
                )
              }
            >
              Отклонить
            </button>
          </>
        ) : (
          <>
            <span
              className={[
                'admin-booking-request-card__status',
                `admin-booking-request-card__status--${request.status}`,
              ].join(' ')}
            >
              {getStatusText(request.status)}
            </span>

            {canCancel && (
              <button
                className="admin-booking-request-card__action admin-booking-request-card__action--cancel"
                type="button"
                disabled={isUpdating}
                onClick={() =>
                  onChangeStatus(
                    request.id,
                    'cancelled'
                  )
                }
              >
                {isUpdating
                  ? 'Обработка...'
                  : 'Отменить'}
              </button>
            )}
          </>
        )}
      </div>
    </article>
  );
}