import Image from 'next/image';

import { SelectField, TextField } from '@/shared/ui';
import type { SelectFieldOption } from '@/shared/ui';

import type { BookingLineErrors } from '../model/types';

import './BookingUnitCard.scss';

type BookingUnitCardProps = {
    index: number;
    canRemove: boolean;

    serviceValue: string;
    bookableItemValue: string;
    bookingOptionValue: string;
    dateValue: string;
    timeValue: string;

    serviceOptions: SelectFieldOption[];
    bookableItemOptions: SelectFieldOption[];
    bookingOptionOptions: SelectFieldOption[];
    timeOptions: SelectFieldOption[];

    isPackage?: boolean;
    isTimeLoading?: boolean;

    errors?: BookingLineErrors;

    minDate: string;
    maxDate: string;

    onChangeService: (value: string) => void;

    onChangeBookableItem: (value: string) => void;

    onChangeBookingOption: (value: string) => void;

    onChangeDate: (value: string) => void;
    onChangeTime: (value: string) => void;

    onRemove: () => void;
};

export function BookingUnitCard({
    index,
    canRemove,

    serviceValue,
    bookableItemValue,
    bookingOptionValue,
    dateValue,
    timeValue,

    serviceOptions,
    bookableItemOptions,
    bookingOptionOptions,
    timeOptions,

    isPackage = false,
    isTimeLoading = false,

    errors,

    minDate,
    maxDate,

    onChangeService,
    onChangeBookableItem,
    onChangeBookingOption,
    onChangeDate,
    onChangeTime,
    onRemove,
}: BookingUnitCardProps) {
    const canSelectBookingOption =
        Boolean(bookableItemValue) && (isPackage || Boolean(serviceValue));

    const canSelectDate = Boolean(bookingOptionValue);

    const canSelectTime = Boolean(bookingOptionValue) && Boolean(dateValue) && !isTimeLoading;

    return (
        <section className="booking-unit-card">
            <div className="booking-unit-card__header">
                <h2 className="booking-unit-card__title">Бронирование #{index + 1}</h2>

                {canRemove && (
                    <button
                        className="booking-unit-card__remove"
                        type="button"
                        aria-label="Удалить бронирование"
                        onClick={onRemove}
                    >
                        <Image src="/images/icons/remove.svg" alt="" width={28} height={28} />
                    </button>
                )}
            </div>

            <div className="booking-unit-card__fields">
                <SelectField
                    className="booking-unit-card__field booking-unit-card__field--service"
                    label="Услуга"
                    value={serviceValue}
                    placeholder={isPackage ? 'Готовая программа' : 'Выберите услугу'}
                    options={serviceOptions}
                    error={errors?.serviceId}
                    required={!isPackage}
                    allowEmptySelection
                    isDisabled={isPackage}
                    onChange={onChangeService}
                />

                <SelectField
                    className="booking-unit-card__field booking-unit-card__field--bookable"
                    label="Техника или пакет"
                    value={bookableItemValue}
                    placeholder="Выберите технику или пакет"
                    options={bookableItemOptions}
                    error={errors?.bookableItemId}
                    required
                    allowEmptySelection
                    onChange={onChangeBookableItem}
                />

                <SelectField
                    className="booking-unit-card__field booking-unit-card__field--option"
                    label="Опция"
                    value={bookingOptionValue}
                    placeholder={
                        isPackage ? 'Выберите вариант пакета' : 'Выберите количество людей и время'
                    }
                    options={bookingOptionOptions}
                    error={errors?.bookingOptionId}
                    required
                    allowEmptySelection
                    isDisabled={!canSelectBookingOption}
                    onChange={onChangeBookingOption}
                />

                <TextField
                    className="booking-unit-card__field booking-unit-card__field--date"
                    label="Дата"
                    type="date"
                    value={dateValue}
                    icon="select-date"
                    min={minDate}
                    max={maxDate}
                    error={errors?.date}
                    required
                    disabled={!canSelectDate}
                    onChange={(event) => onChangeDate(event.target.value)}
                />

                <SelectField
                    className="booking-unit-card__field booking-unit-card__field--time"
                    label="Время"
                    value={timeValue}
                    placeholder={isTimeLoading ? 'Загрузка времени...' : 'Выберите время'}
                    options={timeOptions}
                    error={errors?.time}
                    required
                    allowEmptySelection
                    isDisabled={!canSelectTime}
                    onChange={onChangeTime}
                />
            </div>
        </section>
    );
}
