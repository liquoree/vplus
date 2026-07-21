import Image from 'next/image';
import { SelectField, TextField } from '@/shared/ui';
import type { SelectFieldOption } from '@/shared/ui';

import './BookingUnitCard.scss';

type BookingUnitCardErrors = {
  catalogItemId?: string;
  bookingOptionId?: string;
  date?: string;
  time?: string;
};

type BookingUnitCardProps = {
  index: number;
  canRemove: boolean;

  catalogValue: string;
  serviceValue: string;
  dateValue: string;
  timeValue: string;

  catalogOptions: SelectFieldOption[];
  serviceOptions: SelectFieldOption[];
  timeOptions: SelectFieldOption[];

  isTimeLoading?: boolean;
  errors?: BookingUnitCardErrors;

  minDate: string;
  maxDate: string;

  onChangeCatalog: (value: string) => void;
  onChangeService: (value: string) => void;
  onChangeDate: (value: string) => void;
  onChangeTime: (value: string) => void;
  onRemove: () => void;
};

export function BookingUnitCard({
  index,
  canRemove,
  catalogValue,
  serviceValue,
  dateValue,
  timeValue,
  catalogOptions,
  serviceOptions,
  timeOptions,
  isTimeLoading = false,
  errors,
  minDate,
  maxDate,
  onChangeCatalog,
  onChangeService,
  onChangeDate,
  onChangeTime,
  onRemove,
}: BookingUnitCardProps) {
  return (
    <section className="booking-unit-card">
      <div className="booking-unit-card__header">
        <h2 className="booking-unit-card__title">
          Техника #{index + 1}
        </h2>

        {canRemove && (
          <button
            className="booking-unit-card__remove"
            type="button"
            aria-label="Удалить технику"
            onClick={onRemove}
          >
            <Image
              src="/images/icons/remove.svg"
              alt=""
              width={28}
              height={28}
            />
          </button>
        )}
      </div>

      <div className="booking-unit-card__fields">
        <SelectField
          label="Техника"
          value={catalogValue}
          placeholder="Выберите технику"
          options={catalogOptions}
          error={errors?.catalogItemId}
          required
          onChange={onChangeCatalog}
        />

        <SelectField
          label="Услуга"
          value={serviceValue}
          placeholder="Выберите услугу"
          options={serviceOptions}
          error={errors?.bookingOptionId}
          required
          onChange={onChangeService}
        />

        <TextField
          label="Дата"
          type="date"
          value={dateValue}
          icon="select-date"
          min={minDate}
          max={maxDate}
          error={errors?.date}
          required
          onChange={(event) => onChangeDate(event.target.value)}
        />

        <SelectField
          label="Время"
          value={timeValue}
          placeholder={
            isTimeLoading
              ? 'Загрузка времени...'
              : 'Выберите время'
          }
          options={timeOptions}
          error={errors?.time}
          required
          onChange={onChangeTime}
        />
      </div>
    </section>
  );
}